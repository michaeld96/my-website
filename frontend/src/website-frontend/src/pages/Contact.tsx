import { Navbar } from "../components/navbar/Navbar";

const Contact: React.FC = () => {
    return(
        <>
        <div className="app-layout">
            <Navbar currentPage="contact"/>
            This is the contact page.
        </div>
        </>
    )
}

export default Contact;