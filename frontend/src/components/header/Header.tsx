import React from "react";
import { DarkThemeToggle, Navbar } from 'flowbite-react';
import { useLocation, NavLink } from 'react-router-dom';

interface HeaderProps {
    className?: String;
    text: String;
}

const Header: React.FC<HeaderProps> = ({className, text}) => {
    const location = useLocation();
    const linkClasses = (path: string) => 
        location.pathname === path 
        ? 'bg-gray-300 text-blue-700 rounded-full px-3 py-1' 
        : 'px-3 py-1 md:text-white';

    return (
        <Navbar fluid rounded className='shadow-lg p-1 bg-sky-800'>
            <Navbar.Brand>
                <img src='public/remote_executor_tool.ico' className='rounded-full mr-3 h-6 sm:h-9' alt='Custom Logo' />
                <span className='self-center whitespace-nowrap text-xl font-semibold text-white'>{text}</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
            <Navbar.Link as='span'>
                <NavLink to='/' className={linkClasses('/')}>Home</NavLink>
            </Navbar.Link>
            <Navbar.Link as='span'>
                <NavLink to='/settings' className={linkClasses('/settings')}>Settings</NavLink>
            </Navbar.Link>  
            <Navbar.Link as='span'>
                <NavLink to='/about' className={linkClasses('/about')}>About</NavLink>
            </Navbar.Link>                 
            </Navbar.Collapse>
            <DarkThemeToggle/>
        </Navbar>
    )
}
export default Header;