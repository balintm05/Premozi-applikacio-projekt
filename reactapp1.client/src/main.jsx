import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import Kapcsolat from './pages/kapcsolat';
import Jegyarak from './pages/Jegyarak';
import Musor from './pages/musor/Musor';
import ImageLibrary from './components/images/ImageLibrary';
import AdatvedelmiTajekoztato from './pages/AdatvedelmiTajekoztato';
import Impresszum from './pages/Impresszum';
import FilmAdatok from './pages/film/FilmAdatok';
import Foglalas from './components/foglalas/Foglalas';
import ProtectedRoute from './components/ProtectedRoute';
import FoglalasSuccess from './components/foglalas/FoglalasSuccess';
import ProfileFoglalasok from './components/profile/ProfileFoglalasok';
import Enable2FA from './components/Enable2FA';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route>
                            <Route index element={<Index />} />
                            <Route path="/musor">
                                <Route index element={<Musor />} />
                                <Route path="film/:id" element={<FilmAdatok />} />                               
                            </Route>        
                            <Route path="foglalas" element={<ProtectedRoute />}>
                                <Route path=":id" element={<Foglalas />} />
                                <Route path="success" element={<FoglalasSuccess />} />
                                <Route index element={<Navigate to="/musor" replace />} />
                                <Route path="*" element={<Navigate to="/musor" replace />} />
                            </Route>
                            <Route path="/jegyarak" element={<Jegyarak />} />
                            <Route path="/kapcsolat" element={<Kapcsolat />} />
                            <Route path="/adatvedelem" element={<AdatvedelmiTajekoztato />} />
                            <Route path="/impresszum" element={<Impresszum />} />
                        </Route>
                        <Route>
                            <Route path="/account/login" element={<Login />} />
                            <Route path="/account/register" element={<Register />} />
                            <Route path="/account/logout" element={<Logout />} />
                            <Route path="/account/profile/details/:id?" element={<ProfilePage />} />
                            <Route path="/account/profile/foglalasok" element={<ProfileFoglalasok />} />
                            <Route path="/account/change-email" element={<ChangeEmailPage />} />
                            <Route path="/account/change-password" element={<ChangePasswordPage />} />
                            <Route path="/auth/confirm-email" element={<EmailConfirmation />} />
                            <Route path="/auth/2fa" element={<TwoFactorAuth />} />
                            <Route path="/auth/reset-password" element={<PasswordResetPage />} />
                            <Route path="/account/enable-2fa" element={<Enable2FA />} />
                        </Route>

                        <Route path="/admin" element={<AdminCheck />}>
                            <Route index element={<AdminIndex />} />
                            <Route path="users" element={<UserListAdmin />} />
                            <Route path="user/:id/status" element={<AdminUserStatusPage />} />
                            <Route path="user/:id/force-password-change" element={<AdminForcePasswordChangePage />} />
                            <Route path="filmek" element={<FilmListAdmin />} />
                            <Route path="filmek/add" element={<FilmEditAdmin />} />
                            <Route path="filmek/edit/:id" element={<FilmEditAdmin />} />
                            <Route path="termek" element={<TeremListAdmin />} />
                            <Route path="termek/add" element={<TeremEditAdmin />} />
                            <Route path="termek/edit/:id" element={<TeremEditAdmin />} />
                            <Route path="vetitesek" element={<VetitesListAdmin />} />
                            <Route path="vetitesek/add" element={<VetitesEditAdmin />} />
                            <Route path="vetitesek/edit/:id" element={<VetitesEditAdmin />} />
                            <Route path="foglalas" element={<FoglalasListAdmin />} />
                            <Route path="kepek" element={<ImageLibrary />}/>
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