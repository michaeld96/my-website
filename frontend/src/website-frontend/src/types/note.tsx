import { Subject } from "./subject"
import {Tag} from "./tag"

export type Note = {
    id: number,
    createdAt: Date,
    title: string,
    markdown: string,
    updatedAt: Date,
    tags: Tag[],
    subjectId: number,
    subject: Subject
}