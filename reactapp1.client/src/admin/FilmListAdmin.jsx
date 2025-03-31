import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';

function FilmListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [filter, setFilter] = useState({
        id: "",
        cim: "",
        kategoria: ""
    });
    const [allFilms, setAllFilms] = useState([]);
    const [filteredFilms, setFilteredFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        api.get('/Film/get', {
            signal: controller.signal
        })
            .then(response => {
                setAllFilms(response.data || []);
                setFilteredFilms(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'CanceledError') {
                    setError(error.response?.data?.error || "Error loading films");
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    useEffect(() => {
        const filtered = allFilms.filter(film => {
            const filmId = film?.id?.toString() || '';
            const filmCim = film?.cim?.toLowerCase() || '';
            const filmKategoria = film?.kategoria?.toLowerCase() || '';

            return (
                (filter.id === "" || filmId.includes(filter.id)) &&
                (filter.cim === "" || filmCim.includes(filter.cim.toLowerCase())) &&
                (filter.kategoria === "" || filmKategoria.includes(filter.kategoria.toLowerCase()))
            );
        });
        setFilteredFilms(filtered);
    }, [filter, allFilms]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <AdminLayout><p>Loading...</p></AdminLayout>;
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
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 p-3 border-bottom">
                <h1 className="h2">Film Management</h1>
                <button
                    className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => navigate('/admin/filmek/add')}
                >
                    Add New Film
                </button>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                        <tr>
                            <th>
                                <input
                                    type="text"
                                    name="id"
                                    onChange={handleFilterChange}
                                    value={filter.id}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Search by ID"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="cim"
                                    onChange={handleFilterChange}
                                    value={filter.cim}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Search by title"
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="kategoria"
                                    onChange={handleFilterChange}
                                    value={filter.kategoria}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    placeholder="Search by category"
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFilms.length > 0 ? (
                            filteredFilms.map(film => (
                                <tr key={film.id || `film-${Math.random().toString(36).substr(2, 9)}`}>
                                    <td>{film.id}</td>
                                    <td>{film.cim}</td>
                                    <td>{film.kategoria}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className={`btn ${darkMode ? 'btn-info' : 'btn-outline-info'}`}
                                                onClick={() => navigate(`/admin/filmek/edit/${film.id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`btn ${darkMode ? 'btn-danger' : 'btn-outline-danger'}`}
                                                onClick={() => navigate(`/admin/filmek/delete/${film.id}`)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default FilmListAdmin;