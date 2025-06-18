import axios from "axios";
import { School } from "../types/school";
import { Subject } from "../types/subject";
import { Note } from "../types/note";

const API_BASE = 'http://localhost:5003/api/notes';

export const notesService = {
    async getSchools(): Promise<School[]>
    {
        const response = await axios.get<School[]>(`${API_BASE}/schools`);
        return response.data;
    },
    async getSubjects(schoolId: number | undefined): Promise<Subject[]>
    {
        const response = await axios.get<Subject[]>(`${API_BASE}/${schoolId}/subjects`);
        return response.data;
    },
    async getNotes(schoolId: number | null, subjectId: number | null): Promise<Note[]>
    {
        const response = await axios.get<Note[]>(`${API_BASE}/${schoolId}/${subjectId}/notes`);
        return response.data;
    },
    async getMarkdown(schoolId: number | null, subjectId: number | null, noteId: number | null): Promise<string>
    {
        const response = await axios.get<Note>(`${API_BASE}/${schoolId}/${subjectId}/${noteId}`);
        return response.data.markdown;
    },
    async uploadNote(schoolId: number | undefined, subjectId: number | undefined, newNoteTitle: string): Promise<void>
    {
        if (schoolId == undefined || subjectId == undefined)
        {
            alert("ERROR: SchoolId or SubjectId is undefined.");
        }
        else
        {
            await axios.post(`${API_BASE}/${schoolId}/${subjectId}`, 
            {
                title: newNoteTitle,
                subjectId: subjectId,
                markdown: ""
            });
        }
    },
    async updateNotesMarkdown(schoolId: number | undefined, subjectId: number | undefined, noteId: number | undefined, markdown: string): Promise<void>
    {
        if (schoolId == undefined || subjectId == undefined || noteId == undefined)
        {
            alert("ERROR: SchoolId, SubjectId, or NoteID is undefined.");
        }
        await axios.put(`${API_BASE}/${schoolId}/${subjectId}/${noteId}`, 
        {
            updatedAt: new Date().toISOString(),   // Current UTC time.
            markdown: markdown,
        });
    },
    async updateNoteTitle(noteId: number | undefined, newNoteTitle: string): Promise<void>
    {
        if (noteId == undefined)
        {
            alert("ERROR: SchoolId or SubjectId is undefined.");
        }
        else
        {
            await axios.put(`${API_BASE}/edit-note/${noteId}`, 
            {
                updatedAt: new Date().toISOString(),   // Current UTC time.
                title: newNoteTitle
            });
        }

    },
    async deleteNote(schoolId: number | undefined, subjectId: number | undefined, noteId: number | undefined): Promise<void>
    {
        if (schoolId == undefined || subjectId == undefined || noteId == undefined)
        {
            alert("ERROR: SchoolId, SubjectId, or NoteID is undefined.");
        }
        else
        {
            await axios.delete(`${API_BASE}/${schoolId}/${subjectId}/${noteId}`);
        }
    }
};