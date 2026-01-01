import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE: string = import.meta.env.VITE_API_BASE; // importing from .env file. Vite know when to read .evn.development vs prod.

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState<string>(''); // used for forgot password.
    const [forgotPopup, setForgotPopup] = useState<boolean>(false);
    const [passwordResetError, setPasswordResetError] = useState<string>('');
    const [passwordResetSuccess, setPasswordResetSuccess] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Need to see if this token is valid.
            axios.get(`${API_BASE}/auth/me`, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => navigate('/editor'))
            .catch(() => localStorage.removeItem('token'))
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE}/auth`, {
                username,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token); // Save token in browser and lives past
                                                  // window being closed.
            navigate('/editor'); // Redirect to admin hub on successful login.
        } catch (error) {
            setError('Invalid username or password');
            console.log("ERROR:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Stops the page from reloading (single page effect).
        await handleLogin();
    }

    const handleForgotPasswordOn = () => {
        setForgotPopup(true);
    }

    const resetPasswordErrors = () => {
        setPasswordResetError('');
        setPasswordResetSuccess('');
    }

    const handleForgotPasswordOff = () => {
        resetPasswordErrors();
        setEmail('');
        setForgotPopup(false);
    }

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        resetPasswordErrors();
        e.preventDefault();
        if (!email.includes('@') || !email.includes('.')) {
            setPasswordResetError('Please use a valid email address!');
            return;
        }
        try {
            await axios.post(`${API_BASE}/auth/reset-password`, {
                email
            });
        } catch (error) {
            setPasswordResetError('Error sending request to backend!')
            console.log('ERROR:', error);
            return;
        }
        setPasswordResetSuccess('Password reset sent!\nPlease check your email for the password reset link.')
    }

    return (
        <>
        {forgotPopup && (        
            <div className="forgot-password-container"
            style={{position: 'fixed', 
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background.
                    display: 'flex',
                    justifyContent: 'center', // Centers everything horizontally.
                    alignItems: 'center',     // Center everything vertically.
                    zIndex: 1000
            }}>
            <div className="modal-content"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        padding: '30px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                        minWidth: '300px',
                        color: 'white'
                    }}
                >
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive a reset link.</p>
                    <form onSubmit={handlePasswordReset}>
                        <input type="text"
                         onChange={(e) => setEmail(e.target.value)}
                         value={email}
                         style={{width: '100%', height: '20px'}}
                         />
                    <div className="options" style={{ justifyContent: 'center', gap: '20px'}}>
                        <button type='submit' style={{margin: '0 20px 0 0 '}}>Submit</button>
                        <button type='button' onClick={handleForgotPasswordOff} style={{ marginTop: '15px' }}>Close</button> 
                    </div>
                    {passwordResetError && <p style={{ color: 'red' }}>{passwordResetError}</p>}
                    {passwordResetSuccess && <p style={{ color: 'green', whiteSpace: 'pre-line' }}>{passwordResetSuccess}</p>}
                </form>
                </div>
            </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Admin Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}> {/* onSubmit fires when someone hits enter. */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', margin: '10px auto', padding: '10px', width: '300px' }}
                />
                <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {/* Don't forget the type! If the type is not here both buttons will fire! */}
                    <button type='submit' onClick={handleLogin} style={{ padding: '10px 20px' }}>Login</button>
                    <button type='button' onClick={handleForgotPasswordOn}>Forgot Password?</button>
                </div>
            </form>
        </div>
        </>
    );
};

export default Login;
