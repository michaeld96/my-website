import { Navbar } from "../components/navbar/Navbar";

const About: React.FC = () => {
    return(
        <>
        <div className="app-layout">
            <Navbar currentPage="about"/>
            This is the about page.
        </div>
        </>
    )
}

export default About;
