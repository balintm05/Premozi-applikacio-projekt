import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeWrapper from "../../Layout/ThemeWrapper";

function AdminForcePasswordChangePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch("/auth/editPassword", {
                userId: parseInt(id),
                newPassword,
                forceChange: true
            });
            setSuccess(true);
            setTimeout(() => navigate(`/admin/user/${id}`), 2000);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt");
        }
    };

    return (
        <ThemeWrapper>
            <div className="auth-container">
                <h2>Jelszó kényszerített módosítása</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Jelszó sikeresen módosítva!</div>}
                <form onSubmit={handleSubmit}>
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

export default AdminForcePasswordChangePage;