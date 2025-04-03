import { Outlet } from "react-router-dom";
import "./Layout.css";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon } from "react-icons/fa";


function UserDropdown() {
    const { id,  user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    if (!user) {
        return (
            <div className="ms-auto">
                <a href="/account/login">
                    <button className="auth-nav-btn">
                        <span className="auth-nav-btn-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </span>
                        Bejelentkezés
                    </button>
                </a>
            </div>
        );
    }

    return (
        <div className="nav-item dropdown ms-auto">
            <button
                className={`user-dropdown-btn ${isOpen ? 'active' : ''}`}
                id="navbarScrollingDropdown"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
            >
                <span className="user-avatar">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                </span>
                <span className="user-name">Felhasználó</span>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    <svg viewBox="0 0 24 24" width="14" height="14">
                        <path fill="currentColor" d="M7 10l5 5 5-5z" />
                    </svg>
                </span>
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-start ${isOpen ? 'show' : ''}`}
                aria-labelledby="navbarScrollingDropdown"
                style={{
                    left: 'auto',
                    right: 0,
                    backgroundColor: 'var(--dropdown-bg)',
                    borderColor: 'var(--border-color)'
                }}
            >
                <li>
                    <a
                        className="dropdown-item"
                        href="/account/profile/details"
                        onClick={closeDropdown}
                        style={{ color: 'var(--dropdown-text)' }}
                    >
                        Profil
                    </a>
                </li>
                {user.role === "Admin" && (
                    <li>
                        <a
                            className="dropdown-item"
                            href="/admin/"
                            onClick={closeDropdown}
                            style={{ color: 'var(--dropdown-text)' }}
                        >
                            Adminisztrátori funkciók
                        </a>
                    </li>
                )}
                <li>
                    <hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} />
                </li>
                <li>
                    <a
                        className="dropdown-item"
                        onClick={() => { closeDropdown(); logout(); }}
                        style={{
                            color: 'var(--dropdown-text)',
                            cursor: 'pointer'
                        }}
                    >
                        Kijelentkezés
                    </a>
                </li>
            </ul>
        </div>
    );
}
export const ThemeContext = React.createContext();
export default function Layout() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode !== null) return JSON.parse(savedMode);
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    const [navbarCollapsed, setNavbarCollapsed] = useState(true);

    const toggleNavbar = () => {
        setNavbarCollapsed(!navbarCollapsed);
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <div className="app-container">
                <header>
                    <nav className="navbar navbar-expand-sm navbar-toggleable-sm main-nav">
                        <div className="container-fluid">
                            <button
                                className="navbar-toggler"
                                type="button"
                                onClick={toggleNavbar}
                                aria-expanded={!navbarCollapsed}
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className={`navbar-collapse ${navbarCollapsed ? 'collapse' : ''} d-sm-inline-flex`}>
                                <div className="navbar-brand d-none d-lg-block me-auto">
                                    <a className="navbar-brand" href="/">
                                        <img
                                            src="https://localhost:7153/images/Premlogo.png"
                                            style={{
                                                height: '40px',
                                                width: 'auto',
                                                objectFit: 'contain'
                                            }}
                                            alt="Premozi Logo"
                                        />
                                    </a>
                                </div>
                                <div className="d-flex justify-content-center flex-grow-1">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">Kezdőlap</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/musor">Műsor</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/jegyarak">Jegyárak</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/kapcsolat">Kapcsolat</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="d-flex align-items-center ms-auto">
                                    <button
                                        className="theme-toggle btn btn-link"
                                        onClick={toggleTheme}
                                        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                    >
                                        {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
                                    </button>
                                    <UserDropdown />
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>

                <div className="main-content">
                    <main role="main">
                        <Outlet />
                    </main>
                </div>

                <footer className="site-footer border-top py-3">
                    <div className="container" style={{color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit'}}>
    &copy; 2025 - Premozi - <a href="/adatvedelem" style={{color: 'inherit', textDecoration: 'none'}}>Adatvédelmi tájékoztató</a> - <a href="/impresszum" style={{color: 'inherit', textDecoration: 'none'}}>Impresszum</a>
</div>
                </footer>
            </div>
        </ThemeContext.Provider>
    );
}