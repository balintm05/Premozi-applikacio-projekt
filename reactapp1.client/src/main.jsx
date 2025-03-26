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
import ProfilePage from "./pages/account/profilePage/ProfilePage.jsx";
import UserEditor from "./pages/account/accountManager/UserEditor.jsx";
import FilmListAdmin from "./admin/FilmListAdmin.jsx";
import EmailConfirmation from "./components/EmailConfirmation.jsx";
import TwoFactorAuth from "./components/TwoFactorAuth.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

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