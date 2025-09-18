import { startTransition, useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import { PreviewButton } from "../components/preview/PreviewButton";
import { notesService } from "../services/notesService";
import { Subject } from "../types/subject";
import "./PreviewNotes.css"
import BreadCrumb from "../components/preview/Breadcrumbs";
import { Note } from "../types/note";

const PreviewNotes: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [crumbs, setCrumbs] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
    
    async function getSubjects() {
        try
        {
            setNotes([]); // clear previous list so we don't get UI flicker.
            const subjects = await notesService.getAllSubjects();
            setSubjects(subjects);
        }
        catch (error)
        {
            alert("ERROR: Cannot get Subjects");
            console.log(`ERROR: ${error}`);
        }
    }
    
    useEffect(() => {
        getSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubject) {
            return;
        }
        const ac = new AbortController();
        (async () => {
            try {
                const data = await notesService.getNotes(selectedSubject.schoolId, selectedSubject.id);
                if (!ac.signal.aborted) {
                    setNotes(data);
                }
            }
            catch (error) {
                alert("ERROR: Cannot get notes");
                console.log(`ERROR: ${error}`);
            }
            finally {
                if (!ac.signal.aborted) {
                    setIsLoadingNotes(false);
                }
            }
        })();
    }, [selectedSubject]);

    const handleSubjectClick = useCallback((subject: Subject) => {
        startTransition(() => {
            setSelectedSubject(subject);
            setCrumbs(prevState => [...prevState, subject.title]); // appending to state and creating new array.
            setIsLoadingNotes(true);
            setNotes(null);
        });
    }, []);

    const handleSubjectCrumbClick = useCallback(() => {
        setCrumbs([]);
        setSelectedSubject(null);
        setNotes([]); // show the page cleanly.
    }, []);

    return (
        <div className="app-layout">
            {/* <Navbar currentPage="notes" /> */}
            <div className="main-content">
                {selectedSubject == null ? 
                (
                    <>
                    <h2 className="preview-h2">Welcome To My Notes!</h2>
                    <h3 className="preview-h3">Click on any of the subjects to see my notes</h3>
                    <div className="button-container">
                        {subjects.map((subject) => {
                            return (
                                <li key={subject.id} className="button-item">
                                    <PreviewButton name={subject.title} school={subject.code} onClick={() => handleSubjectClick(subject)}/>
                                </li>
                            )
                        })}
                    </div>
                </>) 
                :
                (
                    <>
                    <BreadCrumb crumbs={crumbs} onClick={() => handleSubjectCrumbClick()}/>
                    {isLoadingNotes || notes === null ? null : notes && notes.length > 0 ? (
                    <div className="button-container">
                        {notes.map(note => {
                            return(
                                <li key={note.id} className="button-item">
                                    <PreviewButton name={note.title} school={""}/>
                                </li>
                            )
                        })}
                    </div>) : (
                    <div className="no-notes-container">
                        {(!notes || notes.length === 0) && <h1>There are no notes for this subject.</h1>}
                    </div>
                    )}
                    </>
                )}
            </div>
        </div>
    )
}

export default PreviewNotes;