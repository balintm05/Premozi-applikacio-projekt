import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./Foglalas.css";

const SEAT_STATUS = {
    UNAVAILABLE: 0,
    AVAILABLE: 1,
    RESERVED: 2
};

const Foglalas = () => {
    const { id: vetitesId } = useParams();
    const { api, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vetites, setVetites] = useState(null);
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [seatLayout, setSeatLayout] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [seatTicketTypes, setSeatTicketTypes] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [columns, setColumns] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vetitesResponse = await api.get(`/Vetites/get/${vetitesId}`);
                if (vetitesResponse.data?.Error) {
                    setError(vetitesResponse.data.Error);
                } else if (vetitesResponse.data) {
                    const screeningData = vetitesResponse.data.vetites || vetitesResponse.data;
                    setVetites(screeningData);

                    if (screeningData.filmid) {
                        const filmResponse = await api.get(`/Film/get/${screeningData.filmid}`);
                        if (filmResponse.data) {
                            setFilm(filmResponse.data);
                        }
                    }

                    if (screeningData.vetitesSzekek) {
                        const rows = Math.max(...screeningData.vetitesSzekek.map(s => s.x)) + 1;
                        const cols = Math.max(...screeningData.vetitesSzekek.map(s => s.y)) + 1;
                        setColumns(cols);

                        const layout = Array(rows).fill().map(() => Array(cols).fill(SEAT_STATUS.UNAVAILABLE));

                        screeningData.vetitesSzekek.forEach(seat => {
                            if (seat.x >= 0 && seat.x < rows && seat.y >= 0 && seat.y < cols) {
                                layout[seat.x][seat.y] = seat.foglalasAllapot;
                            }
                        });

                        setSeatLayout(layout);
                    }
                } else {
                    setError("Vetítés nem található");
                }

                const jegyTipusResponse = await api.get('/Foglalas/getJegyTipus');
                if (jegyTipusResponse.data) {
                    setTicketTypes(jegyTipusResponse.data);
                }
            } catch (err) {
                setError(err.response?.data?.error || "Hiba történt az adatok betöltése közben");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vetitesId, api]);

    useEffect(() => {
        const calculateTotalPrice = () => {
            return selectedSeats.reduce((total, seatKey) => {
                const typeId = seatTicketTypes[seatKey];
                const type = ticketTypes.find(t => t.id === typeId);
                return total + (type?.ar || 0);
            }, 0);
        };
        setTotalPrice(calculateTotalPrice());
    }, [selectedSeats, seatTicketTypes, ticketTypes]);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSeatClick = (row, col) => {
        if (row < 0 || row >= seatLayout.length || col < 0 || col >= seatLayout[0]?.length) return;
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
    };

    const handleSeatItemClick = (seatKey, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === seatKey ? null : seatKey);
    };

    const handleTicketTypeChange = (seatKey, typeId) => {
        setSeatTicketTypes(prev => ({
            ...prev,
            [seatKey]: typeId
        }));
        setActiveDropdown(null);
    };

    const handleReservation = async () => {
        if (!user) {
            setError("A foglaláshoz be kell jelentkeznie");
            navigate('/bejelentkezes');
            return;
        }

        if (selectedSeats.length === 0) {
            setError("Válasszon legalább egy ülőhelyet");
            return;
        }

        try {
            const seatCoords = selectedSeats.map(seatKey => {
                const [x, y] = seatKey.split('-').map(Number);
                return { x, y };
            });

            const request = {
                VetitesID: vetitesId,
                UserID: user?.userID?.toString() || "0",
                X: seatCoords.map(coord => coord.x.toString()),
                Y: seatCoords.map(coord => coord.y.toString()),
                jegytipusId: selectedSeats.map(seatKey => seatTicketTypes[seatKey].toString())
            };

            const response = await api.post('/Foglalas/add', request);
            if (response.data?.errorMessage === "Sikeres hozzáadás") {
                navigate(`/foglalas-siker/${response.data.id}`);
            } else {
                setError(response.data?.errorMessage || "Hiba történt a foglalás során");
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hiba történt a foglalás során");
            console.error("Reservation error:", err);
        }
    };

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Nincs információ';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    };

    if (loading) return (
        <ThemeWrapper className="betoltes">
            Betöltés...
        </ThemeWrapper>
    );

    if (error) return (
        <ThemeWrapper className="hiba">
            <div className="alert alert-danger mb-4">
                {error}
            </div>
        </ThemeWrapper>
    );

    if (!vetites) return (
        <ThemeWrapper className="hiba">
            Nem található vetítés
        </ThemeWrapper>
    );

    return (
        <ThemeWrapper>
            <div className="foglalas-container">
                <h1>Foglalás: {film?.cim || 'Ismeretlen film'}</h1>

                <div className="foglalas-header">
                    <div className="vetites-info">
                        <p><strong>Időpont:</strong> {formatDate(vetites.idopont)} {formatTime(vetites.idopont)}</p>
                        <p><strong>Terem:</strong> {vetites.terem?.nev || 'Ismeretlen terem'}</p>
                        {seatLayout && <p><strong>Ülőhelyek:</strong> {seatLayout.length} sor × {seatLayout[0]?.length || 0} szék</p>}
                    </div>
                </div>

                <div className="foglalas-content">
                    <div className="seat-selection">
                        <h2>Ülőhelyek kiválasztása</h2>

                        <div className="screen-and-grid-container">
                            <div
                                className="screen-indicator"
                                style={{
                                    width: `${columns * 35}px`,
                                    maxWidth: '100%'
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

                        <div className="ticket-selection">
                            <h2>Jegytípusok</h2>

                            <div className="selected-seats-info">
                                <h3>Kiválasztott helyek:</h3>
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
                        </div>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default Foglalas;