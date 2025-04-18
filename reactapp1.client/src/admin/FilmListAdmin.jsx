import { useState, useEffect, useContext, useCallback, useMemo, Fragment } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import YouTubeModal from "../components/videos/YoutubeModal";
import ReactDOM from 'react-dom';
import '../components/images/ImageModal.css';

const BASE_URL = `${window.location.protocol}//${window.location.hostname}:7153`;

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    document.title = "Filmek listája - Premozi";
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

    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
            try {
                await api.delete(`/Film/delete/${id}`);
                setAllFilms(allFilms.filter(film => film.id !== id));
            } catch (error) {
                setError(error.response?.data?.error || "Hiba a film törlésekor");
            }
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const ImageModal = () => {
        if (!isImageModalOpen || !selectedImage) return null;

        return ReactDOM.createPortal(
            <div className="image-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
                <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setIsImageModalOpen(false)}>
                        &times;
                    </button>
                    <div className="image-container">
                        <img
                            src={selectedImage}
                            alt="Film borítókép"
                            className="modal-image"
                        />
                    </div>
                </div>
            </div>,
            document.body
        );
    };

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
                <ThemeWrapper className="betoltes">
                    <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                        <div className="spinner"></div>
                    </div>
                </ThemeWrapper>
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
                <h1 className="h2">Filmek kezelése</h1>
                <button
                    className={`btn ${darkMode ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => navigate('/admin/filmek/add')}
                >
                    Új film hozzáadása
                </button>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`} style={{ minWidth: '768px' }}>
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
                                <Fragment key={`film-${film.id}`}>
                                    <tr
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
                                        <tr key={`details-${film.id}`} className={darkMode ? 'bg-gray-800' : ''}>
                                            <td colSpan={4} className="p-0 border-0">
                                                <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-light'}`}>
                                                    <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                                        <table className={`table table-bordered mb-0 ${darkMode ? 'table-dark' : ''}`} style={{ minWidth: '600px' }}>
                                                            <tbody>
                                                                <tr key={`row-1-${film.id}`}>
                                                                    <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Műfaj</th>
                                                                    <td>{film.mufaj}</td>
                                                                    <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Korhatár</th>
                                                                    <td><img
                                                                        src={`${window.location.protocol}//${window.location.hostname}:7153/images/${film.korhatar}.png`}
                                                                        style={{ height: "25px" }}
                                                                        alt={`Korhatár besorolás: ${film.korhatar}`}
                                                                        className="h-6"
                                                                    /></td>
                                                                </tr>
                                                                <tr key={`row-2-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Játékidő</th>
                                                                    <td>{film.jatekido} perc</td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Gyártó</th>
                                                                    <td>{film.gyarto}</td>
                                                                </tr>
                                                                <tr key={`row-3-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Rendező</th>
                                                                    <td>{film.rendezo}</td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Szereplők</th>
                                                                    <td>{film.szereplok}</td>
                                                                </tr>
                                                                <tr key={`row-4-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Leírás</th>
                                                                    <td colSpan={3}>{film.leiras}</td>
                                                                </tr>
                                                                <tr key={`row-5-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Eredeti nyelv</th>
                                                                    <td>{film.eredetiNyelv}</td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Eredeti cím</th>
                                                                    <td>{film.eredetiCim}</td>
                                                                </tr>
                                                                <tr key={`row-6-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Szinkron</th>
                                                                    <td>{film.szinkron}</td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>IMDB</th>
                                                                    <td>{film.imdb}</td>
                                                                </tr>
                                                                <tr key={`row-7-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Előzetes</th>
                                                                    <td>
                                                                        {film.trailerLink && (
                                                                            <YouTubeModal youtubeUrl={film.trailerLink}>
                                                                                <a
                                                                                    href="#"
                                                                                    onClick={(e) => e.preventDefault()}
                                                                                    className={darkMode ? 'text-info' : ''}
                                                                                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                                                                                >
                                                                                    Előzetes megtekintése
                                                                                </a>
                                                                            </YouTubeModal>
                                                                        )}
                                                                    </td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Borítókép</th>
                                                                    <td>
                                                                        {film.images?.relativePath && (
                                                                            <div
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => handleImageClick(`${BASE_URL}${film.images.relativePath}`)}
                                                                            >
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
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr key={`row-8-${film.id}`}>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Műveletek</th>
                                                                    <td colSpan={3}>
                                                                        <div className="d-flex flex-wrap gap-2">
                                                                            <button
                                                                                className={`btn btn-sm btn-success`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    navigate(`/film/${film.id}`);
                                                                                }}
                                                                            >
                                                                                Oldal
                                                                            </button>
                                                                            <button
                                                                                className={`btn btn-sm btn-primary`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    navigate(`/admin/filmek/edit/${film.id}`);
                                                                                }}
                                                                            >
                                                                                Szerkesztés
                                                                            </button>
                                                                            <button
                                                                                className={`btn btn-sm btn-danger`}
                                                                                disabled={film.vetitesek?.length > 0}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDelete(film.id);                                                                                   
                                                                                }}
                                                                            >
                                                                                Törlés
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
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

            <ImageModal />
        </AdminLayout>
    );
}

export default FilmListAdmin;