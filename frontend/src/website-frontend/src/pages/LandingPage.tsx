import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';

const LandingPage: React.FC = () => {
    return(
        <>
            <Navbar currentPage="home" />
            <div className="main-content">
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Welcome to the Knowledge Hub</h1>
                    <p>This is the public-facing page.</p>
                    <Link to="/admin-login" style={{ textDecoration: 'none', color: 'blue' }}>
                        Go to Admin Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LandingPage;