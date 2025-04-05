import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';

function VetitesEditAdmin() {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [vetites, setVetites] = useState({
        id: id || '',
        filmid: '',
        teremid: '',
        idopont: '',
        megjegyzes: ''
    });
    const [filmek, setFilmek] = useState([]);
    const [termek, setTermek] = useState([]);
    const [vetitesSzekek, setVetitesSzekek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const loadVetitesData = async () => {
            try {
                const [filmsResponse, roomsResponse] = await Promise.all([
                    api.get('/Film/get'),
                    api.get('/Terem/get')
                ]);

                setFilmek(filmsResponse.data || []);
                setTermek(roomsResponse.data?.map(item => item.terem) || []);

                if (id && id !== 'undefined' && id !== 'add') {
                    setLoading(true);
                    const response = await api.get(`/Vetites/get/${id}`);
                    const vetitesData = response.data?.vetites || response.data?.Vetites;

                    if (vetitesData) {
                        setVetites({
                            id: vetitesData.id,
                            filmid: vetitesData.Filmid?.toString() || vetitesData.filmid?.toString() || '',
                            teremid: vetitesData.Teremid?.toString() || vetitesData.teremid?.toString() || '',
                            idopont: vetitesData.Idopont
                                ? new Date(vetitesData.Idopont).toISOString().slice(0, 16)
                                : vetitesData.idopont
                                    ? new Date(vetitesData.idopont).toISOString().slice(0, 16)
                                    : '',
                            megjegyzes: vetitesData.Megjegyzes || vetitesData.megjegyzes || ''
                        });
                        setVetitesSzekek(vetitesData.VetitesSzekek || vetitesData.vetitesSzekek || []);
                    }
                }
            } catch (error) {
                setError(error.message || "Hiba történt az adatok betöltésekor");
                navigate('/admin/vetitesek', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        loadVetitesData();
    }, [id, api, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVetites(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        try {
            const method = id && id !== 'add' ? 'patch' : 'post';
            const url = id && id !== 'add' ? '/Vetites/edit' : '/Vetites/add';

            const response = await api[method](url, {
                id: vetites.id.toString(),
                Filmid: vetites.filmid,
                Teremid: vetites.teremid,
                Idopont: vetites.idopont,
                Megjegyzes: vetites.megjegyzes
            });

            if (response.data?.errorMessage) {
                if (response.data.errorMessage === "Sikeres módosítás" ||
                    response.data.errorMessage === "Sikeres hozzáadás") {
                    setSuccessMessage(response.data.errorMessage);
                    if (id === 'add') {
                        const newId = response.data?.vetites?.id || response.data?.Vetites?.id;
                        if (newId) {
                            navigate(`/admin/vetitesek/edit/${newId}`);
                        } else {
                            setVetites({
                                id: '',
                                filmid: '',
                                teremid: '',
                                idopont: '',
                                megjegyzes: ''
                            });
                        }
                    }
                } else {
                    setError(response.data.errorMessage);
                }
            } else {
                setError("Váratlan hiba történt");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage ||
                error.response?.data?.error ||
                "Hiba történt a mentés során";
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const renderSeatGrid = () => {
        if (!vetitesSzekek.length) {
            return (
                <div className="mt-4">
                    <p className="text-muted"></p>
                </div>
            );
        }
        const maxX = Math.max(...vetitesSzekek.map(s => s.X || s.x || 0)) + 1;
        const maxY = Math.max(...vetitesSzekek.map(s => s.Y || s.y || 0)) + 1;
        const gridWidth = maxY * 45;

        return (
            <div className="mt-4 d-flex flex-column align-items-center">
                <h4>Székfoglalások állapota</h4>
                <div className="seat-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${maxY}, minmax(30px, 40px))`,
                    gap: '5px',
                    marginTop: '10px',
                    width: '100%',
                    overflowX: 'auto',
                    paddingBottom: '10px'
                }}>
                    {Array.from({ length: maxX * maxY }).map((_, index) => {
                        const row = Math.floor(index / maxY);
                        const col = index % maxY;
                        const seat = vetitesSzekek.find(s =>
                            (s.X === row || s.x === row) &&
                            (s.Y === col || s.y === col)
                        );
                        const seatStatus = seat?.FoglalasAllapot ?? seat?.foglalasAllapot ?? 0;

                        let seatColor, seatOpacity, seatTitle;
                        switch (seatStatus) {
                            case 0: 
                                seatColor = '#6c757d';
                                seatOpacity = 0.5;
                                seatTitle = 'Nem elérhető';
                                break;
                            case 1: 
                                seatColor = '#28a745';
                                seatOpacity = 1;
                                seatTitle = 'Szabad';
                                break;
                            case 2:
                                seatColor = '#dc3545';
                                seatOpacity = 1;
                                seatTitle = 'Foglalt';
                                break;
                            default:
                                seatColor = '#6c757d';
                                seatOpacity = 0.3;
                                seatTitle = 'Ismeretlen állapot';
                        }

                        return (
                            <div
                                key={`seat-${row}-${col}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: seatColor,
                                    opacity: seatOpacity,
                                    border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                title={`Sor: ${row + 1}, Oszlop: ${col + 1}\nÁllapot: ${seatTitle}`}
                            >
                                <small className="text-light">
                                    {row + 1}-{col + 1}
                                </small>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3 d-flex gap-3 flex-wrap justify-content-center">
                    <div className="d-flex align-items-center">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#28a745',
                            marginRight: '5px',
                            border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`
                        }}></div>
                        <small>Szabad</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#dc3545',
                            marginRight: '5px',
                            border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`
                        }}></div>
                        <small>Foglalt</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#6c757d',
                            opacity: 0.5,
                            marginRight: '5px',
                            border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`
                        }}></div>
                        <small>Nem elérhető</small>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (<AdminLayout><ThemeWrapper className="betoltes">
            <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div className="spinner"></div>
            </div>
        </ThemeWrapper></AdminLayout>);
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom p-3">
                <h1 className="h2">{id && id !== 'add' ? 'Vetítés adatai' : 'Új vetítés hozzáadása'}</h1>
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
                    <div className="col-12 col-md-6">
                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="filmid" className="form-label">Film</label>
                            <select
                                className={`form-select ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="filmid"
                                name="filmid"
                                value={vetites.filmid}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Válassz filmet</option>
                                {filmek.map(film => (
                                    <option key={film.id} value={film.id}>{film.cim}</option>
                                ))}
                            </select>
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="teremid" className="form-label">Terem</label>
                            <select
                                className={`form-select ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="teremid"
                                name="teremid"
                                value={vetites.teremid}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Válassz termet</option>
                                {termek.map(terem => (
                                    <option key={terem.id} value={terem.id}>{terem.nev}</option>
                                ))}
                            </select>
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="idopont" className="form-label">Időpont</label>
                            <input
                                type="datetime-local"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="idopont"
                                name="idopont"
                                value={vetites.idopont}
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
                                value={vetites.megjegyzes}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        {renderSeatGrid()}
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                            type="submit"
                            className={`btn ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                            disabled={isSaving}
                            style={{ padding: '0.5rem 1rem', flex: '1 1 auto' }}
                        >
                            {isSaving ? 'Mentés...' : (id && id !== 'add' ? 'Mentés' : 'Hozzáadás')}
                        </button>
                        <button
                            type="button"
                            className={`btn ${darkMode ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={() => navigate('/admin/vetitesek')}
                            disabled={isSaving}
                            style={{ padding: '0.5rem 1rem', flex: '1 1 auto' }}
                        >
                            Mégse
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

export default VetitesEditAdmin;