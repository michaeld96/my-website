import { startTransition, useCallback, useEffect, useState } from "react";
import { PreviewButton } from "../components/preview/PreviewButton";
import { notesService } from "../services/notesService";
import { Subject } from "../types/subject";
import "./PreviewNotes.css"
import BreadCrumb from "../components/preview/Breadcrumbs";
import { Note } from "../types/note";
import { Navbar } from "../components/navbar/Navbar";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

const PreviewNotes: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [crumbs, setCrumbs] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    
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
            crumbs.push(subject.title);
            setCrumbs(crumbs);
            setIsLoadingNotes(true);
            setNotes(null);
        });
    }, []);

    const handleNoteClick = useCallback((subject: Subject, note: Note) => {
        setSelectedNote(note);
        crumbs.push(note.title);
        setCrumbs(crumbs);  
    }, []);

    const handleSubjectCrumbClick = useCallback(() => { // using this kind of callback because it memoizes, this means no new function object each call
        if (crumbs.length == 1) {
            crumbs.pop();
        }
        setCrumbs([]);
        setSelectedSubject(null);
        setNotes([]); // show the page cleanly.
    }, []); // [] means no new function object is created.

    const handleNoteCrumbClick = useCallback(() => {
        crumbs.pop();
        setCrumbs(crumbs);
        setSelectedNote(null);
    }, []);

    return (
        <div className="app-layout">
            <Navbar/>
            <div className="main-content">
                {selectedSubject == null && (
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
                    </>
                )}
                {selectedSubject !== null && selectedNote == null && (
                    <>
                    <BreadCrumb crumbs={crumbs} onClick={handleSubjectCrumbClick}/>
                    {isLoadingNotes || notes === null ? null : notes && notes.length > 0 ? (
                    <div className="button-container">
                        {notes.map(note => {
                            return(
                                <li key={note.id} className="button-item">
                                    <PreviewButton name={note.title} school={""} onClick={() => {handleNoteClick(selectedSubject, note)}}/>
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
                {selectedSubject != null && selectedNote != null && selectedNote.markdown.length > 0 && (
                    <>
                        <BreadCrumb crumbs={crumbs} onClick={handleNoteCrumbClick}/>
                        <div className="markdown-display">
                        <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[
                            rehypeKatex,
                            rehypeHighlight,
                            rehypeAutolinkHeadings,
                            rehypeRaw, 
                        ]}
                        >
                        {selectedNote.markdown}
                        </ReactMarkdown>
                        </div>
                    </>
                )}
                {selectedSubject != null && selectedNote != null && selectedNote.markdown.length === 0 && (
                    <>
                        <BreadCrumb crumbs={crumbs} onClick={handleNoteCrumbClick}/>
                        <div className="markdown-display">
                            <h2 style={{margin: '0 calc(100vw/2 - 300px)'}}>Note has no content :(</h2>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PreviewNotes;