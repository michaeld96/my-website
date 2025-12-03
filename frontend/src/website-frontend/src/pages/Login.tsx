import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ForgotPassword } from '../components/login/ForgotPassword';

const API_BASE: string = import.meta.env.VITE_API_BASE; // importing from .env file. Vite know when to read .evn.development vs prod.

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [forgotPopup, setForgotPopup] = useState<boolean>(false);
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

    return (
        <>
        {forgotPopup && (<ForgotPassword/>)}
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
                    <button type='button' onClick={() => setForgotPopup(true)}>Forgot Password?</button>
                </div>
            </form>
        </div>
        </>
    );
};

export default Login;
