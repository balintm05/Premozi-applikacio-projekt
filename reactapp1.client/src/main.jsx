/* eslint-disable no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Layout from "./pages/layout/Layout.jsx";
import Login from "./pages/account/Login.jsx";
import Register from "./pages/account/Register.jsx";
import Logout from "./pages/account/Logout.jsx";
import PageNotFound from "./pages/errors/PageNotFound.jsx";
import * as React from 'react';
import AccountForm from './pages/account/AccountForm.jsx';
import Cookies from 'universal-cookie';
import { useState } from 'react';
// import "flowbite/src/themes/default";
//import './index.css' //Te itten nekem ne rondíts a kód jó légyszi köszike

export default function App() {
    const cookies = new Cookies();
    const rToken = cookies.get("refreshToken");
    const refreshTokenAutoCall = async () => {
        let response;
        if (rToken != null || rToken != "") {
            response = await fetch(("https://localhost:7153/api/Auth/refresh-token"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: {
                    "refreshToken": { rToken }
                }
            }
            );
        }
        const data = await response.json();
        if (response.status == 200) {
            if (data != null) {
                cookies.set("JWTToken", data.accessToken, { Expires: new Date(Date.now() + 604800000), path: "/", sameSite: true, secure: true });
                cookies.set("refreshToken", data.refreshToken, { Expires: new Date(Date.now() + 604800000), path: "/", sameSite: true, secure: true });
            }
        } 
    }
    refreshTokenAutoCall();
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="/account/login" element={<Login />} />
                    <Route path="/account/register" element={<Register />} />
                    <Route path="/account/logout" element={<Logout />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>  
    )
}

createRoot(document.getElementById('root2')).render(
        <App />
);

