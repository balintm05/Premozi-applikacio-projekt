import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import PageNotFound from "../errors/PageNotFound.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminChecker() {
    const [isAdmin, setIsAdmin] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.role === "Admin");
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    if (isAdmin === null) {
        return null;
    }

    return isAdmin ? <Outlet /> : <PageNotFound />;
}

export default function AdminCheck() {  
    return <AdminChecker />;
}