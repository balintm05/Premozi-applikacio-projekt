import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';

function VetitesListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [filter, setFilter] = useState({
        id: "",
        film: "",
        terem: ""
    });
    const [allVetitesek, setAllVetitesek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        api.get('/Vetites/get', {
            signal: controller.signal
        })
            .then(response => {
                const vetitesData = Array.isArray(response.data)
                    ? response.data.map(item => ({
                        ...item.vetites,
                        terem: item.vetites.terem 
                    })).filter(Boolean)
                    : [];
                setAllVetitesek(vetitesData);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'CanceledError') {
                    setError(error.response?.data?.error || "Hiba a vetítések betöltésekor");
                    console.error("Error fetching vetites data:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    const filteredVetitesek = useMemo(() => {
        return allVetitesek.filter(vetites => {
            const vetitesId = vetites?.id?.toString() || '';
            const filmNev = vetites?.film?.cim?.toLowerCase() || '';
            const teremNev = vetites?.terem?.nev?.toLowerCase() || '';

            return (
                (filter.id === "" || vetitesId.includes(filter.id)) &&
                (filter.film === "" || filmNev.includes(filter.film.toLowerCase())) &&
                (filter.terem === "" || teremNev.includes(filter.terem.toLowerCase()))
            );
        });
    }, [allVetitesek, filter]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };
    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt a vetítést?")) {
            try {
                await api.delete(`/Vetites/delete/${id}`);
                setAllVetitesek(allVetitesek.filter(vetites => vetites.id !== id));
            } catch (error) {
                setError(error.response?.data?.error || "Hiba a vetítés törlésekor");
            }
        }
    };
    useEffect(() => {
        const controller = new AbortController();

        api.get('/Vetites/get', {
            signal: controller.signal
        })
            .then(response => {
                const vetitesData = Array.isArray(response.data)
                    ? response.data.map(item => item.vetites).filter(Boolean)
                    : [];
                setAllVetitesek(vetitesData);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'CanceledError') {
                    setError(error.response?.data?.error || "Hiba a vetítések betöltésekor");
                    console.error("Error fetching vetites data:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-content-container">
                    <p>Betöltés...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="admin-content-container">
                    <div className={`alert ${darkMode ? 'alert-danger' : 'alert-warning'}`}>
                        {error}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 p-3 border-bottom">
                <h1 className="h2">Vetítések kezelése</h1>
                <button
                    className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => navigate('/admin/vetitesek/add')}
                >
                    Új vetítés hozzáadása
                </button>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr className={darkMode ? 'bg-dark text-light' : 'bg-light'}>
                            <th>ID</th>
                            <th>Film</th>
                            <th>Terem</th>
                            <th>Időpont</th>
                            <th>Megjegyzés</th>
                            <th>Műveletek</th>
                        </tr>
                        <tr className={darkMode ? 'bg-secondary' : 'bg-light'}>
                            <th>
                                <input
                                    type="text"
                                    name="id"
                                    onChange={handleFilterChange}
                                    value={filter.id}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Keresés ID"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="film"
                                    onChange={handleFilterChange}
                                    value={filter.film}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Keresés film"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="terem"
                                    onChange={handleFilterChange}
                                    value={filter.terem}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Keresés terem"
                                />
                            </th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVetitesek.length > 0 ? (
                            filteredVetitesek.map(vetites => (
                                <tr key={`vetites-${vetites.id}`} className={darkMode ? 'table-dark' : ''}>
                                    <td>{vetites.id}</td>
                                    <td>{vetites.film?.cim || '-'}</td>
                                    <td>{vetites.terem?.nev || '-'}</td>
                                    <td>{vetites.idopont ? new Date(vetites.idopont).toLocaleString() : '-'}</td>
                                    <td>{vetites.megjegyzes || '-'}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className={`btn btn-sm ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                                onClick={() => navigate(`/admin/vetitesek/edit/${vetites.id}`)}
                                            >
                                                Módosítás
                                            </button>
                                            <button
                                                className={`btn btn-sm ${darkMode ? 'btn-danger' : 'btn-outline-danger'}`}
                                                onClick={() => handleDelete(vetites.id)}
                                            >
                                                Törlés
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key="no-results" className={darkMode ? 'table-dark' : ''}>
                                <td colSpan={6} className="text-center py-4">
                                    {allVetitesek.length === 0 ? "Nincsenek vetítések az adatbázisban" : "Nincs találat a szűrési feltételek alapján"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default VetitesListAdmin;