import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Logout() {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const performLogout = async () => {
            await logout();
            window.location.href = "/";
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