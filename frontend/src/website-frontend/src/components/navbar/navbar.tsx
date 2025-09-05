import React from 'react';
import './navbar.css';

interface NavbarProps {
    currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Your Name</h2>
            </div>
            <ul className="navbar-links">
                <li>
                    <a 
                        href="/" 
                        className={currentPage === 'home' ? 'active' : ''}
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a 
                        href="/notes" 
                        className={currentPage === 'notes' ? 'active' : ''}
                    >
                        Notes
                    </a>
                </li>
                <li>
                    <a 
                        href="/about" 
                        className={currentPage === 'about' ? 'active' : ''}
                    >
                        About
                    </a>
                </li>
                <li>
                    <a 
                        href="/contact" 
                        className={currentPage === 'contact' ? 'active' : ''}
                    >
                        Contact
                    </a>
                </li>
            </ul>
        </nav>
    );
};