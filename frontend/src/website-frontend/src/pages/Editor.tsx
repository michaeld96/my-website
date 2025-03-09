import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useDropzone } from 'react-dropzone';

const Editor: React.FC = () => {
    // returns state value, and a function to update the state.
    const [schools, setSchools] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>('');

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>('');
    const [imageURL, setImageURL] = useState<string>('');

    // const baseUrl = process.env.REACT_APP_API_URL;

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
        const response = await axios.get(`http://localhost:5003/api/notes/${selectedSchool}/${subject}/titles`);
        setTitles(response.data);
    };

    const handleTitleClick = async (title: string) => {
        setSelectedTitle(title);
        const response = await axios.get(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${title}`);
        setMarkdown(response.data);
    };

    const updateNote = async () => {
        if (!selectedSchool || !selectedSubject || !selectedTitle) 
        {
            alert("Please select school, subject, and title first.");
            return;
        }

        try 
        {
            const response = await axios.put(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${selectedTitle}`, {
                school: selectedSchool,
                subject: selectedSubject,
                title: selectedTitle,
                content: markdown,
            });
            alert("Note updated successfully!");
        } 
        catch (error) 
        {
            console.error('Error updating note:', error);
            alert("Failed to update note. Please try again.");
        }
    };

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
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {/* Left Panel: Collapsible Menu */}
            <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc' }}>
                <h3>Schools</h3>
                <ul>
                    {schools.map((school) => (
                        <li key={school} onClick={() => handleSchoolClick(school)}>
                            {school}
                        </li>
                    ))}
                </ul>
                {selectedSchool && (
                    <>
                        <h4>Subjects</h4>
                        <ul>
                            {subjects.map((subject) => (
                                <li key={subject} onClick={() => handleSubjectClick(subject)}>
                                    {subject}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {selectedSubject && (
                    <>
                        <h4>Titles</h4>
                        <ul>
                            {titles.map((title) => (
                                <li key={title} onClick={() => handleTitleClick(title)}>
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
            <div style={{ width: '40%', padding: '10px' }}>
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
    );
};

export default Editor;
