/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import PageNotFound from "../errors/PageNotFound.jsx";
function AdminChecker() {
    
    const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
        fetch("https://localhost:7153/api/Auth/checkIfAdmin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => setIsAdmin(data.isLoggedIn))
            .catch((error) => console.error("Hiba a bejelentkezés ellenőrzésekor:", error));
    }, []);
    if (isAdmin === null) {
        return null;
    }
    if (isAdmin == true) {
        return (
            <Outlet />
        );
    }
    else {
        return (
            <PageNotFound/>
        )
    }
   
}

export default function AdminCheck() {
    return (
        <AdminChecker/>
    )
}