import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../Layout/Layout';
import AdminLayout from './AdminLayout';

function FoglalasEditAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [foglalas, setFoglalas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoglalas = async () => {
            try {
                const response = await api.get(`/Foglalas/get/${id}`);
                setFoglalas(response.data);
            } catch (err) {
                setError("Error loading reservation data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoglalas();
    }, [id, api]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/Foglalas/edit/${id}`, foglalas);
            if (response.data.success) {
                navigate('/admin/foglalas');
            }
        } catch (err) {
            setError("Error updating reservation");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-content-container">
                    <p>Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="admin-content-container">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-content-container">
                <div className="admin-header">
                    <h1 className="h2">Foglalás szerkesztése</h1>
                </div>
                <div className="admin-table-container">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Felhasználó ID</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                value={foglalas.UserID || ''}
                                onChange={(e) => setFoglalas({ ...foglalas, UserID: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Vetítés ID</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                value={foglalas.VetitesID || ''}
                                onChange={(e) => setFoglalas({ ...foglalas, VetitesID: e.target.value })}
                            />
                        </div>
                        {/* Add seat selection component here */}
                        <div className="d-flex gap-2">
                            <button
                                type="submit"
                                className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                            >
                                Mentés
                            </button>
                            <button
                                type="button"
                                className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                onClick={() => navigate('/admin/foglalas')}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default FoglalasEditAdmin;