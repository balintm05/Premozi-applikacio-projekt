import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../layout/ThemeWrapper";
import { Button, Alert, Box, Typography, CircularProgress } from "@mui/material";

function Enable2FA() {
    const { api, user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const navigate = useNavigate();

    document.title = "Kétlépcsős azonosítás - Premozi";

    const handleEnable2FA = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post("/auth/enable-email-2fa");
            if (response.data?.success) {
                setSuccess("Kétlépcsős azonosítás engedélyezve. Bejelentkezéskor emailben kapott kódot kell megadnia.");
            } else {
                setError(response.data?.message || "Hiba történt a kétlépcsős azonosítás engedélyezése közben");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Hiba történt a kétlépcsős azonosítás engedélyezése közben");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post("/auth/disable-email-2fa", {
                userId: user.userID,
                password: currentPassword
            });

            if (response.data?.success) {
                setSuccess("Kétlépcsős azonosítás letiltva. Következő bejelentkezéskor nem lesz szükség kódra.");
                setCurrentPassword("");
            } else {
                setError(response.data?.message || "Hiba történt a kétlépcsős azonosítás letiltása közben");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Hiba történt a kétlépcsős azonosítás letiltása közben");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeWrapper noBg>
            <Box sx={{
                maxWidth: 500,
                mx: 'auto',
                my: 4,
                p: 3,
                backgroundColor: 'var(--auth-card-bg)',
                borderRadius: 2,
                boxShadow: 'var(--auth-shadow)',
                border: '1px solid var(--auth-border)'
            }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--auth-text)' }}>
                    Kétlépcsős azonosítás
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, color: 'var(--auth-text)' }}>
                    {user?.TwoFactorEnabled 
                        ? "Jelenleg kétlépcsős azonosítás aktív a fiókjában."
                        : "Jelenleg kétlépcsős azonosítás nincs engedélyezve."}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                {user?.TwoFactorEnabled ? (
                    <>
                        <Typography variant="body1" sx={{ mb: 2, color: 'var(--auth-text)' }}>
                            A kétlépcsős azonosítás letiltásához erősítse meg jelszavát:
                        </Typography>

                        <Box component="div" sx={{ mb: 3 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: 'var(--auth-text)',
                                fontWeight: 600
                            }}>
                                Jelenlegi jelszó
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '2px solid var(--auth-border)',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--content-bg)',
                                    color: 'var(--auth-text)',
                                    fontSize: '1rem'
                                }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleDisable2FA}
                            disabled={isLoading || !currentPassword}
                            sx={{
                                py: 1.5,
                                fontWeight: 600,
                                backgroundColor: '#e53e3e',
                                '&:hover': {
                                    backgroundColor: '#c53030'
                                }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Kétlépcsős azonosítás letiltása"
                            )}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleEnable2FA}
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            fontWeight: 600,
                            backgroundColor: 'var(--auth-btn-bg)',
                            '&:hover': {
                                backgroundColor: 'var(--auth-link-hover)'
                            }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Kétlépcsős azonosítás engedélyezése"
                        )}
                    </Button>
                )}

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(-1)}
                    sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: 600,
                        borderColor: 'var(--auth-border)',
                        color: 'var(--auth-text)',
                        '&:hover': {
                            borderColor: 'var(--auth-accent)'
                        }
                    }}
                >
                    Vissza
                </Button>
            </Box>
        </ThemeWrapper>
    );
}

export default Enable2FA;