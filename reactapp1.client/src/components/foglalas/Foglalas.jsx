import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./Foglalas.css";

const SEAT_STATUS = {
    UNAVAILABLE: 0,
    AVAILABLE: 1,
    RESERVED: 2
};

const SeatButton = React.memo(({ row, col, status, isSelected, onClick }) => {
    const seatClass = `seat ${status === SEAT_STATUS.AVAILABLE ? 'available' :
        status === SEAT_STATUS.RESERVED ? 'reserved' : ''} 
                     ${isSelected ? 'selected' : ''}`;

    return (
        <button
            className={seatClass}
            onClick={() => onClick(row, col)}
            disabled={status !== SEAT_STATUS.AVAILABLE}
            aria-label={`${row + 1}. sor ${col + 1}. szék`}
        >
            {col + 1}
        </button>
    );
});

const Foglalas = () => {
    const { id: vetitesId } = useParams();
    const { api, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const componentMounted = useRef(true);

    const [vetites, setVetites] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seatLayout, setSeatLayout] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [seatTicketTypes, setSeatTicketTypes] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [columns, setColumns] = useState(0);

    useEffect(() => {
        document.title = "Foglalás - Premozi";
    }, []);

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((total, seatKey) => {
            const typeId = seatTicketTypes[seatKey];
            const type = ticketTypes.find(t => t.id === typeId);
            return total + (type?.ar || 0);
        }, 0);
    }, [selectedSeats, seatTicketTypes, ticketTypes]);

    useEffect(() => {
        componentMounted.current = true;
        const abortController = new AbortController();

        const fetchData = async () => {
            if (!vetitesId || typeof vetitesId !== 'string') {
                setError("Érvénytelen vetítés azonosító");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const [vetitesResponse, jegyTipusResponse] = await Promise.all([
                    api.get(`/Vetites/get/${vetitesId}`, { signal: abortController.signal }),
                    api.get('/Foglalas/getJegyTipus', { signal: abortController.signal })
                ]);

                if (!componentMounted.current) return;

                if (!vetitesResponse.data?.vetites) {
                    throw new Error(vetitesResponse.data?.error?.errorMessage || "Vetítés nem található");
                }

                const screeningData = vetitesResponse.data.vetites;
                setVetites(screeningData);

                if (!screeningData.vetitesSzekek?.length) {
                    setSeatLayout(null);
                    setError("Ehhez a vetítéshez nincsenek ülőhelyek konfigurálva");
                    return;
                }

                const validSeats = screeningData.vetitesSzekek.filter(seat =>
                    typeof seat.x === 'number' && typeof seat.y === 'number'
                );

                if (!validSeats.length) {
                    setSeatLayout(null);
                    setError("Érvénytelen ülőhely konfiguráció");
                    return;
                }

                const maxRow = Math.max(...validSeats.map(s => s.x), 0) + 1;
                const maxCol = Math.max(...validSeats.map(s => s.y), 0) + 1;

                if (maxRow <= 0 || maxCol <= 0 || maxRow > 100 || maxCol > 100) {
                    throw new Error("Érvénytelen ülőhely elrendezés");
                }

                setColumns(maxCol);

                const layout = Array(maxRow).fill().map(() => Array(maxCol).fill(SEAT_STATUS.UNAVAILABLE));
                validSeats.forEach(seat => {
                    if (seat.x >= 0 && seat.x < maxRow && seat.y >= 0 && seat.y < maxCol) {
                        layout[seat.x][seat.y] = seat.foglalasAllapot === 1 ? SEAT_STATUS.AVAILABLE :
                            seat.foglalasAllapot === 2 ? SEAT_STATUS.RESERVED :
                                SEAT_STATUS.UNAVAILABLE;
                    }
                });

                setSeatLayout(layout);

                if (jegyTipusResponse.data) {
                    setTicketTypes(jegyTipusResponse.data);
                }
            } catch (err) {
                if (err.name === 'CanceledError' || !componentMounted.current) return;
                setError(err.response?.data?.error?.errorMessage || "Hiba történt az adatok betöltése közben");
            } finally {
                if (componentMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            componentMounted.current = false;
            abortController.abort();
        };
    }, [vetitesId, api]);

    const handleSeatClick = useCallback((row, col) => {
        if (!seatLayout || row < 0 || row >= seatLayout.length || col < 0 || col >= seatLayout[0]?.length) return;
        if (seatLayout[row][col] !== SEAT_STATUS.AVAILABLE) return;

        const seatKey = `${row}-${col}`;
        setSelectedSeats(prev =>
            prev.includes(seatKey)
                ? prev.filter(s => s !== seatKey)
                : [...prev, seatKey]
        );

        if (!seatTicketTypes[seatKey] && ticketTypes.length > 0) {
            setSeatTicketTypes(prev => ({
                ...prev,
                [seatKey]: ticketTypes[0].id
            }));
        }
    }, [seatLayout, seatTicketTypes, ticketTypes]);

    const handleSeatItemClick = useCallback((seatKey, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === seatKey ? null : seatKey);
    }, [activeDropdown]);

    const handleTicketTypeChange = useCallback((seatKey, typeId) => {
        setSeatTicketTypes(prev => ({
            ...prev,
            [seatKey]: typeId
        }));
        setActiveDropdown(null);
    }, []);

    const handleReservation = async () => {
        if (!user) {
            setError("A foglaláshoz be kell jelentkeznie");
            navigate('/account/login');
            return;
        }

        if (selectedSeats.length === 0) {
            setError("Válasszon ki legalább egy ülőhelyet");
            return;
        }

        try {
            const seatCoords = selectedSeats.map(seatKey => {
                const [x, y] = seatKey.split('-').map(Number);
                return { x, y };
            });

            const response = await api.post('/Foglalas/add', {
                VetitesID: vetitesId,
                UserID: user?.userID?.toString() || "0",
                X: seatCoords.map(coord => coord.x.toString()),
                Y: seatCoords.map(coord => coord.y.toString()),
                jegytipusId: selectedSeats.map(seatKey => seatTicketTypes[seatKey].toString())
            });

            if (response.data?.errorMessage === "Sikeres hozzáadás") {
                navigate("/foglalas/success", {
                    replace: true,
                    state: { fromFoglalas: true }
                });
            } else {
                setError(response.data?.errorMessage || "Hiba történt a foglalás során");
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt a foglalás során");
        }
    };

    const formatTime = useCallback((dateTime) => {
        return new Date(dateTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'Nincs információ';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    if (loading) return (
        <ThemeWrapper className="betoltes">
            <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div className="spinner"></div>
            </div>
        </ThemeWrapper>
    );

    if (error) return (
        <ThemeWrapper className="hiba">
            <div className="alert alert-danger mb-4">
                {error}
            </div>
            {error.includes("ülőhely") && (
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Vissza a főoldalra
                </button>
            )}
        </ThemeWrapper>
    );

    if (!vetites) return (
        <ThemeWrapper className="hiba">
            Vetítés nem található
        </ThemeWrapper>
    );

    if (!seatLayout) return (
        <ThemeWrapper className="hiba">
            <div className="alert alert-danger mb-4">
                Nem megjeleníthető az ülőhely térkép - érvénytelen konfiguráció
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
                Vissza a főoldalra
            </button>
        </ThemeWrapper>
    );
    if (new Date(vetites.idopont) < new Date()) {
        return (
            <ThemeWrapper className="hiba">
                <div className="alert alert-danger mb-4">
                    Erre a vetítésre a foglalás már lezárult
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Vissza a főoldalra
                </button>
            </ThemeWrapper>);       
    }
    return (
        <ThemeWrapper>
            <div className="foglalas-container">
                <h1 className="mb-3">Foglalás: {vetites?.film?.cim || 'Ismeretlen film'}</h1>
                <div className="foglalas-header">
                    <div className="vetites-info">
                        <p><strong>Időpont:</strong> {formatDate(vetites.idopont)} {formatTime(vetites.idopont)}</p>
                        <p><strong>Terem:</strong> {vetites?.terem?.nev || 'Ismeretlen terem'}</p>
                        {seatLayout && <p><strong>Ülőhelyek:</strong> {seatLayout.length} sor × {seatLayout[0]?.length || 0} oszlop, {seatLayout.length * (seatLayout[0]?.length||0)} összesen</p>}
                    </div>
                </div>

                <div className="foglalas-content">
                    <div className="seat-selection">
                        <h2 className="mb-3">Székek kiválasztása</h2>

                        <div className="screen-and-grid-container">
                            <div
                                className="screen-indicator"
                                style={{
                                    width: `${columns * 35}px`,
                                    maxWidth: '100%',
                                    marginLeft: '35px'
                                }}
                            >
                                VÁSZON
                            </div>

                            <div className="seat-map-container">
                                <div className="seat-map">
                                    {seatLayout?.map((row, rowIndex) => (
                                        <div key={rowIndex} className="seat-row">
                                            <div className="row-number">{rowIndex + 1}</div>
                                            {row.map((seatStatus, colIndex) => {
                                                const seatKey = `${rowIndex}-${colIndex}`;
                                                const isSelected = selectedSeats.includes(seatKey);
                                                let seatClass = 'seat';
                                                if (seatStatus === SEAT_STATUS.AVAILABLE) seatClass += ' available';
                                                if (seatStatus === SEAT_STATUS.RESERVED) seatClass += ' reserved';
                                                if (isSelected) seatClass += ' selected';

                                                return (
                                                    <button
                                                        key={colIndex}
                                                        className={seatClass}
                                                        onClick={() => handleSeatClick(rowIndex, colIndex)}
                                                        disabled={seatStatus !== SEAT_STATUS.AVAILABLE}
                                                        aria-label={`${rowIndex + 1}. sor ${colIndex + 1}. szék - ${seatStatus === SEAT_STATUS.AVAILABLE ? 'szabad' :
                                                            seatStatus === SEAT_STATUS.RESERVED ? 'foglalt' : 'nem elérhető'
                                                            }`}
                                                    >
                                                        {colIndex + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="seat-legend d-flex flex-wrap gap-3 mb-3">
                            <div className="legend-item d-flex align-items-center">
                                <div className="legend-color me-2" style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '3px',
                                    border: '1px solid var(--border-color)'
                                }}></div>
                                <span>Szabad</span>
                            </div>
                            <div className="legend-item d-flex align-items-center">
                                <div className="legend-color me-2" style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#f44336',
                                    borderRadius: '3px',
                                    border: '1px solid var(--border-color)'
                                }}></div>
                                <span>Foglalt</span>
                            </div>
                            <div className="legend-item d-flex align-items-center">
                                <div className="legend-color me-2" style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#ccc',
                                    borderRadius: '3px',
                                    border: '1px solid var(--border-color)'
                                }}></div>
                                <span>Nem elérhető</span>
                            </div>
                            <div className="legend-item d-flex align-items-center">
                                <div className="legend-color me-2" style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#2196F3',
                                    borderRadius: '3px',
                                    border: '1px solid var(--border-color)'
                                }}></div>
                                <span>Kiválasztott</span>
                            </div>
                        </div>
                    </div>

                    <div className="ticket-selection">
                        <h2>Székek</h2>
                        <p className="mb-3">A helyekre kattintva választhat jegytípust</p>
                        <div className="selected-seats-info">
                            {selectedSeats.length > 0 ? (
                                <ul className="selected-seats-list">
                                    {selectedSeats.map(seatKey => {
                                        const [row, col] = seatKey.split('-').map(Number);
                                        const currentTypeId = seatTicketTypes[seatKey] || (ticketTypes[0]?.id || '');
                                        const currentType = ticketTypes.find(t => t.id === currentTypeId);

                                        return (
                                            <li
                                                key={seatKey}
                                                className={`selected-seat-item ${activeDropdown === seatKey ? 'active' : ''}`}
                                                onClick={(e) => handleSeatItemClick(seatKey, e)}
                                            >
                                                <div className="seat-info">
                                                    <span>{row + 1}. sor {col + 1}. szék</span>
                                                    <span className="ticket-type-badge">
                                                        {currentType?.nev} ({currentType?.ar} Ft)
                                                    </span>
                                                </div>
                                                {activeDropdown === seatKey && (
                                                    <div className="ticket-type-dropdown">
                                                        {ticketTypes.map(type => (
                                                            <div
                                                                key={type.id}
                                                                className={`dropdown-item ${currentTypeId === type.id ? 'active' : ''}`}
                                                                onClick={() => handleTicketTypeChange(seatKey, type.id)}
                                                            >
                                                                {type.nev} ({type.ar} Ft)
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>Nincs kiválasztott hely</p>
                            )}
                        </div>

                        <div className="total-price">
                            <h3>Összesen:</h3>
                            <span>{totalPrice} Ft</span>
                        </div>

                        <button
                            className="reserve-button"
                            onClick={handleReservation}
                            disabled={selectedSeats.length === 0}
                        >
                            Foglalás megerősítése
                        </button>
                        <p className="mt-3">Jelenleg csak a helyszínen való fizetés lehetséges, megértésüket köszönjük!</p>
                        <p className="mt-3">A diák jegyhez diákigazolvány, a nyugdíjas jegyhez pedig személyi igazolvány bemutatása szükséges a pénztárnál.</p>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default Foglalas;