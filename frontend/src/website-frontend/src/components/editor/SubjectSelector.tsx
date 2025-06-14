import { Subject } from "../../types/subject";

interface SubjectSelectorProps { // Props defined with an interface.
    subjects: Subject[];
    selectedSubject: Subject | null;
    handleSubjectClick: (subject: Subject) => void;
}

export const SubjectSelector: React.FC<
    SubjectSelectorProps
> = ({subjects, selectedSubject, handleSubjectClick}) => {
    return(
        <>
            <h4>Subjects</h4>
            <ul>
                {subjects.map((subject) => (
                    <li 
                        key={subject.id} 
                        className={`list-item ${subject.id == selectedSubject?.id ? 'active' : ''}`}
                        onClick={() => handleSubjectClick(subject)}>
                        {subject.code}
                    </li>
                ))}
            </ul>
        </>
    );
};