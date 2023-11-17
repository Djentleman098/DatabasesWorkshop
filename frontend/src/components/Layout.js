import React from 'react';
import Navbar from './navbar/Navbar';

const Layout = ({children}) => {
    // returns the basic layout of each page - including the navbar at the top
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}

export default Layout;