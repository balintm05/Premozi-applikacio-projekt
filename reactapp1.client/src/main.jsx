/* eslint-disable no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Layout from "./pages/layout/Layout.jsx";
import Login from "./pages/account/Login.jsx";
import Register from "./pages/account/Register.jsx";
import PageNotFound from "./pages/errors/PageNotFound.jsx";
import * as React from 'react';
import AccountForm from './pages/account/AccountForm.jsx';
//import './index.css' //Te itten nekem ne rondíts a kód jó légyszi köszike

export default function App() {

    return (
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout/> }>
                        <Route index element={<Index />} />
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>      
    )
}

createRoot(document.getElementById('root2')).render(
        <App />
);

