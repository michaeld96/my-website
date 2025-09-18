import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import { PreviewButton } from "../components/preview/button";
import { notesService } from "../services/notesService";
import { Subject } from "../types/subject";
import "./PreviewNotes.css"

/*
    1. Need to make an API call to get all subjects.
    2. When a subject button is clicked, two things happen, we append to the list that acts as anchors, and we load all the notes.
*/




const PreviewNotes: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    
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
    useEffect(() => {
        getSubjects();
    }, []);

    return (
        <div className="app-layout">
            <Navbar currentPage="notes" />
            <div className="main-content">
                <h2>Welcome To My Notes!</h2>
                <h3>Click on any of the subjects to see my notes</h3>
                    <div className="button-container">
                        {subjects.map((subject) => {
                            return (
                                <li key={subject.id} className="button-item">
                                    <PreviewButton name={subject.title} school={subject.code} />
                                </li>
                            )
                        })}
                    </div>
            </div>
        </div>
    )
}

export default PreviewNotes;