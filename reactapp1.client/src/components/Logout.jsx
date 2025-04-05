import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        const performLogout = async () => {
            await logout();
            navigate("/");
        };
        performLogout();
    }, [logout]);

    return (
        <div>
            <p>Kijelentkezés folyamatban...</p>
        </div>
    );
}

export default Logout;