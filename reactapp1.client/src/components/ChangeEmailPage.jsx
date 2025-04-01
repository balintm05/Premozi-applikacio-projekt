import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeWrapper from "../Layout/ThemeWrapper";

function ChangeEmailPage() {
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch("/auth/editUser", { email: newEmail });
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
                <h2>Email cím módosítása</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Email cím sikeresen módosítva!</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Új email cím"
                        required
                    />
                    <button type="submit">Mentés</button>
                </form>
            </div>
        </ThemeWrapper>
    );
}

export default ChangeEmailPage;