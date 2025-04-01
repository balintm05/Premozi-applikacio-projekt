import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeWrapper from '../layout/ThemeWrapper';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            if (!userId || !token) {
                setStatus('error');
                setErrorMessage('Érvénytelen megerõsítõ link');
                setTimeout(() => navigate("/"), 3000);
                return;
            }

            try {
                await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`);
                setStatus('success');
                setTimeout(() => navigate("/change-password"), 3000);
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message ||
                    'Hiba történt az email cím megerõsítése közben');
                setTimeout(() => navigate("/"), 5000);
            }
        };

        confirmEmail();
    }, [searchParams, api, navigate]);

    return (
        <ThemeWrapper>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
                {status === 'loading' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Email cím megerõsítése</h2>
                        <p className="text-gray-600">Kérjük várjon, amíg megerõsítjük email címét...</p>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Sikeres megerõsítés!</h2>
                        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            Email címe sikeresen megerõsítve. Átirányítás a jelszó módosítására...
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Hiba történt</h2>
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorMessage}
                            <br />
                            Átirányítás a kezdõlapra...
                        </div>
                    </div>
                )}
            </div>
        </ThemeWrapper>
    );
};

export default EmailConfirmation;