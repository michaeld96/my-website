import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useDropzone } from 'react-dropzone';
import './Editor.css'

const Editor: React.FC = () => {
    // returns state value, and a function to update the state.
    const [schools, setSchools] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>('');
    const [showTitlePopUp, setShowTitlePopUp] = useState(false);
    const [showDeleteNotePopUp, setDeleteNotePopUp] = useState(false);
    const [newTitle, setNewTitle] = useState<string>('');

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>('');
    const [imageURL, setImageURL] = useState<string>('');

    // const baseUrl = process.env.REACT_APP_API_URL;

    function check_school_subject_title_selected(): boolean
     {
        if (!selectedSchool || !selectedSubject || !selectedTitle) 
        {
            alert("Please select school, subject, and title first.");
            return false;
        }
        return true;
     }

    function check_school_subject_selected(): boolean
    {
        if (!selectedSchool || !selectedSubject) 
        {
            alert("Please select school and subject.");
            return false;
        }
        return true;
    }

    async function getMarkdownAsync(school: string | null, subject: string | null, title: string | null): Promise<string>
    {
        try
        {
            const response = await axios.get(`http://localhost:5003/api/notes/${school}/${subject}/${title}`);
            return response.data;
        }
        catch (error)
        {
            console.error("ERROR: Failed to get markdown", error);
            alert("ERROR: Cannot get markdown!");
            return "";
        }
    }

    async function getAllTitlesAsync(school: string | null, subject: string | null): Promise<string[]>
    {
        try
        {
            const response = await axios.get(`http://localhost:5003/api/notes/${school}/${subject}/titles`);
            return response.data;
        }
        catch (error)
        {
            console.error("ERROR: Cannot get all titles for this subject.");
            alert("ERROR: Cannot get all titles for this subject.");
            return [];   
        }
    }

    useEffect(() => {
        const fetchSchools = async () => {
            const response = await axios.get('http://localhost:5003/api/notes/schools');
            setSchools(response.data);
        };
        fetchSchools();
    }, []);

    const handleSchoolClick = async (school: string) => {
        setSelectedSchool(school);
        setSubjects([]); // Clear subjects when switching schools.
        setTitles([]); // Clear titles when switching schools.
        setMarkdown(''); // Clear markdown.
        setSelectedSubject(null);
        setSelectedTitle(null);
        const response = await axios.get(`http://localhost:5003/api/notes/${school}/subjects`);
        setSubjects(response.data);
    };

    const handleSubjectClick = async (subject: string) => {
        setSelectedSubject(subject);
        setTitles([]); // Clear titles when switching subjects
        setMarkdown(''); // Clear markdown
        setSelectedTitle(null);
        const titles = await getAllTitlesAsync(selectedSchool, subject);
        setTitles(titles);
    };

    const handleTitleClick = async (title: string) => {
        setSelectedTitle(title);
        const response = await getMarkdownAsync(selectedSchool, selectedSubject, title);
        setMarkdown(response);
    };

    const updateNote = async () => {

        
        if (check_school_subject_title_selected())
        {
            try 
            {
                await axios.put(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${selectedTitle}`, 
                {
                    school: selectedSchool,
                    subject: selectedSubject,
                    title: selectedTitle,
                    content: markdown,
                });
                alert("Note updated successfully!");
            } 
            catch (error) 
            {
                console.error('ERROR: Failed to update not.', error);
                alert("Failed to update note. Please try again.");
            }
        }
    };

    const handleCreateNote = async () => {
        if (check_school_subject_selected())
        {
            try
            {
                await axios.post(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${newTitle}`,
                    {
                        school: selectedSchool,
                        subject: selectedSubject,
                        title: newTitle,
                        content: "",
                    }
                );
                alert('New note saved!');
                setSelectedTitle(newTitle);
                setShowTitlePopUp(false);
                setMarkdown('');
                setNewTitle('');
                const response = await getAllTitlesAsync(selectedSchool, selectedSubject);
                setTitles(response);
                
            } 
            catch (error)
            {
                console.error('ERROR: Failed to save new content.');
                alert('Failed to save new note. Please try again');
            }
        }
    }

    const handleDeleteNote = async () => {
        try
        {
            await axios.delete(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${selectedTitle}`);
            alert("Note has been successfully deleted!");
            setDeleteNotePopUp(false);
            const response = await getAllTitlesAsync(selectedSchool, selectedSubject);
            setTitles(response);

            if (response.length > 0)
            {
                // If there is more content, let's just set it to the first one.
                const nextTitle = response[0];
                setSelectedTitle(nextTitle);
                const markdown = await getMarkdownAsync(selectedSchool, selectedSubject, nextTitle);
                setMarkdown(markdown);
            }
            else
            {
                setSelectedTitle('');
                setMarkdown('');
            }
            setTitles(response);  
        }
        catch (error)
        {
            console.error("ERROR: Failed to delete note!");
            alert("Failed to delete note.");
        }
    }

    // ---------------------------- //
    // Drag-and-Drop for Images     //
    // ---------------------------- //
    const onDrop = useCallback(async (acceptFiles: File[]) => {
        // handling multiple files, just in case.
        for (const file of acceptFiles)
        {
            try 
            {
                // upload the file to the backend.
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('http://localhost:5003/api/notes/uploadImage', formData, {
                    headers: { 'Content-Type': `multipart/form-data` }
                });
                // the response contains the public S3 URL.
                const { url } = response.data;
                // insert the markdown syntax in the markdown file.
                const imageMarkdown = `\n![${file.name}](${url})`;
                setMarkdown((prev) => prev + imageMarkdown);
            }
            catch (error)
            {
                console.error('Error uploading file: ', error);
                alert('Failed to upload image.');
            }
        }
    }, [setMarkdown]);

    // useDropzone hook.
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

    return (
    <>
    {showTitlePopUp && (
        <div className='title-pop-up'>
            <input
                type='text'
                value={newTitle}
                onChange={(e) => { setNewTitle(e.target.value) }}
                placeholder="Enter new note title."
            />
            <div className='title-pop-up-buttons'>
                <button onClick={ handleCreateNote }>
                    Create
                </button>
                <button onClick={() => { setShowTitlePopUp(false) }}>
                    Cancel
                </button>
            </div>
        </div>
    )}
    {showDeleteNotePopUp && (
        <div className='title-pop-up'>
            <h2>Are you sure you want to delete this note?</h2>
            <div className='title-pop-up-buttons'>
                <button onClick={ handleDeleteNote }>
                    Delete
                </button>
                <button onClick={() => { setDeleteNotePopUp(false) }}>
                    Cancel
                </button>
            </div>
        </div>
    )}
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {/* Left Panel: Collapsible Menu */}
            <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc' }}>
                <h3>Schools</h3>
                <ul>
                    {schools.map((school) => (
                        <li 
                        key={school}
                        className={`list-item ${school == selectedSchool ? 'active' : ''}`}
                        onClick={() => handleSchoolClick(school)}
                        >
                            {school}
                        </li>
                    ))}
                </ul>
                {selectedSchool && (
                    <>
                        <h4>Subjects</h4>
                        <ul>
                            {subjects.map((subject) => (
                                <li 
                                    key={subject} 
                                    className={`list-item ${subject == selectedSubject ? 'active' : ''}`}
                                    onClick={() => handleSubjectClick(subject)}>
                                    {subject}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {selectedSubject && (
                    <>
                        <div className='editor-header-alignment'>
                            <h4>Titles</h4>
                            <button 
                                className='create-button'
                                onClick={ () => { setShowTitlePopUp(true)} }
                            >
                                Create Note
                            </button>
                            <button 
                                className='create-button'
                                onClick={ () => {
                                        if (!selectedTitle)
                                        {
                                            alert("Must select a title to delete!");    
                                        }
                                        else 
                                        {
                                            setDeleteNotePopUp(true);
                                        }
                                    }
                                }
                            >
                                Delete Note
                            </button>
                        </div>
                        <ul>
                            {titles.map((title) => (
                                <li 
                                    key={title} 
                                    onClick={() => handleTitleClick(title)}
                                    className={`list-item ${title == selectedTitle ? 'active' : ''}`}
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* Middle Panel: Markdown Editor */}
            <div style={{ width: '40%', padding: '10px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
                {/* Drag-and-drop area: wrap your text area */}
                 <div
                    {...getRootProps()}
                    style={{
                        flex: 1,
                        marginBottom: '10px',
                    }}
                    >
                    {/* Keep the input hidden to accept drops, but it won't open on click */}
                    <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <textarea
                        style={{ width: '100%', height: '100%', border: 'none', resize: 'none', background: 'inherit' }}
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        />
                    )}
                </div>
                <button onClick={updateNote} style={{ padding: '10px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Update Note
                </button>
            </div>

            {/* Right Panel: Rendered Markdown */}
            <div style={{ width: '40%', padding: '10px', overflow: 'scroll'}}>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[
                        rehypeKatex,
                        rehypeHighlight,
                        [rehypeRaw, { allowDangerousHtml: true }]
                    ]}
                >
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    </>
    );
};


export default Editor;
