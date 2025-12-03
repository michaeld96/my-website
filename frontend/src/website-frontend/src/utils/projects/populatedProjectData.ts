import { ProjectData } from "../../types/ProjectData"
const getPopulatedProjectData = ():ProjectData[] => {
    return [
        {
            name: 'Personal Website and Knowledge Hub',
            category: 'personal',
            summary: `This website serves two purposes, first, it serves as my portfolio, second, it holds all of my notes
            that I have kept over the years. These notes are from school, industry, or things I found interesting. This site has
            an admin portal where the admin has an editor at their disposal. These notes are then saved and displayed in the "Notes"
            section of this site. I wanted to learn more about full-stack develop and infrastructure`,
            tags: [".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS", "Terraform"],
            assetKey: 'blog-website',
            gitHubLink: 'https://github.com/michaeld96/my-website'
        },
        {
            name: 'eMgine',
            category: 'personal',
            summary: `A custom game engine built with a C++ core and has Lua Scripting for running custom code within the game engine.
            This engine has a UI editor for users to create games without needing an IDE or a text editor. The UI is built
            with DearImGUI and all the configuration files are written in JSON. Windowing, audio, and other system handling is
            done with SDL2, and Box2D is used for the physics system. Check out the demo 
            <a href='https://www.youtube.com/watch?v=iQhokAynH5I' target='_blank'>here</a>!`,
            tags: ['C++', 'DearImGUI', 'SDL2', 'Lua', 'JSON', 'glm', 'Box2D'],
            assetKey: 'eMgine',
            gitHubLink: 'https://github.com/michaeld96/eMgine'
        },
        {
            name: 'APMX',
            category: 'open-source',
            summary: `An open-source package I made while I worked at Amador BioScience. This package formats datasets for analysis
            withing "NONMEM". This package builds data sets from STDM, ADaM, and other dataset formats. I developed some of the 
            primary functions, helped architect the project, and created a testing framework to check changes to the codebase. This 
            software was written in R. The link to the CRAN package is 
            <a href='https://cran.r-project.org/web/packages/apmx/index.html' target='_blank'>here</a>.`,
            tags: ['R'],
            assetKey: 'apmx',
            gitHubLink: 'https://github.com/stephen-amori/apmx'
        },
        {
            name: 'Ray Tracer',
            category: 'school',
            summary: `Created a distributed ray tracer that could handle any number of light sources, used BVH (bounding volume 
            hierarchy) to accelerate the program, handle reflections and refractions, the ability for focusing, used Phong Shading,
            and could handle diffuse surfaces. This project used the Processing library for the rendering portion.`,
            tags: ['Java', 'Processing'],
            assetKey: 'cs6491',
            gitHubLink: '' // no link for school projects.
        }
    ];
};

export const populatedProjectData: ProjectData[] = getPopulatedProjectData();