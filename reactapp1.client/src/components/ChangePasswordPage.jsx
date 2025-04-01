import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../Layout/ThemeWrapper";

function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch("/auth/editPassword", {
                password: currentPassword,
                newPassword
            });
            if (response.data.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt");
        }
    };

    return (
        <ThemeWrapper>
            <div className="auth-container">
                <h2>Jelszó módosítása</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Jelszó sikeresen módosítva!</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Jelenlegi jelszó"
                        required
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Új jelszó"
                        required
                    />
                    <button type="submit">Mentés</button>
                </form>
            </div>
        </ThemeWrapper>
    );
}

export default ChangePasswordPage;