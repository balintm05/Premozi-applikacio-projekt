import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axiosConfig.js';

const PasswordResetPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await api.get(`/auth/verify-password-reset?userId=${userId}&token=${token}`);
                setTokenValid(response.data.valid);
            } catch (err) {
                setError(err.response?.data?.errorMessage || 'Invalid token');
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [userId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('A jelszavak nem egyeznek');
            return;
        }

        try {
            const response = await api.post('/auth/complete-password-reset', {
                userId,
                token,
                newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.errorMessage || 'Hiba történt');
        }
    };

    if (loading) return <div>Ellenõrzés...</div>;
    if (!tokenValid) return <div>Érvénytelen vagy lejárt link</div>;
    if (success) return <div>Jelszó sikeresen megváltoztatva! Átirányítás...</div>;

    return (
        <div className="auth-container">
            <h2>Új jelszó beállítása</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Új jelszó"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Jelszó megerõsítése"
                    required
                />
                <button type="submit">Jelszó mentése</button>
            </form>
        </div>
    );
};

export default PasswordResetPage;