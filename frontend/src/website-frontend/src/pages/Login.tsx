import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5003/api/auth', {
                username,
                password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/admin-hub'); // Redirect to admin hub on successful login
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Admin Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
        </div>
    );
};

export default Login;
