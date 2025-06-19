import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useDropzone } from 'react-dropzone';
import './Editor.css'
import { School } from '../types/school';
import { Subject } from '../types/subject';
import { Note } from '../types/note';
import { SchoolSelector } from '../components/editor/SchoolSelector';
import { SubjectSelector } from '../components/editor/SubjectSelector';
import { SidePanelButton } from '../components/editor/Common/SidePanelButton';
import { verifySelected } from '../utils/editor-helpers/verifySelected';
import { NoteSelector } from '../components/editor/NoteSelector';
import { UpsertPopUp } from '../components/editor/UpsertPopUp';
import { DeletePopUp } from '../components/editor/DeletePopUp';
import { notesService } from '../services/notesService';
import { useSchools } from '../hooks/useSchools';
import { useSubjects } from '../hooks/useSubjects';
import { useNotes } from '../hooks/useNotes';
import { useMarkdown } from '../hooks/useMarkdown';

const Editor: React.FC = () => {
    // const [subjects, setSubjects] = useState<Subject[]>([]);
    // const [notes, setNotes] = useState<Note[]>([]);
    const [markdown, setMarkdown] = useState<string>('');
    const [showCreateNotePopUp, setShowCreateNotePopUp] = useState(false);
    const [showDeleteNotePopUp, setDeleteNotePopUp] = useState(false);
    const [showEditNotePopUp, setShowEditNotePopUp] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState<string>('');
    // These will remain and stay with the editor.
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedNote, setselectedNote] = useState<Note | null>(null);

    // New states.

    function check_school_subject_title_selected(): boolean
     {
        if (!selectedSchool || !selectedSubject || !selectedNote) 
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

    async function getMarkdownAsync(schoolId: number | null, subjectId: number | null, noteId: number | null): Promise<string>
    {
        try
        {
            const markdown = await notesService.getMarkdown(schoolId, subjectId, noteId);
            return markdown;
        }
        catch (error)
        {
            console.error("ERROR: Failed to get markdown", error);
            alert("ERROR: Cannot get markdown!");
            return "";
        }
    }

    async function getAllTitlesAsync(schoolId?: number, subjectId?: number): Promise<Note[]>
    {
        try
        {
            const allNotes = await notesService.getNotes(schoolId, subjectId);
            return allNotes;
        }
        catch (error)
        {
            console.error("ERROR: Cannot get all titles for this subject.");
            alert("ERROR: Cannot get all titles for this subject.");
            return [];   
        }
    }
    const schools = useSchools();
    const subjects = useSubjects(selectedSchool?.id);
    const { notes, createNote } = useNotes(selectedSchool?.id, selectedSubject?.id);

    const handleNoteClick = async (title: Note) => {
        setselectedNote(title);
        const response = await getMarkdownAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null, title.id);
        setMarkdown(response);
    };

    const updateNote = async () => {
        if (check_school_subject_title_selected())
        {
            try 
            {
                await notesService.updateNotesMarkdown(selectedSchool?.id, selectedSubject?.id, selectedNote?.id, markdown);
                alert("Note updated successfully!");
            } 
            catch (error) 
            {
                console.error('ERROR: Failed to update not.', error);
                alert("Failed to update note. Please try again.");
            }
        }
    };

    const handleDeleteNote = async () => {
        try
        {
            await notesService.deleteNote(selectedSchool?.id, selectedSubject?.id, selectedNote?.id);
            alert("Note has been successfully deleted!");
            setDeleteNotePopUp(false);
            const response = await getAllTitlesAsync(selectedSchool?.id, selectedSubject?.id);
            // setNotes(response);

            if (response.length > 0)
            {
                // If there is more content, let's just set it to the first one.
                const nextTitle = response[0];
                setselectedNote(nextTitle);
                const markdown = await getMarkdownAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null, nextTitle.id);
                setMarkdown(markdown);
            }
            else
            {
                setselectedNote(null);
                setMarkdown('');
            }
            // setNotes(response);  
        }
        catch (error)
        {
            console.error("ERROR: Failed to delete note!");
            alert("Failed to delete note.");
        }
    }
    const handleEditNote = async () => {
        if (newNoteTitle == "")
        {
            alert("Note title must not be empty");
            return;
        }
        try
        {
            await notesService.updateNoteTitle(selectedNote?.id, newNoteTitle);
            setShowEditNotePopUp(false);
            const response = await getAllTitlesAsync(selectedSchool?.id, selectedSubject?.id);
            // setNotes(response);
            
            const updatedTitle = response.find(note => note.id == selectedNote?.id);
            if (updatedTitle)
            {
                setselectedNote(updatedTitle);
            }

            setNewNoteTitle('');
        }
        catch (error)
        {
            console.error("ERROR: Failed to edit note!");
            alert("Failed to edit note.");
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
    {showCreateNotePopUp && (
        <UpsertPopUp
            popUpTitle={newNoteTitle} 
            placeholder='Enter new note title.'
            upsertEntityName={setNewNoteTitle}
            confirmUpsertEntity={() => {
                if (newNoteTitle != '')
                {
                    createNote(newNoteTitle);
                    setShowCreateNotePopUp(false);
                    setNewNoteTitle('');
                }
                else
                {
                    alert("Note must not have an empty title.");
                }
            }}
            confirmUpdateLable='Create'
            closePopUp={setShowCreateNotePopUp}
            cancelLable='Cancel'
        />
    )}
    {showDeleteNotePopUp && (
        <DeletePopUp
            deleteUIHeader='Are you sure you want to delete this note?'
            confirmDelete={ handleDeleteNote }
            confirmLable='Delete'
            closePopUp={ setDeleteNotePopUp }
            cancelLable='Cancel'
        />
    )}
    {showEditNotePopUp && (
        <UpsertPopUp
            popUpTitle={newNoteTitle}
            placeholder='Enter new note title.'
            upsertEntityName={setNewNoteTitle}
            confirmUpsertEntity={handleEditNote}
            confirmUpdateLable='Edit'
            closePopUp={setShowEditNotePopUp}
            cancelLable='Cancel'
         />
    )}
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {/* Left Panel: Collapsible Menu */}
            <div style={{ width: '20%', padding: '10px', borderRight: '1px solid #ccc', overflow: `scroll`}}>
                <SchoolSelector
                    schools={schools}
                    selectedSchool={selectedSchool}
                    onSchoolSelect={(school: School) => { setSelectedSchool(school)} }
                />
                {selectedSchool && (
                    <SubjectSelector
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        handleSubjectClick={(subject: Subject) => { 
                            setSelectedSubject(subject) 
                        }}
                    />
                )}
                {selectedSubject && (
                    <>
                        <div className='editor-header-alignment'>
                            <h4>Titles</h4>
                            <SidePanelButton 
                                className="edit-button"
                                onClick={ () => setShowCreateNotePopUp(true) }
                                buttonUIDisplay='Create'                          
                            />
                            <SidePanelButton 
                                className="edit-button"
                                onClick={() => verifySelected(
                                    !!selectedNote, 
                                    "Must select a note to delete!", 
                                    () => setDeleteNotePopUp(true)
                                )}
                                buttonUIDisplay='Delete'                          
                            />
                            <SidePanelButton
                                className='edit-button'
                                onClick={() => verifySelected(
                                    !!selectedNote,
                                    "Must select a note to edit!",
                                    () => setShowEditNotePopUp(true)
                                )}
                                buttonUIDisplay='Edit'
                            />
                        </div>
                        <NoteSelector 
                            notes={notes}
                            selectedNote={selectedNote}
                            handleNoteClick={handleNoteClick}
                        />
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
