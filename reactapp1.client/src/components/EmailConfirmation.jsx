import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            try {
                await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`);
                navigate("/change-password");
            } catch {
                navigate("/");
            }
        };
        confirmEmail();
    }, [searchParams]);

    return null;
};

export default EmailConfirmation;