import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { PreviewButton } from "../components/preview/PreviewButton";
import { notesService } from "../services/notesService";
import { Subject } from "../types/subject";
import "./PreviewNotes.css"
import { Note } from "../types/note";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams } from "react-router-dom";
import { School } from "../types/school";
import BreadCrumb from "../components/preview/BreadCrumbs";

const slugify = (s: string) =>
    s.toLowerCase()
     .trim()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/^-+|-+$/g, "");

const noteSlugEq = (note: Note, slug?: string) => slugify(note.title) === slug;

const subjectSlugEq = (subject: Subject, slug?: string) => 
    slugify(subject.title) === slug;

const PreviewNotes: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
    const [schools, setSchools] = useState<School[]>([]);

    // URL is source of truth.
    const {schoolCode, subjectSlug, noteSlug} = useParams<{
        schoolCode?: string;
        subjectSlug?: string;
        noteSlug?: string;
    }>();

    const navigate = useNavigate();
    
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

    async function getSchools() {
        try
        {
            const schools = await notesService.getSchools();
            setSchools(schools);
        }
        catch (error)
        {
                alert("ERROR: Cannot get Schools!");
            console.log(`ERROR: ${error}`);
        }
    }

    const schoolSubjects = (schoolCode?: string) => {
        const schoolId = schools.find(s => s.code == schoolCode)?.id;
        if (!schoolId) {
            return [];
        }

        const arr: Subject[] = [];
        subjects.map((subject) => {
            if (subject.schoolId == schoolId) {
                arr.push(subject);
            }
        })
        return arr;
    }

    // Get the selected subject from URL and the subjects that are populated.
    const selectedSubject = useMemo(() => {
        if (!subjects.length || !schoolCode || !subjectSlug) {
            return null;
        }
        return subjects.find((s) => subjectSlugEq(s,subjectSlug)) ?? null;
    }, [subjects, schoolCode, subjectSlug]); // recompute selected subject when one of these values change.
    
    useEffect(() => {
        getSubjects();
        getSchools();
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

    const selectedNote = useMemo(() => {
        if (!notes || !noteSlug) {
            return null;
        }
        return notes.find((n) => noteSlugEq(n, noteSlug)) ?? null;
    }, [notes, noteSlug]);

    const selectedSchool = useMemo(() => {
        if (!schoolCode) {
            return null;
        }
        return schools.find((s) => (s.code === schoolCode));
    }, [schoolCode, schools]);

    const handleSchoolClick = useCallback((school: School) => {
        navigate(`/notes/${school.code}`)
    }, [navigate]);

    const handleSubjectClick = useCallback((school: School, subject: Subject) => {
        startTransition(() => {
            setIsLoadingNotes(true);
            navigate(`/notes/${school.code}/${subject.code}/${slugify(subject.title)}`);
        });
    }, [navigate]);

    const handleNoteClick = useCallback((school: School, subject: Subject, note: Note) => {
        startTransition(() => {
            navigate(`/notes/${school.code}/${subject.code}/${slugify(subject.title)}/${slugify(note.title)}`)
        });
    }, [navigate]);

    const crumbLabels = useMemo(() => {
        const arr: string[] = [];
        if (selectedSchool) {
            arr.push(selectedSchool.name);
        }
        if (selectedSubject) {
            arr.push(selectedSubject.title);
        }
        if (selectedNote) {
            arr.push(selectedNote.title);
        }
        return arr;
    }, [selectedSchool, selectedSubject, selectedNote]);

    const handleSchoolCrumbClick = useCallback(() => { // using this kind of callback because it memoizes, this means no new function object each call
        navigate('/notes');
    }, [navigate]); // [] means no new function object is created.

    const handleSubjectCrumbClick = useCallback(() => { 
        if (!selectedSubject) {
            navigate('/notes');
            return;
        }
        navigate(`/notes/${selectedSchool?.code}/`); 
    }, [navigate, selectedSubject, selectedSchool]); // [] means no new function object is created.

    const handleNoteCrumbClick = useCallback(() => {
        if (!selectedSubject) {
            navigate('/notes');
            return;
        }
        navigate(`/notes/${selectedSchool?.code}/${selectedSubject.code}/${slugify(selectedSubject.title)}`)
    }, [navigate, selectedSubject, selectedSchool]);

    return (
            <div>
                {selectedSubject == null && schoolCode == null &&  (
                    <>
                    <h2 className="preview-h2">Welcome To My Notes!</h2>
                    <h3 className="preview-h3">Click on a Group of my Notes</h3>
                    <div className="button-container">
                        {schools.map((school) => {
                            return (
                                <li key={school.id} className="button-item">
                                    <PreviewButton name={school.name} school={""} onClick={() => handleSchoolClick(school)}/>
                                </li>
                            )
                        })}
                    </div>
                    </>
                )}
                {selectedSchool && selectedSubject === null && (
                    <>
                    <BreadCrumb crumbs={crumbLabels} onClickSchool={handleSchoolCrumbClick} onClickSubject={() => {}} onNoteClick={() => {}}/>
                    <div className="button-container">
                    {
                        schoolSubjects(schoolCode).map((subject) => {
                            return (
                                <li key={subject.id} className="button-item">
                                    <PreviewButton name={subject.title} school={subject.code} onClick={() => handleSubjectClick(selectedSchool, subject)}/>
                                </li>
                            )
                        })
                    }
                    </div>
                    </>   
                )}
                {selectedSchool && selectedSubject && selectedNote === null && (
                    <>
                    <BreadCrumb crumbs={crumbLabels} onClickSchool={handleSchoolCrumbClick} onClickSubject={handleSubjectCrumbClick} onNoteClick={() => {}}/>
                    {isLoadingNotes || notes === null ? null : notes && notes.length > 0 ? (
                    <div className="button-container">
                        {notes.map(note => {
                            return(
                                <li key={note.id} className="button-item">
                                    <PreviewButton name={note.title} school={""} onClick={() => {handleNoteClick(selectedSchool, selectedSubject, note)}}/>
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
                {selectedSchool && selectedSubject != null && selectedNote != null && selectedNote.markdown.length > 0 && (
                    <>
                        <BreadCrumb crumbs={crumbLabels} onClickSchool={handleSchoolCrumbClick} onClickSubject={handleSubjectCrumbClick} onNoteClick={handleNoteCrumbClick}/>
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
                        {/* <BreadCrumb crumbs={crumbLabels} onClickSchool={handleSchoolCrumbClick} onClickSubject={handleSubjectCrumbClick} onNoteClick={handleNoteCrumbClick}/> */}
                        <div className="markdown-display">
                            <h2 style={{margin: '0 calc(100vw/2 - 300px)'}}>Note has no content :(</h2>
                        </div>
                    </>
                )}
            </div>
    )
}

export default PreviewNotes;