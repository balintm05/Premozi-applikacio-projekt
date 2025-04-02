import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Typography, Alert } from "@mui/material";

function AdminForcePasswordChangePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestReset = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post(`/auth/request-password-reset/${id}`);
            setSuccess(true);
            setTimeout(() => navigate(-1), 2000);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt a kérés küldése közben");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
            <Typography variant="h5" gutterBottom>Jelszó visszaállítás kérése</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                A művelet emailt küld a felhasználónak jelszó-visszaállítási linkkel.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Email sikeresen elküldve!</Alert>}

            <Button
                fullWidth
                variant="contained"
                onClick={handleRequestReset}
                disabled={isLoading || success}
                sx={{ mt: 2 }}
            >
                {isLoading ? "Küldés..." : "Jelszó-visszaállítás küldése"}
            </Button>
        </Box>
    );
}

export default AdminForcePasswordChangePage;