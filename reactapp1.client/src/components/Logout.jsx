import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeWrapper from '../layout/ThemeWrapper';

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
        <ThemeWrapper>
            <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div className="spinner"></div>
            </div>
        </ThemeWrapper>
    );
}

export default Logout;