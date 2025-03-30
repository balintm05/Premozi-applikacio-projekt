import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

function FoglalasListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        id: "",
        UserID: "",
        VetitesID: ""
    });
    const [allFoglalasok, setAllFoglalasok] = useState([]);
    const [filteredFoglalasok, setFilteredFoglalasok] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        api.get('/Foglalas/get', {
            signal: controller.signal,
            withCredentials: true
        })
            .then(response => {
                setAllFoglalasok(response.data);
                setFilteredFoglalasok(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (error.name !== 'CanceledError') {
                    console.error("Error loading reservations:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    useEffect(() => {
        // Client-side filtering
        const filtered = allFoglalasok.filter(foglalas => {
            return (
                (filter.id === "" || foglalas.id.toString().includes(filter.id)) &&
                (filter.UserID === "" || foglalas.UserID.toString().includes(filter.UserID)) &&
                (filter.VetitesID === "" || foglalas.VetitesID.toString().includes(filter.VetitesID))
            );
        });
        setFilteredFoglalasok(filtered);
    }, [filter, allFoglalasok]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reservation?")) {
            try {
                await api.delete(`/Foglalas/delete/${id}`);
                setAllFoglalasok(allFoglalasok.filter(f => f.id !== id));
            } catch (error) {
                console.error("Error deleting reservation:", error);
            }
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

    return (
        <AdminLayout>
            <div className="admin-content-container">
                <div className="admin-header">
                    <h1 className="h2">Foglalások kezelése</h1>
                </div>
                <div className="admin-table-container">
                    <div className="table-responsive">
                        <table className={`admin-table ${darkMode ? 'table-dark' : ''}`}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Felhasználó ID</th>
                                    <th>Vetítés ID</th>
                                    <th>Foglalás időpontja</th>
                                    <th>Műveletek</th>
                                </tr>
                                <tr>
                                    <th>
                                        <input
                                            type="text"
                                            name="id"
                                            onChange={handleFilterChange}
                                            value={filter.id}
                                            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                            placeholder="Szűrés ID"
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            name="UserID"
                                            onChange={handleFilterChange}
                                            value={filter.UserID}
                                            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                            placeholder="Szűrés Felhasználó ID"
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            name="VetitesID"
                                            onChange={handleFilterChange}
                                            value={filter.VetitesID}
                                            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                            placeholder="Szűrés Vetítés ID"
                                        />
                                    </th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFoglalasok.map((foglalas) => (
                                    <tr key={foglalas.id}>
                                        <td>{foglalas.id}</td>
                                        <td>{foglalas.UserID}</td>
                                        <td>{foglalas.VetitesID}</td>
                                        <td>{new Date(foglalas.createdAt).toLocaleString()}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className={`btn ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                                    onClick={() => navigate(`/admin/foglalas/edit/${foglalas.id}`)}
                                                    style={{
                                                        borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`
                                                    }}
                                                >
                                                    Szerkesztés
                                                </button>
                                                <button
                                                    className={`btn ${darkMode ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => handleDelete(foglalas.id)}
                                                >
                                                    Törlés
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default FoglalasListAdmin;