import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import {api} from '../api/axiosConfig';

export default function PasswordResetPage() {
    document.title = "Jelszó visszaállítása - Premozi";
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);
    
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await api.get(`/auth/verify-password-reset?userId=${userId}&token=${token}`);
                setValidToken(response.data.valid);
            } catch {
                setError("Érvénytelen vagy lejárt visszaállítási link");
            }
        };

        if (userId && token) verifyToken();
    }, [userId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("A jelszavak nem egyeznek");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/complete-password-reset', {
                userId: parseInt(userId),
                token,
                newPassword: password
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Sikertelen jelszó visszaállítás");
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                <Alert severity="error">
                    Érvénytelen vagy lejárt visszaállítási link
                </Alert>
            </Box>
        );
    }
    if (loading) {
        return (<ThemeWrapper className="betoltes">
            <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div className="spinner"></div>
            </div>
        </ThemeWrapper>);
    }
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h4" gutterBottom>Jelszó visszaállítása</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>
                Jelszó sikeresen frissítve! Átirányítás a bejelentkezéshez...
            </Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Új jelszó"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Jelszó megerősítése"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || success}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Feldolgozás...' : 'Jelszó visszaállítása'}
                </Button>
            </form>
        </Box>
    );
}