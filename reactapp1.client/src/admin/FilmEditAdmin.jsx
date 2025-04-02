import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { filmupload } from "../api/axiosConfig";
import { FaImage } from 'react-icons/fa';

function FilmEditAdmin() {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [film, setFilm] = useState({
        id: id || '',
        Cim: '',
        Kategoria: '',
        Mufaj: '',
        Korhatar: '',
        Jatekido: '',
        Gyarto: '',
        Rendezo: '',
        Szereplok: '',
        Leiras: '',
        EredetiNyelv: '',
        EredetiCim: '',
        Szinkron: '',
        TrailerLink: '',
        IMDB: '',
        Megjegyzes: '',
        image: null,
        imageId: null,
        selectedImageUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showImageLibrary, setShowImageLibrary] = useState(false);
    const [libraryImages, setLibraryImages] = useState([]);
    const [libraryLoading, setLibraryLoading] = useState(false);

    useEffect(() => {
        if (id && id !== 'undefined' && id !== 'add') {
            api.get(`/Film/get/${id}`)
                .then(response => {
                    const filmData = response.data;
                    if (filmData) {
                        setFilm({
                            id: filmData.id,
                            Cim: filmData.Cim,
                            Kategoria: filmData.Kategoria,
                            Mufaj: filmData.Mufaj,
                            Korhatar: filmData.Korhatar,
                            Jatekido: filmData.Jatekido.toString(),
                            Gyarto: filmData.Gyarto,
                            Rendezo: filmData.Rendezo,
                            Szereplok: filmData.Szereplok,
                            Leiras: filmData.Leiras,
                            EredetiNyelv: filmData.EredetiNyelv,
                            EredetiCim: filmData.EredetiCim,
                            Szinkron: filmData.Szinkron,
                            TrailerLink: filmData.TrailerLink,
                            IMDB: filmData.IMDB,
                            Megjegyzes: filmData.Megjegyzes || '',
                            imageId: filmData.ImageID,
                            selectedImageUrl: filmData.imagePath || ''
                        });
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.response?.data?.error || "Hiba történt a film betöltésekor");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [id, api]);

    const loadImageLibrary = async () => {
        setLibraryLoading(true);
        try {
            const response = await api.get('/Image/get');
            setLibraryImages(response.data);
        } catch (error) {
            setError("Nem sikerült betölteni a képeket");
            console.error("Hiba a képek betöltésekor:", error);
        } finally {
            setLibraryLoading(false);
        }
    };

    const handleOpenImageLibrary = () => {
        loadImageLibrary();
        setShowImageLibrary(true);
    };

    const handleSelectImage = (imageUrl, imageId) => {
        setFilm(prev => ({
            ...prev,
            selectedImageUrl: imageUrl,
            imageId: imageId,
            image: null
        }));
        setShowImageLibrary(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilm(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleFileChange = (e) => {
        setFilm(prev => ({
            ...prev,
            image: e.target.files[0],
            imageId: null,
            selectedImageUrl: URL.createObjectURL(e.target.files[0])
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        try {
            const formData = new FormData();

            // For edits, include the film ID
            if (id && id !== 'add') {
                formData.append('id', film.id);
            }

            // Append all required fields
            formData.append('Cim', film.Cim);
            formData.append('Kategoria', film.Kategoria);
            formData.append('Mufaj', film.Mufaj);
            formData.append('Korhatar', film.Korhatar);
            formData.append('Jatekido', film.Jatekido);
            formData.append('Gyarto', film.Gyarto);
            formData.append('Rendezo', film.Rendezo);
            formData.append('Szereplok', film.Szereplok);
            formData.append('Leiras', film.Leiras);
            formData.append('EredetiNyelv', film.EredetiNyelv);
            formData.append('EredetiCim', film.EredetiCim);
            formData.append('Szinkron', film.Szinkron);
            formData.append('TrailerLink', film.TrailerLink);
            formData.append('IMDB', film.IMDB);
            formData.append('Megjegyzes', film.Megjegyzes || '');
            if (film.image) {
                formData.append('image', film.image);
            } else if (film.imageId) {
                formData.append('imageId', film.imageId.toString());
            } else if (id === 'add') {
                throw new Error("Kérem válasszon képet vagy töltsön fel újat");
            }
            const method = id && id !== 'add' ? 'patch' : 'post';
            const url = id && id !== 'add' ? '/Film/edit' : '/Film/add';
            const response = await filmupload[method](url, formData);
            if (response.data?.errorMessage) {
                setError(response.data.errorMessage);
            } else {
                setSuccessMessage(id && id !== 'add'
                    ? "A film sikeresen frissítve!"
                    : "A film sikeresen hozzáadva!");
                if (id === 'add' && response.data?.film?.id) {
                    navigate(`/admin/filmek/edit/${response.data.film.id}`);
                }
                if (id && id !== 'add') {
                    const updatedFilm = await api.get(`/Film/get/${id}`);
                    setFilm(prev => ({
                        ...prev,
                        ...updatedFilm.data,
                        Jatekido: updatedFilm.data.Jatekido.toString(),
                        selectedImageUrl: updatedFilm.data.imagePath || ''
                    }));
                }
            }
        } catch (error) {
            setError(error.response?.data?.errorMessage ||
                error.message ||
                "Hiba történt a mentés során");
            console.error("Mentési hiba:", error);
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
                            <label htmlFor="Cim" className="form-label">Cím*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Cim"
                                name="Cim"
                                value={film.Cim}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Kategoria" className="form-label">Kategória*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Kategoria"
                                name="Kategoria"
                                value={film.Kategoria}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Mufaj" className="form-label">Műfaj*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Mufaj"
                                name="Mufaj"
                                value={film.Mufaj}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Korhatar" className="form-label">Korhatár*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Korhatar"
                                name="Korhatar"
                                value={film.Korhatar}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Jatekido" className="form-label">Játékidő (perc)*</label>
                            <input
                                type="number"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Jatekido"
                                name="Jatekido"
                                value={film.Jatekido}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Gyarto" className="form-label">Gyártó*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Gyarto"
                                name="Gyarto"
                                value={film.Gyarto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Rendezo" className="form-label">Rendező*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Rendezo"
                                name="Rendezo"
                                value={film.Rendezo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Szereplok" className="form-label">Szereplők*</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Szereplok"
                                name="Szereplok"
                                value={film.Szereplok}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Leiras" className="form-label">Leírás*</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Leiras"
                                name="Leiras"
                                value={film.Leiras}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="EredetiNyelv" className="form-label">Eredeti nyelv*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="EredetiNyelv"
                                name="EredetiNyelv"
                                value={film.EredetiNyelv}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="EredetiCim" className="form-label">Eredeti cím*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="EredetiCim"
                                name="EredetiCim"
                                value={film.EredetiCim}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Szinkron" className="form-label">Szinkron*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Szinkron"
                                name="Szinkron"
                                value={film.Szinkron}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="TrailerLink" className="form-label">Trailer link*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="TrailerLink"
                                name="TrailerLink"
                                value={film.TrailerLink}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="IMDB" className="form-label">IMDB*</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="IMDB"
                                name="IMDB"
                                value={film.IMDB}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="Megjegyzes" className="form-label">Megjegyzés</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="Megjegyzes"
                                name="Megjegyzes"
                                value={film.Megjegyzes}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="image" className="form-label">Borítókép*</label>
                            <div className="d-flex gap-2 mb-2">
                                <input
                                    type="file"
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    id="image"
                                    name="image"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required={id === 'add' && !film.imageId}
                                />
                                <button
                                    type="button"
                                    className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    onClick={handleOpenImageLibrary}
                                >
                                    <FaImage className="me-1" /> Könyvtárból
                                </button>
                            </div>
                            {film.selectedImageUrl && (
                                <div className="mt-2">
                                    <img
                                        src={film.selectedImageUrl}
                                        alt="Kiválasztott borítókép"
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                        className="img-thumbnail"
                                    />
                                </div>
                            )}
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
            {showImageLibrary && (
                <div className={`modal-backdrop fade show`} style={{ display: 'block' }}>
                    <div
                        className={`modal fade show ${darkMode ? 'dark-modal' : ''}`}
                        style={{ display: 'block' }}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className={`modal-content ${darkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ opacity: 1 }}>
                                <div className={`modal-header ${darkMode ? 'border-secondary' : ''}`}>
                                    <h5 className="modal-title">Képkönyvtár</h5>
                                    <button
                                        type="button"
                                        className={`btn-close ${darkMode ? 'btn-close-white' : ''}`}
                                        onClick={() => setShowImageLibrary(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    {libraryLoading ? (
                                        <p>Képek betöltése...</p>
                                    ) : (
                                        <div className="row">
                                            {libraryImages.length === 0 ? (
                                                <div className="col-12 text-center py-4">
                                                    <p>Nincsenek képek</p>
                                                </div>
                                            ) : (
                                                libraryImages.map(image => (
                                                    <div key={image.id} className="col-md-4 mb-3">
                                                        <div
                                                            className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleSelectImage(
                                                                `https://localhost:7153${image.relativePath}`,
                                                                image.id
                                                            )}
                                                        >
                                                            <img
                                                                src={`https://localhost:7153${image.relativePath}`}
                                                                className="card-img-top img-fluid"
                                                                alt={image.originalFileName}
                                                                style={{ height: '150px', objectFit: 'cover' }}
                                                            />
                                                            <div className="card-body p-2">
                                                                <p className="card-text small mb-0 text-truncate">
                                                                    {image.originalFileName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`modal-footer ${darkMode ? 'border-secondary' : ''}`}>
                                    <button
                                        type="button"
                                        className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                        onClick={() => setShowImageLibrary(false)}
                                    >
                                        Bezárás
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1040;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .dark-modal .modal-backdrop {
                    background-color: rgba(0, 0, 0, 0.7);
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1050;
                    width: 100%;
                    height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                    outline: 0;
                }
                .modal-content {
                    opacity: 1 !important;
                }
                .modal-dialog {
                    position: relative;
                    width: auto;
                    margin: 0.5rem;
                    pointer-events: none;
                }
                .modal-content {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    pointer-events: auto;
                    background-clip: padding-box;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    border-radius: 0.3rem;
                    outline: 0;
                }
                .dark-modal .modal-content {
                    background-color: #343a40;
                    border-color: #6c757d;
                }
                .modal-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: 1rem;
                    border-bottom: 1px solid #dee2e6;
                    border-top-left-radius: 0.3rem;
                    border-top-right-radius: 0.3rem;
                }
                .dark-modal .modal-header {
                    border-color: #495057;
                }
                .modal-body {
                    position: relative;
                    flex: 1 1 auto;
                    padding: 1rem;
                }
                .modal-footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 1rem;
                    border-top: 1px solid #dee2e6;
                    border-bottom-right-radius: 0.3rem;
                    border-bottom-left-radius: 0.3rem;
                }
                .dark-modal .modal-footer {
                    border-color: #495057;
                }
            `}</style>
        </AdminLayout>
    );
}

export default FilmEditAdmin;