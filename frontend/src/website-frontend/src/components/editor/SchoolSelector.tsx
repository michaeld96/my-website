import { School } from "../../types/school";

export const SchoolSelector: React.FC<{ // Props that are not defined with a interface.
    schools: School[];
    selectedSchool: School | null;
    onSchoolSelect: (school: School) => void;
}> = ({ schools, selectedSchool, onSchoolSelect}) => {
    return(
        <>
            <h3>Schools</h3>
            <ul>
                {schools.map((school) => (
                    <li
                        key={school.code}
                        className={`list-item ${school.code === selectedSchool?.code ? 'active' : ''}`}
                        onClick={() => onSchoolSelect(school)}
                    >
                        {school.code}
                    </li>
                ))}
            </ul>
        </>
    );
};