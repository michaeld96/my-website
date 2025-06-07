import { School } from "./school"
import { Note } from "./note"

export type Subject = {
    id: number,
    title: string,
    code: string,
    schoolId: string,
    school: School,
    notes: Note[]
}