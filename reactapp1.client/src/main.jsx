import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Index from "./pages/Index.jsx";
import Layout from "./layout/Layout.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout.jsx";
import PageNotFound from "./errors/PageNotFound.jsx";
import UserListAdmin from "./admin/UserListAdmin.jsx";
import AdminCheck from "./admin/AdminCheck.jsx";
import AdminIndex from "./admin/AdminIndex.jsx";
import ProfilePage from "./components/profile/ProfilePage";
import UserEditor from "./pages/account/accountManager/UserEditor.jsx";
import FilmListAdmin from "./admin/FilmListAdmin.jsx";
import EmailConfirmation from "./components/EmailConfirmation.jsx";
import TwoFactorAuth from "./components/TwoFactorAuth.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import FoglalasListAdmin from "./admin/FoglalasListAdmin";
import TeremListAdmin from "./admin/TeremListAdmin";
import TeremEditAdmin from "./admin/TeremEditAdmin";
import FilmEditAdmin from './admin/FilmEditAdmin';
import VetitesListAdmin from './admin/VetitesListAdmin';
import VetitesEditAdmin from './admin/VetitesEditAdmin';
import ChangeEmailPage from './components/ChangeEmailPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import PasswordResetPage from './components/PasswordResetPage';
import AdminUserStatusPage from './admin/AdminUserStatusPage';
import AdminForcePasswordChangePage from './admin/AdminForcePasswordChange';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="/account/login" element={<Login />} />
                        <Route path="/account/register" element={<Register />} />
                        <Route path="/logout" element={<Logout />} />

                        <Route path="/account/profile/details/:id?" element={<ProfilePage />} />
                        <Route path="/account/change-email" element={<ChangeEmailPage />} />
                        <Route path="/account/change-password" element={<ChangePasswordPage />} />

                        <Route path="/auth/confirm-email" element={<EmailConfirmation />} />
                        <Route path="/auth/2fa" element={<TwoFactorAuth />} />
                        <Route path="/auth/reset-password" element={<PasswordResetPage />} />

                        <Route element={<AdminCheck />}>
                            <Route path="/admin/" element={<AdminIndex />} />
                            <Route path="/admin/users" element={<UserListAdmin />} />
                            <Route path="/admin/user/:id/status" element={<AdminUserStatusPage />} />
                            <Route path="/admin/user/:id/force-password-change" element={<AdminForcePasswordChangePage />} />
                            <Route path="/admin/filmek" element={<FilmListAdmin />} />
                            <Route path="/admin/filmek/add" element={<FilmEditAdmin />} />
                            <Route path="/admin/filmek/edit/:id" element={<FilmEditAdmin />} />
                            <Route path="/admin/termek" element={<TeremListAdmin />} />
                            <Route path="/admin/termek/add" element={<TeremEditAdmin />} />
                            <Route path="/admin/termek/edit/:id" element={<TeremEditAdmin />} />
                            <Route path="/admin/vetitesek" element={<VetitesListAdmin />} />
                            <Route path="/admin/vetitesek/add" element={<VetitesEditAdmin />} />
                            <Route path="/admin/vetitesek/edit/:id" element={<VetitesEditAdmin />} />
                            <Route path="/admin/foglalas" element={<FoglalasListAdmin />} />
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