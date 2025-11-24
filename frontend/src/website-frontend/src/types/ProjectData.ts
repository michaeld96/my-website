export type ProjectData = {
    name: string;
    category: string; // personal, school, or open-source.
    summary: string;
    tags: string[];
    imgs: string[] // Key that will be used in assets map. Key gives us all the img paths within that group.
    gitHubLink?: string 
}