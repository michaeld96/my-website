import {Subject} from "./subject"
export type School = {
    id: number,
    code: string,
    name: string,
    subjects: Subject[]
}