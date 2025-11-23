import React from 'react';
import { Navbar } from '../components/navbar/Navbar';
import './LandingPage.css'
import { faBookOpen, faCode, faEnvelope, faMugSaucer, faUser } from '@fortawesome/free-solid-svg-icons';
import Summary from '../components/landing-page/Summary';
const websiteSummary: string = `
    This website acts as my blog and a overview of my portfolio. This site's purpose was to 
    showcase my notes from classes and topics I've encountered while studying and working that 
    I thought others would found useful (also for my own reference). 
`
const notesSummary = `
    To see the things I've written, click on the "Notes" link. This will show all the schools or categories that subjects
    belong to. This is rendered in a Markdown style. Please note that these notes are my own and my interpretation of the topic.
    If you believe there was an incorrect statement, please feel free to open a issue on the project's GitHub page
    <a href='https://github.com/michaeld96/my-website/issues'> here</a>. 
`
const projectsSummary = `
    My "Projects" page is a high-level overview with some pictures of the projects I have worked on. There are two sections; 
    The first section is my personal projects and you may have full access to the source code. The second section are projects from school. 
    Unfortunately, the source code to the school projects cannot be reviled to the public.
`
const aboutMeSummary = `
    The "About" page shares a bit about who I am, what I do, and what I am interested in!
`
const contactSummary = `
    If you want to send me an email, please feel free to!
`

const LandingPage: React.FC = () => {
    return(
        <>
        <div className='app-layout'>
            <Navbar/>
            <div className="main-content">
                <h1>Welcome to my Website!</h1>
                <Summary 
                    icon={faMugSaucer}
                    desc={websiteSummary}
                />
                <Summary 
                    icon={faBookOpen}
                    desc={notesSummary}
                />
                <Summary
                    icon={faCode}
                    desc={projectsSummary}
                />
                <Summary 
                    icon={faUser}
                    desc={aboutMeSummary}
                />
                <Summary 
                    icon={faEnvelope}
                    desc={contactSummary}
                />
                <p className='contact'>
                    
                </p>
            </div>
        </div>
        </>
    );
};

export default LandingPage;