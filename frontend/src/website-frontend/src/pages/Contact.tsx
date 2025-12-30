import { useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import ReCAPTCHA from "react-google-recaptcha";
import './Contact.css'

type FormData = {
    sender: string;
    subject: string;
    message: string;
};

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({subject: '', message: '', sender: ''});
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // Union these two because we want one handler for both fields.
        const { name, value } = e.target; // target is either <input> or <textarea>
        setFormData((prev) => ({
            ...prev, // Spread old state.
            [name]: value // Overwrite the value where the key equals the name.
        }))
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.sender.includes('@')) {
            setError(`Sender's email does not include @`);
            return;
        }
        else if (formData.message === '') {
            setError('Message is empty!');
            return;
        }
        else if (formData.subject === '') {
            setError('Subject is empty!');
            return;
        }
        else if (!captchaToken) {
            setError('Please complete the CAPTCHA first!');
            return;
        }

        try {
            const result = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken
                })
            });
            if (!result.ok) {
                const data = await result.json().catch(() => null);
                setError(data?.message || 'Something went wrong...');
            }
            else {
                setSuccess('Message sent! Thanks for reaching out!')
                setFormData({subject: '', message: '', sender: ''});
                setCaptchaToken(null);
            }
        }
        catch (err) {
            setError(`Error: ${err}`)
        }
        
    }
    const handleCAPTCHA = (token: string | null) => {
        setCaptchaToken(token);
    }

    return(
        <>
        <div className="app-layout">
            <Navbar/>
            <div className="contact-content">
                <h1>Send Me an Email</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <label>Your Email</label>
                    <input 
                        id="sender"
                        name="sender"
                        value={formData.sender}
                        onChange={handleChange}
                     />
                     <label>Subject</label>
                     <input
                        id="subject"
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                     />
                     <label>Message</label>
                     <textarea 
                        id="message"
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                    />
                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
                        onChange={handleCAPTCHA}
                        className="captcha"
                     />
                     <button
                        type="submit"
                        disabled={!captchaToken}
                    >
                        Send!
                     </button>
                </form>
                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}
            </div>
        </div>
        </>
    )
}

export default Contact;