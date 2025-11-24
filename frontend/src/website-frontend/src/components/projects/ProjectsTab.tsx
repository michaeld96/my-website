import './ProjectsTab.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Carousel } from './Carousel';

interface ProjectsTab {
    title: string;
    summary: string;
    tags: string[];
    imgs: string[];
    git_link: string;
}

const ProjectsTab: React.FC<ProjectsTab> = ({title, summary, tags, imgs, git_link}) => {
    return(
        <div className="projects-container">
            <div className="left">
                <h2 className='project-title'>{title}</h2>
                <p className='project-summary' dangerouslySetInnerHTML={{ __html: summary}} />
                <ul className="tags">
                    {tags.map((tag) => {
                        return <li key={tag} className='tag'>{tag}</li>
                    })}
                </ul>
            </div>
            <div className="right">
                <Carousel slides={imgs}/>
                {git_link != "" && (
                    <div className="project-link-container">
                    <a className='project-link' target= '_blank' href={git_link}>Check it out on GitHub! <FontAwesomeIcon icon={faGithub} /></a>
                    </div>
                )}
        </div>
        </div>
    )
}

export default ProjectsTab;