import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
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
import { UpsertPopUpSubjects } from '../components/editor/UpsertPopUpSubjects';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import "katex/dist/katex.min.css";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import 'highlight.js/styles/github.css'; 

const Editor: React.FC = () => {
    // returns state value, and a function to update the state.
    const [schools, setSchools] = useState<School[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [markdown, setMarkdown] = useState<string>('');

    const [showCreateNotePopUp, setShowCreateNotePopUp] = useState(false);
    const [showDeleteNotePopUp, setDeleteNotePopUp] = useState(false);
    const [showEditNotePopUp, setShowEditNotePopUp] = useState(false);

    const [showCreateSubjectPopup, setShowSubjectNotePopUp] = useState(false);
    const [showEditSubjectPopup, setShowEditSubjectPopup] = useState(false);
    const [showDeleteSubjectPopup, setShowDeleteSubjectPopup] = useState(false);

    const [showCreateSchoolPopup, setShowCreateSchoolPopup] = useState(false);
    const [showEditSchoolPopup, setShowEditSchoolPopup] = useState(false);
    const [showDeleteSchoolPopup, setShowDeleteSchoolPopup] = useState(false);
    const [newSchoolTitle, setNewSchoolTitle] = useState<string>('');
    const [newSchoolCode, setNewSchoolCode] = useState<string>('');

    const [newSubjectTitle, setNewSubjectTitle] = useState<string>('');
    const [newSubjectCode, setNewSubjectCode] = useState<string>('');

    const [newNoteTitle, setNewNoteTitle] = useState<string>('');
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE + '/auth';

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

    function valid_title_and_code(title: string, code: string): boolean {
        if (title.length == 0)
        {
            alert("Subject title cannot be empty");
            return false;
        }
        if (code.length == 0)
        {
            alert("Subject code cannot be empty");
            return false;;
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

    async function getAllTitlesAsync(schoolId: number | null, subjectId: number | null): Promise<Note[]>
    {
        try
        {
            const allNotes = await notesService.getNotes(schoolId, subjectId);
            return allNotes;
        }
        catch (error)
        {
            alert("ERROR: Cannot get all titles for this subject.");
            console.log(`ERROR: ${error}`);
            return [];   
        }
    }
    async function getSchools() {
            try
            {
                const schoolsData = await notesService.getSchools();
                setSchools(schoolsData);
            }
            catch (error)
            {
                alert("ERROR: Cannot get all schools.");
                console.log(`ERROR: ${error}`);
            }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuth(false);
            return;
        }
        axios.get(`${API_BASE}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => setIsAuth(true))
        .catch(() => setIsAuth(false))
    }, []);

    useEffect(() => {
        getSchools();
    }, []);

    const handleSchoolClick = async (school: School) => {
        setSelectedSchool(school);
        setSubjects([]); // Clear subjects when switching schools.
        setNotes([]); // Clears all notes.
        setMarkdown(''); // Clear markdown.
        setSelectedSubject(null);
        setSelectedNote(null);
        const allSubjectsData = await notesService.getSubjects(school.id);
        setSubjects(allSubjectsData);
    };

    const handleSubjectClick = async (subject: Subject) => {
        setSelectedSubject(subject);
        setNotes([]); // Clear titles when switching subjects
        setMarkdown(''); // Clear markdown
        setSelectedNote(null);
        const titles = await getAllTitlesAsync(selectedSchool?.id ?? null, subject.id);
        setNotes(titles);
    };

    const handleNoteClick = async (title: Note) => {
        setSelectedNote(title);
        const response = await getMarkdownAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null, title.id);
        setMarkdown(response);
    };

    const handleCreateSubject = async () => {
        if (newSubjectTitle.length == 0)
        {
            alert("Subject title cannot be empty");
            return;
        }
        if (newSubjectCode.length == 0)
        {
            alert("Subject code cannot be empty");
            return;
        }
        try
        {
            await notesService.uploadSubject(selectedSchool?.id, newSubjectTitle, newSubjectCode);
            alert('New subject saved!');
            setShowSubjectNotePopUp(false);
            const allSubjects = await notesService.getSubjects(selectedSchool?.id);
            setSubjects(allSubjects);
            setSelectedSubject(allSubjects[allSubjects.length - 1]);
            setNewSubjectCode("");
            setNewSubjectTitle("");
            // refresh notes.
            setSelectedNote(null);
            setMarkdown("");
            setNotes([]);
        }
        catch (error)
        {
            alert(`Failed to save subject. ERROR: ${error}`);
        }
    }

    const handleEditSubject = async () => {
        if (!valid_title_and_code(newSubjectTitle, newSubjectCode)) {
            return;
        }
        try
        {
            await notesService.editSubject(selectedSchool?.id, newSubjectTitle, newSubjectCode, selectedSubject?.id);
            alert('Subject was updated!');
            setShowEditSubjectPopup(false);
            const allSubjects = await notesService.getSubjects(selectedSchool?.id);
            setSubjects(allSubjects);
            setNewSubjectCode("");
            setNewSubjectTitle("");
        }
        catch (error)
        {
            alert("Subject's edit was not saved!");
            console.log(`ERROR: ${error}`);
        }
    }

    const handleDeleteSubject = async () => {
        try {
            await notesService.deleteSubject(selectedSchool?.id, selectedSubject?.id);
            alert('Subject has been deleted!');
            setShowDeleteSubjectPopup(false);
            const allSubjects = await notesService.getSubjects(selectedSchool?.id);
            setSubjects(allSubjects);
            if (allSubjects.length > 0) {
                setSelectedSubject(allSubjects[0]);
                const response = await getAllTitlesAsync(selectedSchool?.id ?? null, allSubjects[0].id);
                setNotes(response);
            }
            else {
                setSelectedSubject(null);
                setNotes([]);
            }
        }
        catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    const handleCreateSchool = async () => {
        if (!valid_title_and_code(newSchoolTitle, newSchoolCode)) {
            return;
        }
        try {
            await notesService.uploadSchool(newSchoolTitle, newSchoolCode);
            alert('New school saved!');
            setShowCreateSchoolPopup(false);
            setSubjects([]);
            setNotes([]);
            getSchools();
        }
        catch (error) {
            alert("ERROR: Could not save new school!");
            console.log(`ERROR: ${error}`);
        }
    }

    const handleEditSchool = async () => {
        if (!valid_title_and_code(newSchoolTitle, newSchoolCode)) {
            return;
        }
        try {
            await notesService.editSchool(selectedSchool?.id, newSchoolTitle, newSchoolCode);
            alert("School has been updated");
            await getSchools();
            const updatedSelectedSchool = schools.find(s => s.id == selectedSchool?.id);
            console.log(selectedSchool?.id)
            console.log(updatedSelectedSchool);
            if (updatedSelectedSchool == undefined) {
                return;
            }
            setSelectedSchool(updatedSelectedSchool);
            setShowEditSchoolPopup(false);
            // setSubjects([]);
            // setNotes([]);
        }
        catch (error) {
            alert("ERROR: Could not update school!");
            console.log(`ERROR: ${error}`);
        }
    }

    const handleDeleteSchool = async () => {
        try {
            await notesService.deleteSchool(selectedSchool?.id);
            alert("School has been deleted!");
            setShowDeleteSchoolPopup(false);
            await getSchools();
            
            setSelectedSubject(null);
            setSelectedNote(null);
            setSubjects([]);
            setNotes([]);
            if (schools.length > 0) {
                setSelectedSchool(schools[0]);
                handleSchoolClick(schools[0]);
            }
            else {
                setSelectedSchool(null);
            }
        }
        catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

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
    
    const handleCreateNote = async () => {
        if (check_school_subject_selected())
        {
            if (newNoteTitle.length == 0)
            {
                alert("Title must not be empty!");
            }
            else
            {
                try
                {
                    await notesService.uploadNote(selectedSchool?.id, selectedSubject?.id, newNoteTitle);
                    alert('New note saved!');
                    setSelectedNote(null);
                    setShowCreateNotePopUp(false);
                    setMarkdown('');
                    setNewNoteTitle('');
                    const response = await getAllTitlesAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null);
                    setNotes(response);
                    setSelectedNote(response[response.length - 1]);
                } 
                catch (error)
                {
                    alert('Failed to save new note. Please try again');
                    console.log(`ERROR: ${error}`);
                }
            }
        }
    }

    const handleDeleteNote = async () => {
        try
        {
            await notesService.deleteNote(selectedSchool?.id, selectedSubject?.id, selectedNote?.id);
            alert("Note has been successfully deleted!");
            setDeleteNotePopUp(false);
            const response = await getAllTitlesAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null);
            setNotes(response);

            if (response.length > 0)
            {
                // If there is more content, let's just set it to the first one.
                const nextTitle = response[0];
                setSelectedNote(nextTitle);
                const markdown = await getMarkdownAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null, nextTitle.id);
                setMarkdown(markdown);
            }
            else
            {
                setSelectedNote(null);
                setMarkdown('');
            }
            setNotes(response);  
        }
        catch (error)
        {
            alert("Failed to delete note.");
            console.log(`ERROR: ${error}`);
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
            const response = await getAllTitlesAsync(selectedSchool?.id ?? null, selectedSubject?.id ?? null);
            setNotes(response);
            
            const updatedTitle = response.find(note => note.id == selectedNote?.id);
            if (updatedTitle)
            {
                setSelectedNote(updatedTitle);
            }

            setNewNoteTitle('');
        }
        catch (error)
        {
            alert("Failed to edit note.");
            console.log(`ERROR: ${error}`);
        }
    }

    // ---------------------------- //
    // Drag-and-Drop for Images     //
    // ---------------------------- //
    const onDrop = useCallback(async (acceptFiles: File[]) => {
        // handling multiple files, just in case.
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not authenticated. Please log in.');
            return;
        }
        for (const file of acceptFiles)
        {
            try 
            {
                // upload the file to the backend.
                const formData = new FormData();
                formData.append('file', file);

                const response = await axios.post('http://localhost:5003/api/notes/uploadImage', formData, {
                    headers: { 
                        'Content-Type': `multipart/form-data`,
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
    <>
    {showCreateNotePopUp && (
        <UpsertPopUp
            popUpTitle={newNoteTitle} 
            placeholder='Enter new note title.'
            upsertEntityName={setNewNoteTitle}
            confirmUpsertEntity={handleCreateNote}
            confirmUpdateLabel='Create'
            closePopUp={setShowCreateNotePopUp}
            cancelLable='Cancel'
        />
    )}
    {showEditNotePopUp && (
        <UpsertPopUp
            popUpTitle={newNoteTitle}
            placeholder='Enter new note title.'
            upsertEntityName={setNewNoteTitle}
            confirmUpsertEntity={handleEditNote}
            confirmUpdateLabel='Edit'
            closePopUp={setShowEditNotePopUp}
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
    {showCreateSubjectPopup && (
        <UpsertPopUpSubjects 
            popUpTitle={newSubjectTitle} 
            placeholder='Enter new subject title.'
            upsertEntityName={setNewSubjectTitle}
            confirmUpsertEntity={handleCreateSubject}
            confirmUpdateLabel='Create'
            closePopUp={setShowSubjectNotePopUp}
            cancelLable='Cancel'
            popUpCode={newSubjectCode}
            upsertEntityCode={setNewSubjectCode}
            popUpPlaceholder='Enter new code here.'
        />
    )}
    {showEditSubjectPopup && (
        <UpsertPopUpSubjects
            popUpTitle={newSubjectTitle} 
            placeholder='Enter new subject title.'
            upsertEntityName={setNewSubjectTitle}
            confirmUpsertEntity={handleEditSubject}
            confirmUpdateLabel='Edit'
            closePopUp={setShowEditSubjectPopup}
            cancelLable='Cancel'
            popUpCode={newSubjectCode}
            upsertEntityCode={setNewSubjectCode}
            popUpPlaceholder='Enter new code here.'
        />
    )}
    {showDeleteSubjectPopup && (
        <DeletePopUp
            deleteUIHeader='Are you sure you want to delete this Subject?'
            confirmDelete={ handleDeleteSubject }
            confirmLable='Delete'
            closePopUp={ setShowDeleteSubjectPopup }
            cancelLable='Cancel'
        />
    )}
    {showCreateSchoolPopup && (
        <UpsertPopUpSubjects 
            popUpTitle={newSchoolTitle} 
            placeholder='Enter new school title.'
            upsertEntityName={setNewSchoolTitle}
            confirmUpsertEntity={handleCreateSchool}
            confirmUpdateLabel='Create'
            closePopUp={setShowCreateSchoolPopup}
            cancelLable='Cancel'
            popUpCode={newSchoolCode}
            upsertEntityCode={setNewSchoolCode}
            popUpPlaceholder='Enter new code here.'
        />
    )}
    {showEditSchoolPopup && (
        <UpsertPopUpSubjects 
            popUpTitle={newSchoolTitle} 
            placeholder='Enter new school title.'
            upsertEntityName={setNewSchoolTitle}
            confirmUpsertEntity={handleEditSchool}
            confirmUpdateLabel='Create'
            closePopUp={setShowEditSchoolPopup}
            cancelLable='Cancel'
            popUpCode={newSchoolCode}
            upsertEntityCode={setNewSchoolCode}
            popUpPlaceholder='Enter new code here.'
        />
    )}
    {showDeleteSchoolPopup && (
        <DeletePopUp
            deleteUIHeader='Are you sure you want to delete this school?'
            confirmDelete={ handleDeleteSchool }
            confirmLable='Delete'
            closePopUp={ setShowDeleteSchoolPopup }
            cancelLable='Cancel'
        />
    )}
    { isAuth === true && ( // Checking JWT, and if it's valid, render the rest.
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {/* Left Panel: Collapsible Menu */}
            <div style={{ width: '22%', padding: '10px', borderRight: '1px solid #ccc', overflow: `scroll` }}>
                <button onClick={handleLogout}>
                        Logout
                </button>
                <div className='editor-header-alignment'>
                    <h3>Schools</h3>
                    <SidePanelButton 
                        className="edit-button"
                        onClick={ () => setShowCreateSchoolPopup(true) }
                        buttonUIDisplay='Create'                          
                    />
                    <SidePanelButton
                        className='edit-button'
                        onClick={() => verifySelected(
                            !!selectedSchool,
                            "Must select a school to edit!",
                            () => setShowEditSchoolPopup(true)
                        )}
                        buttonUIDisplay='Edit'
                    />
                    <SidePanelButton 
                        className="edit-button"
                        onClick={() => verifySelected(
                            !!selectedSchool, 
                            "Must select a school to delete!", 
                            () => setShowDeleteSchoolPopup(true)
                        )}
                        buttonUIDisplay='Delete'                          
                    />
                </div>
                <SchoolSelector
                    schools={schools}
                    selectedSchool={selectedSchool}
                    onSchoolSelect={handleSchoolClick}
                />
                {selectedSchool && (
                    <>
                        <div className='editor-header-alignment'>
                            <h4>Subjects</h4>
                            <SidePanelButton 
                                className="edit-button"
                                onClick={ () => setShowSubjectNotePopUp(true) }
                                buttonUIDisplay='Create'                          
                            />
                            <SidePanelButton
                                className='edit-button'
                                onClick={() => verifySelected(
                                    !!selectedSubject,
                                    "Must select a subject to edit!",
                                    () => setShowEditSubjectPopup(true)
                                )}
                                buttonUIDisplay='Edit'
                            />
                            <SidePanelButton 
                                className="edit-button"
                                onClick={() => verifySelected(
                                    !!selectedSubject, 
                                    "Must select a subject to delete!", 
                                    () => setShowDeleteSubjectPopup(true)
                                )}
                                buttonUIDisplay='Delete'                          
                            />
                        </div>
                        
                    <SubjectSelector
                        subjects={subjects}
                        selectedSubject={selectedSubject}
                        handleSubjectClick={handleSubjectClick}
                    />
                    </>
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
                                className='edit-button'
                                onClick={() => verifySelected(
                                    !!selectedNote,
                                    "Must select a note to edit!",
                                    () => setShowEditNotePopUp(true)
                                )}
                                buttonUIDisplay='Edit'
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
            <div style={{ width: '39%', padding: '10px', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
                {/* Drag-and-drop area: wrap your text area */}
                <div
                    {...getRootProps()}
                    style={{
                        flex: 1,
                        marginBottom: '10px',
                    }}
                >
                    <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : selectedNote ? (
                        <textarea
                            style={{ width: '100%', height: '100%', border: 'none', resize: 'none', background: 'inherit' }}
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                        />
                    ) : (
                        <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: '#666',
                            fontSize: '18px'
                        }}>
                            Please select a note to start editing
                        </div>
                    )}
                </div>
                <button onClick={updateNote} style={{ padding: '10px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Update Note
                </button>
            </div>

            {/* Right Panel: Rendered Markdown */}
            <div className='preview-pane' style={{ width: '39%', padding: '10px', overflowY: 'scroll'}}>
                <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                rehypePlugins={[
                    [rehypeKatex, { throwOnError: false }],
                    rehypeHighlight,
                    rehypeAutolinkHeadings,
                ]}
                >
                {markdown}
                </ReactMarkdown>
            </div>
        </div>
    )}
    {isAuth === false && (
        <div className='invalid-login'>
            <FontAwesomeIcon icon={faEyeSlash} className='invalid-login-icon'/>
            <h1>Invalid credentials. Please return to login page.</h1>
            <div className="landing-page-button">
            <a href='/'>
                Return to Landing Page
            </a>
            </div>
        </div>
    )}
    </>
    );
};


export default Editor;