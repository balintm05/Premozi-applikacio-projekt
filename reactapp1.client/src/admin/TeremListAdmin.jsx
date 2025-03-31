import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';

function TeremListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [filter, setFilter] = useState({
        id: "",
        nev: ""
    });
    const [allTermek, setAllTermek] = useState([]);
    const [filteredTermek, setFilteredTermek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        api.get('/Terem/get', {
            signal: controller.signal
        })
            .then(response => {
                const data = Array.isArray(response.data) ?
                    response.data.map(item => item.terem) :
                    [];

                if (data.length === 0) {
                    setError("Nem található terem");
                }

                setAllTermek(data);
                setFilteredTermek(data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'CanceledError') {
                    setError(error.response?.data?.error || "Hiba a termek betöltésekor");
                    console.error("Error fetching terem data:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    useEffect(() => {
        const filtered = allTermek.filter(terem => {
            const teremId = terem?.id?.toString() || '';
            const teremNev = terem?.nev?.toLowerCase() || '';

            return (
                (filter.id === "" || teremId.includes(filter.id)) &&
                (filter.nev === "" || teremNev.includes(filter.nev.toLowerCase()))
            );
        });
        setFilteredTermek(filtered);
    }, [filter, allTermek]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <AdminLayout><p>Betöltés...</p></AdminLayout>;
    }

    if (error) {
        return (
            <AdminLayout>
                <div className={`alert ${darkMode ? 'alert-danger' : 'alert-warning'}`}>
                    {error}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3  p-3 border-bottom">
                <h1 className="h2">Termek kezelése</h1>
                <button
                    className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => navigate('/admin/termek/add')}
                >
                    Új terem hozzáadása
                </button>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Székek száma</th>
                            <th>Megjegyzés</th>
                            <th>Műveletek</th>
                        </tr>
                        <tr>
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
                                    name="nev"
                                    onChange={handleFilterChange}
                                    value={filter.nev}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Keresés név"
                                />
                            </th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTermek.length > 0 ? (
                            filteredTermek.map(terem => {
                                const szekekCount = terem?.szekek?.length || 0;

                                return (
                                    <tr key={terem.id || `terem-${Math.random().toString(36).substr(2, 9)}`}>
                                        <td>{terem.id}</td>
                                        <td>{terem.nev}</td>
                                        <td>{szekekCount}</td>
                                        <td>{terem.megjegyzes || '-'}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className={`btn ${darkMode ? 'btn-info' : 'btn-outline-info'}`}
                                                    onClick={() => navigate(`/admin/termek/edit/${terem.id}`)}
                                                >
                                                    Módosítás
                                                </button>
                                                <button
                                                    className={`btn ${darkMode ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => navigate(`/admin/termek/delete/${terem.id}`)}
                                                >
                                                    Törlés
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Nincs találat
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default TeremListAdmin;