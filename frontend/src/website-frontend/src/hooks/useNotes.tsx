import { useCallback, useEffect, useState } from "react"
import { Note } from "../types/note";
import { notesService } from "../services/notesService";

export const useNotes = (schoolId?: number, subjectId?: number) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [markdown, setMarkdown] = useState<string>('');

    const checkSchoolAndSubject = () :boolean => {
        if (!schoolId || !subjectId)
        {
            alert("School or subject is null.");
            return false;
        }
        return true;
    };

    const reloadNotes = useCallback(async () => {
        if (!schoolId || !subjectId)
        {
            setNotes([]);
            return;
        }
        try
        {
            const response = await notesService.getNotes(schoolId, subjectId);
            setNotes(response);
        }
        catch (error)
        {
            alert("Failed to get all notes for this subject.");
        }
    }, [schoolId, subjectId]);

    useEffect(() => {
        reloadNotes();
    }, [reloadNotes]);

    const createNote = useCallback( async (newTitle: string) => {
        if (checkSchoolAndSubject())
        {
            await notesService.uploadNote(schoolId, subjectId, newTitle);
            await reloadNotes();
        }
    }, [schoolId, subjectId, reloadNotes]);

    return { notes, createNote };
}