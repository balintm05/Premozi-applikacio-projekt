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
    document.title = "Email cím megerősítése - Premozi";

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            if (!userId || !token) {
                setStatus('error');
                setErrorMessage('Érvénytelen megerősítő link');
                setTimeout(() => navigate("/"), 3000);
                return;
            }

            try {
                await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`);
                setStatus('success');
                setTimeout(() => navigate("/"), 3000);
            } catch (error) {
                setStatus('error');
                setErrorMessage(error.response?.data?.message ||
                    'Hiba történt az email cím megerősítése közben');
                setTimeout(() => navigate("/"), 5000);
            }
        };

        confirmEmail();
    }, [searchParams, api, navigate]);

    return (
        <ThemeWrapper>
            <div className="auth-container">
                <div className="auth-card">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <div className="auth-card-header">
                                <h1>Email cím megerősítése</h1>
                                <p>Kérjük várjon, amíg megerősítjük email címét...</p>
                            </div>
                            <div style={{ textAlign: "center", padding: "2rem", margin: "0 auto" }}>
                                <div className="spinner"></div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="auth-card-header">
                                <h1>Sikeres megerősítés!</h1>
                            </div>
                            <div className="auth-success">
                                Email címe sikeresen megerősítve. Átirányítás a kezdőlapra...
                            </div>
                            <div style={{ textAlign: "center", padding: "2rem", margin: "0 auto" }}>
                                <div className="spinner"></div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="auth-card-header">
                                <h1>Hiba történt</h1>
                            </div>
                            <div className="auth-error">
                                {errorMessage}
                                <br />
                                Átirányítás a kezdőlapra...
                            </div>
                            <div style={{ textAlign: "center", padding: "2rem", margin: "0 auto" }}>
                                <div className="spinner"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default EmailConfirmation;