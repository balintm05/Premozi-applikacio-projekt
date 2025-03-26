import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TwoFactorAuth = () => {
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

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                }}>Kétlépcsõs azonosítás</h1>

                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '1.5rem'
                }}>Adja meg az email címére küldött 6 számjegyû kódot</p>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="code" style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Hitelesítõ kód</label>
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
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: isLoading ? '#a0aec0' : '#3182ce',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                        disabled={isLoading || code.length !== 6}
                    >
                        {isLoading ? 'Ellenõrzés...' : 'Hitelesítés'}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        onClick={handleResendCode}
                        disabled={resendDisabled}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: resendDisabled ? '#a0aec0' : '#3182ce',
                            cursor: resendDisabled ? 'not-allowed' : 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.875rem'
                        }}
                    >
                        {resendDisabled ? `Újraküldés ${countdown} másodperc múlva` : 'Kód újraküldése'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuth;