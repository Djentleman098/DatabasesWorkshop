import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Upload">Upload</Link></li>
                <li><Link to="/Groups">Groups</Link></li>
                <li><Link to="/Data_Mining">Data Mining</Link></li>
                <li><Link to="/How_To_Use">How To Use</Link></li>
                <li><Link to="/About">About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;