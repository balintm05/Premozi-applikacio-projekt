import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let checkCount = 0;
        const maxChecks = 3;
        const checkInterval = 100;

        const checkAuth = () => {
            checkCount++;

            if (user) {
                setIsReady(true);
            } else if (checkCount >= maxChecks) {
                navigate("/account/login", {
                    replace: true,
                    state: { from: location.pathname }
                });
            } else {
                setTimeout(checkAuth, checkInterval);
            }
        };
        const timer = setTimeout(checkAuth, 50);

        return () => clearTimeout(timer);
    }, [user, navigate, location]);

    return isReady ? <Outlet /> : null;
};

export default ProtectedRoute;