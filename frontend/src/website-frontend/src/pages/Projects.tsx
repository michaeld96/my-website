import { Navbar } from "../components/navbar/Navbar";
import ProjectsTab from "../components/projects/ProjectsTab";
import website_screenshot from "../assets/website-screenshot.png"
import about_me from '../assets/about-screenshot.png'
import './Projects.css'

const blog_website_summary: string = `
My blog website showcases my notes that I have accumulated over my time as a student and in my professional life.
It is a full-stack application with authentication and is hosted using AWS tools.
`
const blog_tech_list: string[] = [".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS", "Terraform"];
const blog_link = 'https://github.com/michaeld96/my-website'
const blog_imgs = [website_screenshot, about_me]

const Projects: React.FC = () => {
    return(
        <>
        <div className="app-layout">
            <Navbar />
            <div className="content">
                <h1 className='project-headings'>Personal Projects</h1>
                <ProjectsTab
                    title="Blog Website"
                    summary={blog_website_summary}
                    tags={blog_tech_list}
                    imgs={blog_imgs}
                    git_link={blog_link}
                />
                <ProjectsTab
                    title="Title2"
                    summary={blog_website_summary}
                    tags={[".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS"]}
                    git_link="ij"
                    imgs={blog_imgs}
                />
                <ProjectsTab
                    title="Title3"
                    summary={blog_website_summary}
                    tags={[".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS"]}
                    git_link="ij"
                    imgs={blog_imgs}
                />
                <h1 className='project-headings'>School Projects</h1>
                <ProjectsTab
                    title="Title4"
                    summary={blog_website_summary}
                    tags={[".NET", "TypeScript", "React", "EntityFramework", "Vite", "AWS"]}
                    git_link=""
                    imgs={blog_imgs}
                />
            </div>
        </div>
        </>
    )
};

export default Projects