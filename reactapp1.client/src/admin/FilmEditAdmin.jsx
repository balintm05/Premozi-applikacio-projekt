import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { filmupload } from "../api/axiosConfig";

function FilmEditAdmin() {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [film, setFilm] = useState({
        id: id || '',
        cim: '',
        kategoria: '',
        mufaj: '',
        korhatar: '',
        jatekido: '',
        gyarto: '',
        rendezo: '',
        szereplok: '',
        leiras: '',
        eredetiNyelv: '',
        eredetiCim: '',
        szinkron: '',
        trailerLink: '',
        imdb: '',
        megjegyzes: '',
        image: null
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (id && id !== 'undefined' && id !== 'add') {
            api.get(`/Film/get/${id}`)
                .then(response => {
                    const filmData = response.data;
                    if (filmData) {
                        setFilm({
                            id: filmData.id,
                            cim: filmData.cim,
                            kategoria: filmData.kategoria,
                            mufaj: filmData.mufaj,
                            korhatar: filmData.korhatar,
                            jatekido: filmData.jatekido,
                            gyarto: filmData.gyarto,
                            rendezo: filmData.rendezo,
                            szereplok: filmData.szereplok,
                            leiras: filmData.leiras,
                            eredetiNyelv: filmData.eredetiNyelv,
                            eredetiCim: filmData.eredetiCim,
                            szinkron: filmData.szinkron,
                            trailerLink: filmData.trailerLink,
                            imdb: filmData.imdb,
                            megjegyzes: filmData.megjegyzes || ''
                        });
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.response?.data?.error || "Hiba a film betöltésekor");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id, api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilm(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleFileChange = (e) => {
        setFilm(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        try {
            const formData = new FormData();
            Object.entries(film).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const method = id && id !== 'add' ? 'patch' : 'post';
            const url = id && id !== 'add' ? '/Film/edit' : '/Film/add';

            const response = await filmupload[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data?.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccessMessage(id && id !== 'add'
                    ? "A film sikeresen frissítve!"
                    : "A film sikeresen hozzáadva!");
                if (id === 'add' && response.data?.film?.id) {
                    navigate(`/admin/filmek/edit/${response.data.film.id}`);
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "Hiba történt a mentés során");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <AdminLayout><p>Betöltés...</p></AdminLayout>;
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 p-3 border-bottom">
                <h1 className="h2">{id && id !== 'add' ? 'Film szerkesztése' : 'Új film hozzáadása'}</h1>
            </ThemeWrapper>

            {error && (
                <div className={`alert alert-danger mt-3`}>
                    {error}
                </div>
            )}

            {successMessage && (
                <div className={`alert alert-success mt-3`}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="cim" className="form-label">Cím</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="cim"
                                name="cim"
                                value={film.cim}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="kategoria" className="form-label">Kategória</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="kategoria"
                                name="kategoria"
                                value={film.kategoria}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="mufaj" className="form-label">Műfaj</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="mufaj"
                                name="mufaj"
                                value={film.mufaj}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="korhatar" className="form-label">Korhatár</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="korhatar"
                                name="korhatar"
                                value={film.korhatar}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="jatekido" className="form-label">Játékidő (perc)</label>
                            <input
                                type="number"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="jatekido"
                                name="jatekido"
                                value={film.jatekido}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="gyarto" className="form-label">Gyártó</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="gyarto"
                                name="gyarto"
                                value={film.gyarto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="rendezo" className="form-label">Rendező</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="rendezo"
                                name="rendezo"
                                value={film.rendezo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="szereplok" className="form-label">Szereplők</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="szereplok"
                                name="szereplok"
                                value={film.szereplok}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="leiras" className="form-label">Leírás</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="leiras"
                                name="leiras"
                                value={film.leiras}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="eredetiNyelv" className="form-label">Eredeti nyelv</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="eredetiNyelv"
                                name="eredetiNyelv"
                                value={film.eredetiNyelv}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="eredetiCim" className="form-label">Eredeti cím</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="eredetiCim"
                                name="eredetiCim"
                                value={film.eredetiCim}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="szinkron" className="form-label">Szinkron</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="szinkron"
                                name="szinkron"
                                value={film.szinkron}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="trailerLink" className="form-label">Trailer link</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="trailerLink"
                                name="trailerLink"
                                value={film.trailerLink}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="imdb" className="form-label">IMDB</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="imdb"
                                name="imdb"
                                value={film.imdb}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="megjegyzes" className="form-label">Megjegyzés</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="megjegyzes"
                                name="megjegyzes"
                                value={film.megjegyzes}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="image" className="form-label">Borítókép</label>
                            <input
                                type="file"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                                accept="image/*"
                                required={id === 'add'}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                    <button
                        type="submit"
                        className={`btn ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Mentés...' : (id && id !== 'add' ? 'Mentés' : 'Hozzáadás')}
                    </button>
                    <button
                        type="button"
                        className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        onClick={() => navigate('/admin/filmek')}
                        disabled={isSaving}
                    >
                        Mégse
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

export default FilmEditAdmin;