import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeWrapper from "../../Layout/ThemeWrapper";

function AdminUserStatusPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const [status, setStatus] = useState(1);
    const [error, setError] = useState(null);

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
            await api.patch("/auth/editUserAdmin", {
                id: parseInt(id),
                accountStatus: status
            });
            navigate(`/admin/user/${id}`);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt");
        }
    };

    return (
        <ThemeWrapper>
            <div className="auth-container">
                <h2>Felhasználó státuszának módosítása</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <select value={status} onChange={(e) => setStatus(parseInt(e.target.value))}>
                        <option value={1}>Aktív</option>
                        <option value={2}>Felfüggesztett</option>
                    </select>
                    <button type="submit">Mentés</button>
                </form>
            </div>
        </ThemeWrapper>
    );
}

export default AdminUserStatusPage;