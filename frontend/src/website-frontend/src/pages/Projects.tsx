import { Navbar } from "../components/navbar/Navbar";
import ProjectsTab from "../components/projects/ProjectsTab";
import './Projects.css'
import { loadAssets } from "../utils/projects/loadAssets";
import { populatedProjectData } from "../utils/projects/populatedProjectData";
const assets = loadAssets();
// APMX details.
const apmxLink = 'https://github.com/stephen-amori/apmx'

// Blog site details.
const blog_website_summary: string = `
My blog website showcases my notes that I have accumulated over my time as a student and in my professional life.
It is a full-stack application with authentication and is hosted using AWS tools.
`
const blog_tech_list: string[] = [".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS", "Terraform"];
const blog_link = 'https://github.com/michaeld96/my-website'

// eMgine details.
const emgineSummary: string = `
A custom game engine built with a C++ core and has Lua Scripting for running custom code within the game engine.
This engine has a UI editor for users to create games without needing an IDE or a text editor. The UI is built
with DearImGUI and all the configuration files are written in JSON. Windowing, audio, and other system handling is
done with SDL2, and Box2D is used for the physics system. Check out the demo <a href=''>here</a>!
`
const emgineTechList = ['C++', 'DearImGUI', 'SDL2', 'Lua', 'JSON', 'glm', 'Box2D'];
const emgineLink = 'https://github.com/michaeld96/eMgine'

const Projects: React.FC = () => {
    return(
        <>
        <div className="app-layout">
            <Navbar />
            <div className="content">
                <h1 className='project-headings'>Open Source Projects</h1>
                <ProjectsTab
                    title="APMX"
                    summary={blog_website_summary}
                    tags={blog_tech_list}
                    imgs={assets['blog-website']}
                    git_link={blog_link}
                />
                <h1 className='project-headings'>Personal Projects</h1>
                <ProjectsTab
                    title="Blog Website"
                    summary={blog_website_summary}
                    tags={blog_tech_list}
                    imgs={assets['blog-website']}
                    git_link={blog_link}
                />
                <ProjectsTab
                    title="eMgine"
                    summary={emgineSummary}
                    tags={emgineTechList}
                    git_link={emgineLink}
                    imgs={assets['eMgine']}
                />
                <ProjectsTab
                    title="Title3"
                    summary={blog_website_summary}
                    tags={[".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS"]}
                    git_link="ij"
                    imgs={assets['blog-website']}
                />
                <h1 className='project-headings'>School Projects</h1>
                <ProjectsTab
                    title="Title4"
                    summary={blog_website_summary}
                    tags={[".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS"]}
                    git_link=""
                    imgs={assets['blog-website']}
                />
            </div>
        </div>
        </>
    )
};

export default Projects