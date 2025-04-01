import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../layout/ThemeWrapper";

function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (newPassword.length < 6 || newPassword.length > 30) {
            setError("A jelszónak 6 és 30 karakter között kell lennie");
            setIsSubmitting(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("A jelszavak nem egyeznek");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.patch("/auth/change-password", {
                currentPassword,
                newPassword
            });

            if (response.data?.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt a jelszó módosítása közben");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeWrapper noBg>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1>Jelszó módosítása</h1>
                        <p className="opacity-70">Állítson be egy új biztonságos jelszót</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <span>A jelszó sikeresen megváltozott! Átirányítás...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label>Jelenlegi jelszó</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Új jelszó</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Legalább 6 karakter"
                                minLength={6}
                                maxLength={30}
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Jelszó megerősítése</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Feldolgozás...' : 'Jelszó módosítása'}
                        </button>
                    </form>
                </div>
            </div>
        </ThemeWrapper>
    );
}

export default ChangePasswordPage;