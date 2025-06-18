import { useEffect, useState } from "react";
import { Subject } from "../types/subject";
import { notesService } from "../services/notesService";

export const useSubjects = (schoolId?: number) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect( () => {
        setSubjects([]);

        if (schoolId == null)
        {
            return; // Noting to fetch.
        }
        const fetchSubjects = async () => {
            try
            {
                const subjects = await notesService.getSubjects(schoolId);
                setSubjects(subjects);
            }
            catch (error)
            {
                alert("ERROR: Cannot retrieve subjects");
            }
        };
        fetchSubjects();
    }, [schoolId])
    return subjects;
}