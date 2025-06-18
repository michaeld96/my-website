import { useEffect, useState } from "react";
import { notesService } from "../services/notesService";
import { School } from "../types/school";

export const useSchools = () => {
    const [schools, setSchools] = useState<School[]>([]);
    useEffect(() => {
        const fetchSchools = async () => {
            try
            {
                const schoolsData = await notesService.getSchools();
                setSchools(schoolsData);
            }
            catch (error)
            {
                alert("ERROR: Cannot get all schools.");
            }

        };
        fetchSchools();
    }, []);
    return schools;
};