import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Typography, Alert, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ThemeWrapper from "../layout/ThemeWrapper";

function AdminUserStatusPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [status, setStatus] = useState(1);
    const [error, setError] = useState(null);
    document.title = "Felhasználó státuszának módosítása - Premozi";
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/auth/getUserAdmin/${id}`);
                setStatus(response.data.accountStatus);
            } catch (err) {
                setError(err.response?.data?.errorMessage || "Hiba történt");
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/auth/change-status/${id}`, status);
            navigate(-1);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt");
        }
    };

    return (
        <ThemeWrapper noBg>
            <Box
                sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    backgroundColor: 'var(--content-bg)',
                    borderRadius: 2,
                    boxShadow: 3,
                    color: 'var(--text-color)'
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: 'var(--text-color)' }}
                >
                    Státusz módosítása
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2,
                            backgroundColor: 'var(--dropdown-hover)',
                            color: 'var(--text-color)'
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'var(--text-color)'
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'var(--text-color)',
                            '& fieldset': {
                                borderColor: 'var(--border-color)'
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--link-color)'
                            }
                        }
                    }}
                >
                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color: 'var(--text-color)' }}>Státusz</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Státusz"
                            sx={{ color: 'var(--text-color)' }}
                        >
                            <MenuItem value={1}>Aktív</MenuItem>
                            <MenuItem value={2}>Felfüggesztett</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 2,
                            backgroundColor: 'var(--btn-bg)',
                            color: 'var(--btn-text)',
                            '&:hover': {
                                backgroundColor: 'var(--btn-hover)'
                            }
                        }}
                    >
                        Mentés
                    </Button>
                </Box>
            </Box>
        </ThemeWrapper>
    );
}

export default AdminUserStatusPage;