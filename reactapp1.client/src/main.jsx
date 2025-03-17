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
import UserListAdmin from "./pages/admin/UserListAdmin.jsx";
import AdminCheck from "./pages/admin/AdminCheck.jsx";
import * as React from 'react';
import AccountForm from './pages/account/AccountForm.jsx';
import { useState } from 'react';
import AdminIndex from './pages/admin/AdminIndex.jsx';
import ProfilePage from './pages/account/profilePage/ProfilePage.jsx';
import UserEditor from './pages/account/accountManager/UserEditor.jsx';
import Musorok from './pages/movies/FilmIndex.jsx';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import "flowbite/src/themes/default";
//import './index.css' //Te itten nekem ne rondíts a kód jó légyszi köszike

export default function App() {
    const refreshTokenAutoCall = async () => {
        await fetch(("https://localhost:7153/api/Auth/refresh-token"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        }
        );
    }
    refreshTokenAutoCall();
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route>
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="/account/profile/details/:id?" element={<ProfilePage />} />
                        <Route path="/account/profile/manage/edit/:id?" element={<UserEditor />} />
                    </Route>                   
                    <Route element={<AdminCheck />}>
                        <Route path="/admin/" element={<AdminIndex />}/>
                        <Route path="/admin/users" element={<UserListAdmin />} />
                    </Route>
                    <Route>
                        <Route path="/musor/" element={<Musorok />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>  
    )
}

createRoot(document.getElementById('root2')).render(
        <App />
);

