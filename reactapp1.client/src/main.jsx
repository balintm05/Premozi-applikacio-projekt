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
import Rolunk from './pages/Rolunk';
import Jegyarak from './pages/Jegyarak';
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
                    <Route path="" element={<Layout />}>     
                    
                        <Route index element={<Index />} />  
                        <Route path="jegyarak" element={<Jegyarak />} />
                        <Route path="rolunk" element={<Rolunk />} />
                        <Route path="adatvedelem" element={<AdatvedelmiTajekoztato />} />
                        <Route path="impresszum" element={<Impresszum />} />

                        <Route path="film/:id" element={<FilmAdatok />} />  

                        <Route path="foglalas" element={<ProtectedRoute />}>
                            <Route path=":id" element={<Foglalas />} />
                            <Route path="success" element={<FoglalasSuccess />} />
                        </Route>    
                        
                        <Route path="account">
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="logout" element={<Logout />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="profile">
                                    <Route path=":id?" element={<ProfilePage />} />
                                    <Route path="foglalasok" element={<ProfileFoglalasok />} />
                                </Route>
                                <Route path="change-email" element={<ChangeEmailPage />} />
                                <Route path="change-password" element={<ChangePasswordPage />} />
                                <Route path="enable-2fa" element={<Enable2FA />} />
                            </Route>
                        </Route>

                        <Route path="auth">
                            <Route path="confirm-email" element={<EmailConfirmation />} />
                            <Route path="reset-password" element={<PasswordResetPage />} />
                            <Route path="2fa" element={<TwoFactorAuth />} />
                        </Route>     
                        
                        <Route path="admin" element={<AdminCheck />}>
                            <Route index element={<AdminIndex />} />
                            <Route path="users">
                                <Route index element={<UserListAdmin />} />
                                <Route path=":id">
                                    <Route path="status" element={<AdminUserStatusPage />} />
                                    <Route path="force-password-change" element={<AdminForcePasswordChangePage />} />
                                </Route>                               
                            </Route>
                            <Route path="filmek">
                                <Route index element={<FilmListAdmin />} />
                                <Route path="add" element={<FilmEditAdmin />} />
                                <Route path="edit/:id" element={<FilmEditAdmin />} />
                            </Route>
                            <Route path="termek">
                                <Route index element={<TeremListAdmin />} />
                                <Route path="add" element={<TeremEditAdmin />} />
                                <Route path="edit/:id" element={<TeremEditAdmin />} />
                            </Route>
                            <Route path="vetitesek">
                                <Route index element={<VetitesListAdmin />} />
                                <Route path="add" element={<VetitesEditAdmin />} />
                                <Route path="edit/:id" element={<VetitesEditAdmin />} />
                            </Route>
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