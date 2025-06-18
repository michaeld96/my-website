import { useEffect, useState } from "react"
import { Note } from "../types/note";
import { notesService } from "../services/notesService";

export const useNotes = (schoolId?: number, subjectId?: number) => {
    const [notes, setNotes] = useState<Note[]>([]);
    useEffect(() => {
        if (subjectId == null)
        {
            return;
        }
        const fetchNotes = async () => {
            try
            {
                const result = await notesService.getNotes(schoolId, subjectId);
                setNotes(result);
            }
            catch(error)
            {
                alert("Error retrieving Notes.");
            }
        }
        fetchNotes();
    }, [schoolId, subjectId])
    return notes;
}