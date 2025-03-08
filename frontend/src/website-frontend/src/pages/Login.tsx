import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token)
        {
            navigate('/editor');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5003/api/auth', {
                username,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token); // Save token in browser and lives past
                                                  // window being closed.
            navigate('/editor'); // Redirect to admin hub on successful login.
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Stops the page from reloading (single page effect).
        await handleLogin();
    }

    return (
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
                <button onClick={handleLogin} style={{ padding: '10px 20px' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
