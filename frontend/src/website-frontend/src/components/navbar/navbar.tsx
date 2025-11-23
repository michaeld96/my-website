import React, { useState } from 'react';
import './navbar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons';

export const Navbar: React.FC = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
    return (
        <>
        <div className={`hamburger mobile-only ${mobileNavOpen ? 'change' : ''}`}>
            <button 
            className='hamburger-button'
            onClick={() => setMobileNavOpen((prev) => !prev)}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div> 
            </button>
        </div>
        <nav className={`navbar ${mobileNavOpen ? 'navbar-mobile-open' : ''}`}>
            <div className="navbar-brand">
                <h2>Michael's Website</h2>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notes" className={({isActive}) => isActive ? 'active' : ''}>
                        Notes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/projects" className={({isActive}) => isActive ? 'active' : ''}>
                        Projects
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>
                        Contact
                    </NavLink>
                </li>
            </ul>
            {/* <div className="socials">
                <a href="https://www.linkedin.com/in/michaeld96/" target='_blank' className='social-icon'>
                    <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="https://github.com/michaeld96" target='_blank'>
                    <FontAwesomeIcon icon={faSquareGithub} />
                </a>
            </div> */}
        </nav>
        </>
    );
};