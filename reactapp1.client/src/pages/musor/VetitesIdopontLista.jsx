import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api/axiosConfig';
import { ThemeContext } from '../../layout/Layout';
import ThemeWrapper from '../../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';

function VetitesIdopontLista() {
    const { darkMode } = useContext(ThemeContext);
    const [vetitesek, setVetitesek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dates, setDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVetitesek = async () => {
            try {
                const response = await api.get('/Vetites/get');
                if (response.data) {
                    const formattedData = response.data.map(v => ({
                        id: v.vetites.id,
                        filmCim: v.vetites.film.cim,
                        filmId: v.vetites.film.id,
                        kezdes: new Date(v.vetites.idopont).toLocaleTimeString('hu-HU', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }),
                        datum: v.vetites.idopont,
                        nyelv: v.vetites.film.szinkron || v.vetites.film.eredetiNyelv,
                        idotartam: v.vetites.film.jatekido,
                        korhatar: v.vetites.film.korhatar,
                        terem: v.vetites.terem.nev,
                        trailerLink: v.vetites.film.trailerLink,
                        ageImage: v.vetites.film.images ?
                            `https://localhost:7153/images/${v.vetites.film.korhatar}.png` : null
                    }));

                    setVetitesek(formattedData);
                    const uniqueDates = [...new Set(
                        formattedData.map(v => new Date(v.datum).toLocaleDateString('hu-HU', {
                            month: '2-digit',
                            day: '2-digit'
                        })))
          ];

                    setDates(uniqueDates);
                    if (uniqueDates.length > 0) {
                        setSelectedDate(uniqueDates[0]);
                    }
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchVetitesek();
    }, []);

    const filteredVetitesek = vetitesek.filter(v => {
        const vetitesDate = new Date(v.datum).toLocaleDateString('hu-HU', {
            month: '2-digit',
            day: '2-digit'
        });
        return vetitesDate === selectedDate;
    });

    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 12; hour <= 22; hour++) {
            slots.push(`${hour}:00`);
        }
        return slots;
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const handleTrailerClick = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    if (loading) {
        return (
            <ThemeWrapper className="main-content p-4 text-center">
                <div className="spinner"></div>
            </ThemeWrapper>
        );
    }

    if (error) {
        return (
            <ThemeWrapper className="main-content p-4">
                <div className="alert alert-danger">Hiba történt az adatok betöltése közben: {error}</div>
            </ThemeWrapper>
        );
    }

    return (
        <ThemeWrapper className="main-content p-4">
            <div className="vetites-container">
                <h2 className="mb-4">Vetítések időpontjai</h2>
                <ul className="nav nav-tabs mb-4">
                    {dates.map((date, index) => (
                        <li key={index} className="nav-item">
                            <button
                                className={`nav-link ${selectedDate === date ? 'active' : ''}`}
                                onClick={() => setSelectedDate(date)}
                                style={{
                                    backgroundColor: selectedDate === date ?
                                        (darkMode ? 'var(--active-link)' : 'rgba(10, 88, 202, 0.1)') : 'transparent',
                                    color: darkMode ? 'var(--text-color)' : 'var(--text-color)'
                                }}
                            >
                                {date}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="d-block d-md-none">
                    {filteredVetitesek.length > 0 ? (
                        filteredVetitesek.map((vetites, index) => (
                            <div
                                key={index}
                                className="card mb-3"
                                style={{
                                    backgroundColor: darkMode ? 'var(--dropdown-bg)' : 'var(--content-bg)',
                                    borderColor: darkMode ? 'var(--border-color)' : 'var(--border-color)'
                                }}
                            >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        {//!!!%!!%!% 
                                        }
                                        <a className="btn btn-link card-title mb-0" onClick={(e) => { e.preventDefault(); navigate(`/film/${vetites.filmId}`); }}>{vetites.filmCim}</a>
                                        {vetites.ageImage && (
                                            <img
                                                src={vetites.ageImage}
                                                alt={`Korhatár ${vetites.korhatar}`}
                                                style={{ height: '24px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center mt-2">
                                        <span className="me-2">{vetites.nyelv}</span>
                                        <span className="me-2">{vetites.idotartam} perc</span>
                                        <span className="me-2">{vetites.terem}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="start-times">
                                            <button
                                                className="btn btn-outline-primary me-2 mb-2"
                                                style={{
                                                    color: darkMode ? 'var(--link-color)' : 'var(--link-color)',
                                                    borderColor: darkMode ? 'var(--link-color)' : 'var(--link-color)'
                                                }}
                                            >
                                                {vetites.kezdes}
                                            </button>
                                        </div>
                                        {vetites.trailerLink && (
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => handleTrailerClick(vetites.trailerLink)}
                                                style={{ color: darkMode ? 'var(--link-color)' : 'var(--link-color)' }}
                                            >
                                                <i className="bi bi-play-circle-fill" style={{ fontSize: '1.5rem' }}></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nincsenek vetítések erre a napra.</p>
                    )}
                </div>
                <div className="d-none d-md-block">
                    {filteredVetitesek.length > 0 ? (
                        <div className="table-responsive">
                            <table
                                className="table table-hover"
                                style={{
                                    backgroundColor: darkMode ? 'var(--dropdown-bg)' : 'var(--content-bg)',
                                    color: darkMode ? 'var(--text-color)' : 'var(--text-color)'
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Film</th>
                                        <th>Korhatár</th>
                                        <th>Nyelv</th>
                                        <th>Időtartam</th>
                                        <th>Terem</th>
                                        {getTimeSlots().map((time, index) => (
                                            <th key={index} className="text-center">{time}</th>
                                        ))}
                                        <th>Trailer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVetitesek.map((vetites, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor: index % 2 === 0 ?
                                                    (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
                                            }}
                                        >
                                            <td>{vetites.filmCim}</td>
                                            <td>
                                                {vetites.ageImage && (
                                                    <img
                                                        src={vetites.ageImage}
                                                        alt={`Korhatár ${vetites.korhatar}`}
                                                        style={{ height: '24px' }}
                                                    />
                                                )}
                                            </td>
                                            <td className="text-center">{vetites.nyelv}</td>
                                            <td className="text-center">{vetites.idotartam} perc</td>
                                            <td className="text-center">{vetites.terem}</td>
                                            {getTimeSlots().map((time, timeIndex) => (
                                                <td key={timeIndex} className="text-center">
                                                    {formatTime(vetites.kezdes) === time ? (
                                                        <a
                                                            className="btn btn-link p-0"
                                                            style={{
                                                                color: darkMode ? 'var(--link-color)' : 'var(--link-color)'
                                                            }}
                                                            onClick={(e) => { e.preventDefault(); navigate(`/foglalas/${vetites.id}`) }}
                                                        >
                                                            {time}
                                                        </a>
                                                    ) : null}
                                                </td>
                                            ))}
                                            <td className="text-center">
                                                {vetites.trailerLink && (
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() => handleTrailerClick(vetites.trailerLink)}
                                                        style={{ color: darkMode ? 'var(--link-color)' : 'var(--link-color)' }}
                                                    >
                                                        <i className="bi bi-play-circle-fill"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Nincsenek vetítések erre a napra.</p>
                    )}
                </div>
            </div>
            <style>
                {`.age-limit {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                }
                .vetites-container {
  max-width: 1200px;
  margin: 0 auto;
}

.nav-tabs {
  border-bottom: 1px solid var(--border-color);
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-bottom: none;
  margin-bottom: -1px;
}

.nav-tabs .nav-link.active {
  border-color: var(--border-color);
  border-bottom-color: var(--content-bg);
}
                `}
            </style>
        </ThemeWrapper>
        
    );
}

export default VetitesIdopontLista;