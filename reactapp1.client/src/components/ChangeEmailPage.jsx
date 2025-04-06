import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../layout/ThemeWrapper";

function ChangeEmailPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    document.title = "Email cím megváltoztatása - Premozi";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.patch("/auth/editUser", {
                email: newEmail,
                currentPassword
            });

            if (response.data?.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt az email cím frissítése közben");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeWrapper noBg>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1>Email cím módosítása</h1>
                        <p className="opacity-70">Frissítse fiókja email címét</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <span>Az email cím sikeresen frissítve! Kérjük erősítse meg az új email címét.</span>
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
                            <label>Új email cím</label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="pelda@email.hu"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Feldolgozás...' : 'Email cím módosítása'}
                        </button>
                    </form>
                </div>
            </div>
        </ThemeWrapper>
    );
}

export default ChangeEmailPage;