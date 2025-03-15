/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";

function UserEditor() {
    const path = location.pathname.split('/');
    const [isAdmin, setIsAdmin] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdmin = async () => {
        try {
            if (path[path.length - 1] == "details") {
                fetchUser();
                return;
            }
            const response = await fetch(`https://localhost:7153/api/Auth/getUserAdmin/` + path[path.length - 1], {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(response.status, response.statusText);
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch("https://localhost:7153/api/Auth/getUser", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("https://localhost:7153/api/Auth/checkIfAdmin/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error("Failed to check admin status");
                }
                const result = await response.json();
                setIsAdmin(result.isLoggedIn);

                // Fetch data based on admin status
                if (result.isLoggedIn) {
                    await fetchAdmin();
                } else {
                    await fetchUser();
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, []); // Add `id` as a dependency

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>Error: {error}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    return (
        <div className="container">
            <h1>Felhasználó adatai</h1><br></br>
            <p>ID: {data.userID}</p><br></br>
            <p>Email cím: {data.email}</p><br></br>
            <p>Fiók létrehozásának időpontja: {data.creationDate}</p><br></br>
        </div>
    );
}

export default UserEditor;