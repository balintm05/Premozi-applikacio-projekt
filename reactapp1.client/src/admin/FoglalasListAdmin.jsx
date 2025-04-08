import { useState, useEffect, useContext, useMemo, Fragment } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function FoglalasListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);

    const [filter, setFilter] = useState({
        id: "",
        UserID: "",
        VetitesID: ""
    });

    const [foglalasok, setFoglalasok] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    document.title = "Foglalások listája - Premozi";
    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const filteredFoglalasok = useMemo(() => {
        return foglalasok.filter(foglalas => {
            const vetitesId = foglalas.foglaltSzekek[0]?.vetitesid || '';
            return (
                foglalas.id.toString().includes(filter.id) &&
                foglalas.userID.toString().includes(filter.UserID) &&
                vetitesId.toString().includes(filter.VetitesID)
            );
        });
    }, [foglalasok, filter]);

    const calculateTotalPrice = (foglalas) => {
        if (!foglalas.foglaltSzekek || foglalas.foglaltSzekek.length === 0) return 0;
        return foglalas.foglaltSzekek.reduce((total, szek) => {
            return total + (szek.jegyTipus?.ar || 0);
        }, 0);
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt a foglalást?")) {
            try {
                setError(null);
                await api.delete(`/Foglalas/delete/${id}`);
                setFoglalasok(foglalasok.filter(f => f.id !== id));
            } catch (err) {
                setError(err.response?.data?.errorMessage || "Hiba a foglalás törlésekor");
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            try {
                const response = await api.get('/Foglalas/get', {
                    signal: controller.signal,
                    withCredentials: true
                });
                setFoglalasok(response.data.map(item => item.foglalasAdatok));
                setLoading(false);
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    setError(err.response?.data?.errorMessage || "Hiba a foglalások betöltésekor");
                    setLoading(false);
                }
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
                <h1 className="h2">Foglalások kezelése</h1>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`} style={{ minWidth: '768px' }}>
                    <thead>
                        <tr className={darkMode ? 'bg-dark text-light' : 'bg-light'}>
                            <th>ID</th>
                            <th>Felhasználó ID</th>
                            <th>Vetítés ID</th>
                            <th>Dátum</th>
                            <th>Összeg</th>
                            <th></th>
                        </tr>
                        <tr className={darkMode ? 'bg-secondary' : 'bg-light'}>
                            {Object.keys(filter).map(key => (
                                <th key={key}>
                                    <input
                                        type="text"
                                        name={key}
                                        value={filter[key]}
                                        onChange={handleFilterChange}
                                        className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    />
                                </th>
                            ))}
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFoglalasok.length > 0 ? (
                            filteredFoglalasok.map(foglalas => {
                                const vetitesId = foglalas.foglaltSzekek[0]?.vetitesid || 'N/A';
                                const vetitesData = foglalas.foglaltSzekek[0]?.vetitesSzekek?.vetites || {};
                                const filmCim = vetitesData.film?.cim || 'Nincs film';
                                const teremNev = vetitesData.terem?.nev || 'Nincs terem';
                                const totalPrice = calculateTotalPrice(foglalas);

                                return (
                                    <Fragment key={`foglalas-${foglalas.id}`}>
                                        <tr
                                            className={`cursor-pointer ${darkMode ? 'table-dark' : ''} ${expandedRows[foglalas.id] ? (darkMode ? 'bg-gray-800' : 'bg-light') : ''}`}
                                            onClick={() => toggleRow(foglalas.id)}
                                        >
                                            <td>{foglalas.id}</td>
                                            <td>{foglalas.userID}</td>
                                            <td>{vetitesId}</td>
                                            <td>{new Date(foglalas.foglalasIdopontja).toLocaleString()}</td>
                                            <td>{totalPrice} Ft</td>
                                            <td className="text-center">
                                                {expandedRows[foglalas.id] ?
                                                    <FaChevronUp className={darkMode ? 'text-light' : 'text-dark'} /> :
                                                    <FaChevronDown className={darkMode ? 'text-light' : 'text-dark'} />
                                                }
                                            </td>
                                        </tr>
                                        {expandedRows[foglalas.id] && (
                                            <tr className={darkMode ? 'bg-gray-800' : ''}>
                                                <td colSpan={6} className="p-0 border-0">
                                                    <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-light'}`}>
                                                        <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                                            <table className={`table table-bordered mb-0 ${darkMode ? 'table-dark' : ''}`} style={{ minWidth: '600px' }}>
                                                            <tbody>
                                                                <tr>
                                                                    <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Foglalt székek</th>
                                                                    <td>
                                                                        {foglalas.foglaltSzekek.length > 0 ?
                                                                            foglalas.foglaltSzekek.map(szek =>
                                                                                `${szek.x + 1}-${szek.y + 1} (${szek.jegyTipus?.nev || 'Ismeretlen'} - ${szek.jegyTipus?.ar || 0} Ft)`
                                                                            ).join(', ') :
                                                                            'Nincsenek foglalt székek'}
                                                                    </td>
                                                                    <th className={`w-25 ${darkMode ? 'bg-gray-700' : 'bg-light'}`}>Vetítés</th>
                                                                    <td>{filmCim} - {teremNev}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Felhasználó</th>
                                                                    <td>{foglalas.user?.email || `ID: ${foglalas.userID}`}</td>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Összesen</th>
                                                                    <td>{totalPrice} Ft</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className={darkMode ? 'bg-gray-700' : 'bg-light'}>Műveletek</th>
                                                                    <td colSpan={3}>
                                                                            <button
                                                                                className={`btn btn-sm btn-danger`}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDelete(foglalas.id);
                                                                                }}
                                                                                style={{ padding: '0.5rem 1rem' }}
                                                                                disabled={new Date(vetitesData.idopont) < new Date()}
                                                                            >
                                                                                Törlés
                                                                            </button>
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
                                );
                            })
                        ) : (
                            <tr className={darkMode ? 'table-dark' : ''}>
                                <td colSpan={6} className="text-center py-4">
                                    {foglalasok.length === 0 ? "Nincsenek foglalások" : "Nincs találat"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default FoglalasListAdmin;