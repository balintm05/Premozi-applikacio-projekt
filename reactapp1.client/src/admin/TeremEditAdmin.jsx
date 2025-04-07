import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';

function TeremEditAdmin() {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [terem, setTerem] = useState({
        id: id || '',
        nev: '',
        sorok: '',
        oszlopok: '',
        megjegyzes: ''
    });
    const [szekek, setSzekek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    document.title = "Terem szerkesztése - Premozi";
    useEffect(() => {
        const loadTeremData = async () => {
            try {
                if (id && id !== 'undefined' && id !== 'add') {
                    setLoading(true);
                    const response = await api.get(`/Terem/get/${id}`);

                    if (!response.data?.terem) {
                        throw new Error("Nem található terem ezzel az ID-vel");
                    }

                    const teremData = response.data.terem;
                    setTerem({
                        id: teremData.id,
                        nev: teremData.nev || '',
                        sorok: teremData.szekek ? Math.max(...teremData.szekek.map(s => s.x)) + 1 : '',
                        oszlopok: teremData.szekek ? Math.max(...teremData.szekek.map(s => s.y)) + 1 : '',
                        megjegyzes: teremData.megjegyzes || ''
                    });
                    setSzekek(teremData.szekek || []);
                }
            } catch (error) {
                setError(error.message || "Hiba történt a terem betöltésekor");
                navigate('/admin/termek', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        loadTeremData();
    }, [id, api, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTerem(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSeatClick = (row, col) => {
        setError(null);
        setSuccessMessage(null);

        const seatIndex = szekek.findIndex(s => s.x === row && s.y === col);
        let updatedSzekek;

        if (seatIndex >= 0) {
            updatedSzekek = [...szekek];
            updatedSzekek[seatIndex] = {
                ...updatedSzekek[seatIndex],
                allapot: updatedSzekek[seatIndex].allapot === 1 ? 0 : 1
            };
        } else {
            updatedSzekek = [
                ...szekek,
                {
                    x: row,
                    y: col,
                    teremid: terem.id,
                    allapot: 1
                }
            ];
        }

        setSzekek(updatedSzekek);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSaving(true);

        try {
            const method = id && id !== 'add' ? 'patch' : 'post';
            const url = id && id !== 'add' ? '/Terem/edit' : '/Terem/add';

            const szekekUpdate = szekek
                .filter(seat => seat.allapot !== undefined)
                .map(seat => ({
                    op: 'replace',
                    path: `/Szekek/${seat.x}-${seat.y}/Allapot`,
                    value: seat.allapot
                }));

            const response = await api[method](url, {
                id: terem.id.toString(),
                Nev: terem.nev,
                Sorok: terem.sorok.toString(),
                Oszlopok: terem.oszlopok.toString(),
                Megjegyzes: terem.megjegyzes,
                SzekekFrissites: szekekUpdate.length > 0 ? szekekUpdate : undefined
            });

            if (response.data?.errorMessage) {
                if (response.data.errorMessage === "Sikeres módosítás" ||
                    response.data.errorMessage === "Sikeres hozzáadás") {
                    setSuccessMessage(response.data.errorMessage);
                    if (id === 'add' && response.data?.terem?.id) {
                        navigate(`/admin/termek/edit/${response.data.terem.id}`);
                    }
                } else {
                    setError(response.data.errorMessage);
                }
            } else {
                setError("Váratlan hiba történt");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Hiba történt a mentés során");
        } finally {
            setIsSaving(false);
        }
    };

    const renderSeatGrid = () => {
        if (!terem.sorok || !terem.oszlopok) return null;

        const rows = parseInt(terem.sorok) || 0;
        const cols = parseInt(terem.oszlopok) || 0;
        const gridWidth = cols * 45;

        return (
            <div className="mt-4 d-flex flex-column align-items-center">
                <h4>Székek elrendezése</h4>
                <div className="seat-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, minmax(30px, 40px))`,
                    gap: '5px',
                    marginTop: '10px',
                    width: '100%',
                    overflowX: 'auto',
                    paddingBottom: '10px'
                }}>
                    {Array.from({ length: rows * cols }).map((_, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const seat = szekek.find(s => s.x === row && s.y === col);
                        const isAvailable = seat?.allapot !== 0;

                        return (
                            <div
                                key={`seat-${row}-${col}`}
                                onClick={() => handleSeatClick(row, col)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: isAvailable
                                        ? '#28a745' 
                                        : '#dc3545', 
                                    border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`,
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                                title={`Sor: ${row + 1}, Oszlop: ${col + 1}\nÁllapot: ${isAvailable ? 'Elérhető' : 'Nem elérhető'}`}
                            >
                                <small className="text-light">
                                    {row + 1}-{col + 1}
                                </small>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-3 d-flex gap-3">
                    <div className="d-flex align-items-center">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#28a745',
                            marginRight: '5px',
                            border: `1px solid ${darkMode ? '#495057' : '#dee2e6'}`
                        }}></div>
                        <small>Elérhető</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#dc3545',
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
                <h1 className="h2">{id && id !== 'add' ? 'Terem szerkesztése' : 'Új terem hozzáadása'}</h1>
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
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="nev" className="form-label">Név</label>
                            <input
                                type="text"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="nev"
                                name="nev"
                                value={terem.nev}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="sorok" className="form-label">Sorok száma</label>
                            <input
                                type="number"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="sorok"
                                name="sorok"
                                value={terem.sorok}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="oszlopok" className="form-label">Oszlopok száma</label>
                            <input
                                type="number"
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="oszlopok"
                                name="oszlopok"
                                value={terem.oszlopok}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={`mb-3 ${darkMode ? 'text-light' : ''}`}>
                            <label htmlFor="megjegyzes" className="form-label">Megjegyzés</label>
                            <textarea
                                className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                id="megjegyzes"
                                name="megjegyzes"
                                value={terem.megjegyzes}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            {renderSeatGrid()}
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
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
                        onClick={() => navigate('/admin/termek')}
                        disabled={isSaving}

                    >
                        Mégse
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}

export default TeremEditAdmin;