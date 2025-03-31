import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BASE_URL = "https://localhost:7153";

function FilmListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [filter, setFilter] = useState({
        id: "", cim: "", kategoria: ""
    });

    const [allFilms, setAllFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredFilms = useMemo(() => {
        return allFilms.filter(film => {
            return Object.entries(filter).every(([key, value]) => {
                if (!value) return true;
                const filmValue = String(film[key] || '').toLowerCase();
                return filmValue.includes(value.toLowerCase());
            });
        });
    }, [allFilms, filter]);

    const handleFilterChange = useCallback((e) => {
        setFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            try {
                const response = await api.get('/Film/get', {
                    signal: controller.signal,
                    withCredentials: true
                });

                if (response.data && Array.isArray(response.data)) {
                    setAllFilms(response.data);
                } else {
                    setError("Érvénytelen adatformátum érkezett a szerverről");
                }
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    setError(error.response?.data?.error || "Hiba a filmek betöltésekor");
                    console.error("API hiba:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();

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
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3  p-3 border-bottom">
                <h1 className="h2">Filmek kezelése</h1>
                <button
                    className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => navigate('/admin/filmek/add')}
                >
                    Új film hozzáadása
                </button>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr className={darkMode ? 'bg-dark text-light' : 'bg-light'}>
                            <th>ID</th>
                            <th>Cím</th>
                            <th>Kategória</th>
                            <th></th>
                        </tr>
                        <tr className={darkMode ? 'bg-secondary' : 'bg-light'}>
                            {Object.keys(filter).map(key => (
                                <th key={key}>
                                    <input
                                        type="text"
                                        name={key}
                                        onChange={handleFilterChange}
                                        value={filter[key]}
                                        className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    />
                                </th>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFilms.length > 0 ? (
                            filteredFilms.map(film => (
                                <>
                                    <tr
                                        key={film.id}
                                        className={`cursor-pointer ${darkMode ? 'table-dark' : ''} ${expandedRows[film.id] ? (darkMode ? 'bg-gray-800' : 'bg-light') : ''}`}
                                        onClick={() => toggleRow(film.id)}
                                    >
                                        <td>{film.id}</td>
                                        <td>{film.cim}</td>
                                        <td>{film.kategoria}</td>
                                        <td className="text-center">
                                            {expandedRows[film.id] ?
                                                <FaChevronUp className={darkMode ? 'text-light' : 'text-dark'} /> :
                                                <FaChevronDown className={darkMode ? 'text-light' : 'text-dark'} />
                                            }
                                        </td>
                                    </tr>
                                    {expandedRows[film.id] && (
                                        <tr className={darkMode ? 'bg-gray-800' : ''}>
                                            <td colSpan={4} className="p-0 border-0">
                                                <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-light'}`}>
                                                    <table className={`table table-bordered mb-0 ${darkMode ? 'table-dark' : ''}`}>
                                                        <tbody>
                                                            <tr>
                                                                <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Műfaj</th>
                                                                <td>{film.mufaj}</td>
                                                                <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Korhatár</th>
                                                                <td>{film.korhatar}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Játékidő</th>
                                                                <td>{film.jatekido} perc</td>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Gyártó</th>
                                                                <td>{film.gyarto}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Rendező</th>
                                                                <td>{film.rendezo}</td>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Szereplők</th>
                                                                <td>{film.szereplok}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Leírás</th>
                                                                <td colSpan={3}>{film.leiras}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Eredeti nyelv</th>
                                                                <td>{film.eredetiNyelv}</td>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Eredeti cím</th>
                                                                <td>{film.eredetiCim}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Szinkron</th>
                                                                <td>{film.szinkron}</td>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>IMDB</th>
                                                                <td>{film.imdb}</td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Trailer</th>
                                                                <td>
                                                                    {film.trailerLink && (
                                                                        <a href={film.trailerLink} target="_blank" rel="noopener noreferrer" className={darkMode ? 'text-info' : ''}>
                                                                            Trailer megtekintése
                                                                        </a>
                                                                    )}
                                                                </td>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Borítókép</th>
                                                                <td>
                                                                    {film.images?.relativePath && (
                                                                        <img
                                                                            src={`${BASE_URL}${film.images.relativePath}`}
                                                                            alt={film.cim}
                                                                            style={{
                                                                                width: '100px',
                                                                                height: 'auto',
                                                                                objectFit: 'cover'
                                                                            }}
                                                                            onError={(e) => {
                                                                                e.target.src = '/placeholder-image.jpg';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Műveletek</th>
                                                                <td colSpan={3}>
                                                                    <button
                                                                        className={`btn btn-sm ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate(`/admin/filmek/edit/${film.id}`);
                                                                        }}
                                                                    >
                                                                        Szerkesztés
                                                                    </button>
                                                                    <button
                                                                        className={`btn btn-sm ms-2 ${darkMode ? 'btn-danger' : 'btn-outline-danger'}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigate(`/admin/filmek/delete/${film.id}`);
                                                                        }}
                                                                    >
                                                                        Törlés
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr className={darkMode ? 'table-dark' : ''}>
                                <td colSpan={4} className="text-center py-4">
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

export default FilmListAdmin;