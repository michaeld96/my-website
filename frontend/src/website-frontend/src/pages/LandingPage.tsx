import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return(
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome to the Knowledge Hub</h1>
        <p>This is the public-facing page.</p>
        <Link to="/admin-logic" style={{ textDecoration: 'none', color: 'blue' }}>
            Go to Admin Login
        </Link>
    </div>
    );
};

export default LandingPage;