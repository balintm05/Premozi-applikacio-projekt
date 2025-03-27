import { Outlet } from "react-router-dom";
import "./Layout.css";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon } from "react-icons/fa";

function UserDropdown() {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    if (!user) {
        return (
            <a href="/account/login">
                <button className="btn login-btn">
                    Bejelentkezés
                </button>
            </a>
        );
    }

    return (
        <div className="nav-item dropdown">
            <button
                className="nav-link dropdown-toggle user-dropdown"
                id="navbarScrollingDropdown"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
            >
                Felhasználó
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-end ${isOpen ? 'show' : ''}`}
                aria-labelledby="navbarScrollingDropdown"
            >
                <li>
                    <a
                        className="dropdown-item"
                        href="/account/profile/details"
                        onClick={closeDropdown}
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
                        >
                            Adminisztrátori funkciók
                        </a>
                    </li>
                )}
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <a
                        className="dropdown-item"
                        onClick={() => { closeDropdown(); logout(); }}
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


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm main-nav">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">Premozi hivatalos weboldala</a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target=".navbar-collapse"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Főoldal</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Privacy</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/musor/">Film</a>
                                </li>
                            </ul>
                            <div className="d-flex align-items-center">
                                <button
                                    className="theme-toggle btn btn-link"
                                    onClick={toggleTheme}
                                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                >
                                    {darkMode ? (
                                        <FaSun className="theme-icon" />
                                    ) : (
                                        <FaMoon className="theme-icon" />
                                    )}
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
                <div className="container">
                    &copy; 2025 - Premozi - <a href="/">Főoldal</a>
                </div>
            </footer>
            </div>
        </ThemeContext.Provider>
    );
}