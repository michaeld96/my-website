import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import { PreviewButton } from "../components/preview/button";
import { notesService } from "../services/notesService";
import { Subject } from "../types/subject";
import "./PreviewNotes.css"
import BreadCrumb from "../components/preview/Breadcrumbs";

/*
    1. Need to make an API call to get all subjects.
    2. When a subject button is clicked, two things happen, we append to the list that acts as anchors, and we load all the notes.
*/




const PreviewNotes: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [crumbs, setCrumbs] = useState<string[]>([]);
    const [notes, setNotes] = useState<Notes[]>([]);
    
    
    async function getSubjects() {
        try
        {
            const subjects = await notesService.getAllSubjects();
            setSubjects(subjects);
        }
        catch (error)
        {
            alert("ERROR: Cannot get Subjects");
            console.log(`ERROR: ${error}`);
        }
    }

    async function getNotes(subject: Subject) {
        try
        {
            const notes = await notesService.getNotes(subject.schoolId, subject.id);
            setNotes(notes);
        }
        catch (error)
        {
            alert("ERROR: Cannot get notes");
            console.log(`ERROR: ${error}`);
        }
    }
    
    useEffect(() => {
        getSubjects();
    }, []);

    const handleSubjectClick = (subject: Subject) => {
        setSelectedSubject(subject);
        setCrumbs(prevState => [...prevState, subject.title]); // appending to state and creating new array.
        getNotes(subject);
    }

    const handleSubjectCrumbClick = () => {
        setCrumbs([]);
        setSelectedSubject(null);
    }

    return (
        <div className="app-layout">
            <Navbar currentPage="notes" />
            <div className="main-content">
                {selectedSubject == null ? 
                (
                    <>
                    <h2>Welcome To My Notes!</h2>
                    <h3>Click on any of the subjects to see my notes</h3>
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
                    <div className="button-container">
                        {notes.map(note => {
                            return(
                                <li key={note.id} className="button-item">
                                    <PreviewButton name={note.title} school={""} onClick={null}/>
                                </li>
                            )
                        })}
                    </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PreviewNotes;