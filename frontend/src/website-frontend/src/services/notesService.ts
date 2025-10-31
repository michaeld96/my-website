import axios from "axios";
import { School } from "../types/school";
import { Subject } from "../types/subject";
import { Note } from "../types/note";
// import { title } from "process";

const API_BASE = 'http://localhost:5003/api/notes';

const api = axios.create();

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers ?? {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (config.headers as any)['Authorization'] = `Bearer ${token}`;
        }
        return config; // IMPORTANT: return config
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (r) => r,
    (err) => {
        if (err?.response?.status === 401) {
            window.location.href = '/';
            localStorage.removeItem('token'); // Token is no longer valid. Need to generate a new one.
        }
        return Promise.reject(err);
    }
)

export const notesService = {
    async getSchools(): Promise<School[]>
    {
        const response = await axios.get<School[]>(`${API_BASE}/schools`);
        return response.data;
    },
    async getAllSubjects(): Promise<Subject[]>
    {
        const response = await axios.get<Subject[]>(`${API_BASE}/all-subjects`)
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
            await api.post(`${API_BASE}/${schoolId}/${subjectId}`, 
        {
                title: newNoteTitle,
                subjectId: subjectId,
                markdown: ""
            });
        }
    },
    async uploadSubject(schoolId: number | undefined, subjectTitle: string, subjectCode: string)
    {
        await api.post(`${API_BASE}/${schoolId}/create-subject`,
            {
                schoolId: schoolId,
                title: subjectTitle,
                code: subjectCode
            }
        );
    },
    async editSubject(schoolId: number | undefined, subjectTitle: string, subjectCode: string, subjectId: number| undefined) {
        await api.put(`${API_BASE}/${schoolId}/edit-subject`,
            {
                schoolId: schoolId,
                title: subjectTitle,
                code: subjectCode,
                id: subjectId
            }
        );
    },
    async deleteSubject(schoolId: number | undefined, subjectId: number | undefined) {
        await api.delete(`${API_BASE}/${schoolId}/delete-subject/${subjectId}`);
    },
    async updateNotesMarkdown(schoolId: number | undefined, subjectId: number | undefined, noteId: number | undefined, markdown: string): Promise<void>
    {
        if (schoolId == undefined || subjectId == undefined || noteId == undefined)
        {
            alert("ERROR: SchoolId, SubjectId, or NoteID is undefined.");
        }
        await api.put(`${API_BASE}/${schoolId}/${subjectId}/${noteId}`, 
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
            await api.put(`${API_BASE}/edit-note/${noteId}`, 
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
            await api.delete(`${API_BASE}/${schoolId}/${subjectId}/${noteId}`);
        }
    },
    async uploadSchool(schoolName: string, schoolCode: string): Promise<void> {
        await api.post(`${API_BASE}/create-school`, 
            {
                name: schoolName,
                code: schoolCode
            }
        );
    },
    async editSchool(schoolId: number | undefined, schoolName: string, schoolCode: string) {
        await api.put(`${API_BASE}/edit-school/${schoolId}`,
            {
                name: schoolName,
                code: schoolCode
            }
        );
    },
    async deleteSchool(schoolId: number | undefined) {
        await api.delete(`${API_BASE}/delete-school/${schoolId}`);
    }
};