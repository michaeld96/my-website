import { Navbar } from "../components/navbar/Navbar";
import meImg from '../assets/me.jpg'
import './About.css'

const About: React.FC = () => {
    return(
        <>
        <div className="app-layout">
            <Navbar/>
            <div className="main-content">
                <img className='my-pic' src={meImg} alt="Picture of me." />
                <div className="about-me">
                <p className="about-me-content">
                    Hello! I am a software engineer that likes to explore computer systems, 
                    graphics, and artificial intelligence. Currently I am a graduate student
                    at Georgia Tech focusing on Computer Graphics. When I am not programming
                    I am running trails, taking photos with my analog cameras, or 
                    hanging out with friends.
                </p>
                </div>
            </div>
        </div>
        </>
    )
}

export default About;
