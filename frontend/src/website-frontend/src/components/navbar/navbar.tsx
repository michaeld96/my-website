import React from 'react';
import './navbar.css';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
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
        </nav>
    );
};