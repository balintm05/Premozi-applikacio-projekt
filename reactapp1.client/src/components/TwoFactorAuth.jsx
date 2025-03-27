import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import ThemeWrapper  from '../layout/ThemeWrapper';

const TwoFactorAuth = () => {
    const { darkMode } = useContext(ThemeContext);
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();
    const { verify2FA, resend2FACode } = useContext(AuthContext);

    useEffect(() => {
        const userId = sessionStorage.getItem('2fa_userId');
        if (!userId) {
            setError('Nincs aktív 2FA munkamenet. Kérjük jelentkezzen be újra.');
            navigate('/account/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (resendDisabled && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setResendDisabled(false);
            setCountdown(30);
        }
    }, [resendDisabled, countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userId = sessionStorage.getItem('2fa_userId');
            const response = await verify2FA(code, parseInt(userId));

            if (response.success) {
                sessionStorage.removeItem('2fa_userId');
                navigate('/');
            } else {
                setError(response.error || 'Érvénytelen vagy lejárt kód');
            }
        } catch (err) {
            setError(err.message || 'Hitelesítési hiba történt');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendDisabled(true);
        try {
            const userId = sessionStorage.getItem('2fa_userId');
            await resend2FACode(parseInt(userId));
            setError(null);
        } catch (err) {
            setError(err.message || 'Nem sikerült új kódot küldeni');
        }
    };
    const themeStyles = darkMode ? {
        container: { backgroundColor: '#121212' },
        card: { backgroundColor: '#1e1e1e', borderColor: '#333' },
        text: { color: '#e0e0e0' },
        input: { backgroundColor: '#2a2a2a', borderColor: '#3a3a3a', color: '#f0f0f0' },
        button: { backgroundColor: '#4a6bdf' },
        error: { backgroundColor: '#2d1a1a', borderColor: '#5c2b2b' }
    } : {
        container: { backgroundColor: '#f5f5f5' },
        card: { backgroundColor: '#fff', borderColor: '#ddd' },
        text: { color: '#333' },
        input: { backgroundColor: '#fff', borderColor: '#ddd', color: '#333' },
        button: { backgroundColor: '#007bff' },
        error: { backgroundColor: '#fee2e2', borderColor: '#f8d7da' }
    };
    return (
        <ThemeWrapper style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                ...themeStyles.card,
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ ...themeStyles.text, textAlign: 'center', marginBottom: '1rem' }}>
                    Kétlépcsős azonosítás
                </h1>

                <p style={{ ...themeStyles.text, textAlign: 'center', marginBottom: '1.5rem' }}>
                    Adja meg az email címére küldött 6 számjegyű kódot
                </p>

                {error && (
                    <div style={{
                        ...themeStyles.error,
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="code" style={{ ...themeStyles.text, display: 'block', marginBottom: '0.5rem' }}>
                            Hitelesítő kód
                        </label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            required
                            autoFocus
                            style={{
                                ...themeStyles.input,
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...themeStyles.button,
                            width: '100%',
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        disabled={isLoading || code.length !== 6}
                    >
                        {isLoading ? 'Ellenőrzés...' : 'Hitelesítés'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        onClick={handleResendCode}
                        disabled={resendDisabled}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: resendDisabled ? '#aaa' : (darkMode ? '#6d8eff' : '#007bff'),
                            cursor: resendDisabled ? 'not-allowed' : 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {resendDisabled ? `Újraküldés ${countdown} másodperc múlva` : 'Kód újraküldése'}
                    </button>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default TwoFactorAuth;