import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AdminHub: React.FC = () => {
    const [schools, setSchools] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [titles, setTitles] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>('');

    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchools = async () => {
            const response = await axios.get('http://localhost:5003/api/notes/schools');
            setSchools(response.data);
        };
        fetchSchools();
    }, []);

    const handleSchoolClick = async (school: string) => {
        setSelectedSchool(school);
        const response = await axios.get(`http://localhost:5003/api/notes/${school}/subjects`);
        setSubjects(response.data);
    };

    const handleSubjectClick = async (subject: string) => {
        setSelectedSubject(subject);
        const response = await axios.get(`http://localhost:5003/api/notes/${selectedSchool}/${subject}/titles`);
        setTitles(response.data);
    };

    const handleTitleClick = async (title: string) => {
        const response = await axios.get(`http://localhost:5003/api/notes/${selectedSchool}/${selectedSubject}/${title}`);
        setMarkdown(response.data);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
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
            <textarea
                style={{ width: '40%', padding: '10px', borderRight: '1px solid #ccc' }}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
            />

            {/* Right Panel: Rendered Markdown */}
            <div style={{ width: '40%', padding: '10px' }}>
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        </div>
    );
};

export default AdminHub;
