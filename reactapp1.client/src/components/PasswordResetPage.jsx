import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import {api} from '../api/axiosConfig';

export default function PasswordResetPage() {
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
            } catch (err) {
                setError("�rv�nytelen vagy lej�rt vissza�ll�t�si link");
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
            setError(err.response?.data?.errorMessage || "Sikertelen jelsz� vissza�ll�t�s");
        } finally {
            setLoading(false);
        }
    };

    if (!validToken) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
                <Alert severity="error">
                    �rv�nytelen vagy lej�rt vissza�ll�t�si link
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h4" gutterBottom>Jelsz� vissza�ll�t�sa</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>
                Jelsz� sikeresen friss�tve! �tir�ny�t�s a bejelentkez�shez...
            </Alert>}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="�j jelsz�"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Jelsz� meger�s�t�se"
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
                    {loading ? 'Feldolgoz�s...' : 'Jelsz� vissza�ll�t�sa'}
                </Button>
            </form>
        </Box>
    );
}