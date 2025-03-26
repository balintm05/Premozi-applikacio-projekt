import { Outlet } from "react-router-dom";
import "./Layout.css";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Logout from "../components/Logout.jsx";

function ButtonToggle() {
    const { user } = useContext(AuthContext);

    return user ? (
        <li className="nav-item dropdown">
            <a
                className="nav-link dropdown-toggle text-light"
                href="#"
                id="navbarScrollingDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.stopPropagation()}
            >
                Felhasználó
            </a>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarScrollingDropdown">
                <li>
                    <a className="dropdown-item" href="/account/profile/details">Profil</a>
                </li>
                <li>
                    {user.role === "Admin" && (
                        <a className="dropdown-item" href="/admin/">
                            Adminisztrátori funkciók
                        </a>
                    )}
                </li>
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li>
                    <a className="dropdown-item" href="/logout">
                        Kijelentkezés
                    </a>
                </li>
            </ul>
        </li>
    ) : (
        <a href="/account/login">
            <button style={{ backgroundColor: "rgb(50,50,50)" }} className="btn my-2 btn-outline-light my-sm-0 text-light text-center">
                Bejelentkezés
            </button>
        </a>
    );
}

export default function Layout() {
    return (
        <div style={{ backgroundColor: "black" }}>
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <a style={{ color: "white" }} className="navbar-brand" href="/">Premozi hivatalos weboldala</a>
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
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Főoldal</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/">Privacy</a>
                                </li>
                                <li className="nav-item">
                                    <a style={{ color: "silver" }} className="nav-link" href="/musor/">Film</a>
                                </li>
                            </ul>
                            <div className="text-light my-2 my-lg-0 mr-sm-0 my-sm-0">
                                <ul className="navbar-nav">
                                    <ButtonToggle />
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div style={{ width: "90vw", maxWidth: "1800px", margin: "0 auto" }} className="container bg-dark text-light text-center">
                <main role="main" className="pb-3">
                    <Outlet />
                </main>
            </div>
            <footer className="border-top footer text-light bg-dark text-center">
                <div className="container">
                    &copy; 2025 - Premozi - <a href="/">Főoldal</a>
                </div>
            </footer>
        </div>
    );
}