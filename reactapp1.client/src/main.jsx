import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Index from "./pages/Index.jsx";
import Layout from "./pages/layout/Layout.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./pages/account/Logout.jsx";
import PageNotFound from "./pages/errors/PageNotFound.jsx";
import UserListAdmin from "./pages/admin/UserListAdmin.jsx";
import AdminCheck from "./pages/admin/AdminCheck.jsx";
import AdminIndex from "./pages/admin/AdminIndex.jsx";
import ProfilePage from "./pages/account/profilePage/ProfilePage.jsx";
import UserEditor from "./pages/account/accountManager/UserEditor.jsx";
import FilmListAdmin from "./pages/admin/FilmListAdmin.jsx";
//import ProtectedRoute from "./components/ProtectedRoute.jsx";
//<Route path="/dashboard" element={<ProtectedRoute><h2>Dashboard</h2></ProtectedRoute>} />
import EmailConfirmation from "./components/EmailConfirmation.jsx";
import TwoFactorAuth from "./components/TwoFactorAuth.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const refreshTokenAutoCall = async () => {
        await fetch("https://localhost:7153/api/Auth/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
    };
    refreshTokenAutoCall();

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="/account/profile/details/:id?" element={<ProfilePage />} />
                        <Route path="/account/profile/manage/edit/:id?" element={<UserEditor />} />
                        <Route path="/auth/confirm-email" element={<EmailConfirmation />} />
                        <Route path="/auth/2fa" element={<TwoFactorAuth />} />
                        <Route element={<AdminCheck />}>
                            <Route path="/admin/" element={<AdminIndex />} />
                            <Route path="/admin/users" element={<UserListAdmin />} />
                            <Route path="/admin/filmek" element={<FilmListAdmin />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

createRoot(document.getElementById('root2')).render(<App />);

export default App;