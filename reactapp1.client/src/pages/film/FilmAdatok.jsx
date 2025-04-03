import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./FilmAdatok.css";

const FilmAdatok = () => {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/Film/get/${id}`);
                if (response.data?.errorMessage) {
                    setError(response.data.errorMessage);
                }
                else if (response.data) {
                    setFilm(response.data);
                }
                else {
                    setError("Film not found");
                }
            } catch (err) {
                if (err.response?.data?.errorMessage) {
                    setError(err.response.data.errorMessage);
                }
                else {
                    setError(err.message || "Hiba történt az adatok betöltése közben");
                }
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, api]);

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Nincs információ';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    };

    const filteredScreenings = film?.vetitesek?.filter(screening => {
        const screeningDate = new Date(screening.idopont).toISOString().split('T')[0];
        return screeningDate === selectedDate && new Date(screening.idopont) >= new Date();
    }).sort((a, b) => new Date(a.idopont) - new Date(b.idopont)) || [];

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

    if (!film) return (
        <ThemeWrapper className="hiba">
            Nem található film
        </ThemeWrapper>
    );

    const imageUrl = film.images?.relativePath
        ? `https://localhost:7153${film.images.relativePath}`
        : '/placeholder-image.jpg';

    return (
        <ThemeWrapper>
            <div className="film-container">
                <div className="film-header">
                    <h1>{film.cim} <span className="age-rating">{film.korhatar}</span></h1>
                </div>
                <div className="film-content">
                    <div className="poster-column">
                        <div className="film-poster">
                            <img
                                src={imageUrl}
                                alt={`${film.cim} poszter`}
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                        </div>
                        {film.trailerLink && (
                            <div className="trailer-container">
                                <a
                                    href={film.trailerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="trailer-button"
                                >
                                    Trailer megtekintése
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="info-column">
                        <ThemeWrapper className="basic-info" noBg>
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Műfaj:</span>
                                    <span className="info-value">{film.mufaj || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Kategória:</span>
                                    <span className="info-value">{film.kategoria || 'Nincs információ'}</span>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-item">
                                    <span className="info-label">Játékidő:</span>
                                    <span className="info-value">{film.jatekido} perc</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">IMDB:</span>
                                    <span className="info-value">{film.imdb || 'Nincs információ'}</span>
                                </div>
                            </div>
                        </ThemeWrapper>

                        <ThemeWrapper className="film-description" noBg>
                            <h3>Leírás</h3>
                            <p>{film.leiras || 'Nincs elérhető leírás.'}</p>
                        </ThemeWrapper>

                        <ThemeWrapper className="detailed-info">
                            <h3>További információk</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Eredeti cím:</span>
                                    <span className="info-value">{film.eredetiCim || film.cim}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Szereplők:</span>
                                    <span className="info-value">{film.szereplok || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Rendező:</span>
                                    <span className="info-value">{film.rendezo || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Gyártó:</span>
                                    <span className="info-value">{film.gyarto || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Eredeti nyelv:</span>
                                    <span className="info-value">{film.eredetiNyelv || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Szinkron:</span>
                                    <span className="info-value">{film.szinkron}</span>
                                </div>
                            </div>
                        </ThemeWrapper>
                    </div>
                </div>
                <ThemeWrapper className="screenings-section" noBg>
                    <h2>Vetítések</h2>

                    <div className="date-selector">
                        <label htmlFor="screening-date">Dátum:</label>
                        <input
                            type="date"
                            id="screening-date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {filteredScreenings.length > 0 ? (
                        <div className="screenings-list">
                            {filteredScreenings.map((screening) => (
                                <ThemeWrapper key={screening.id} className="screening-item" noBg>
                                    <div className="screening-time">{formatTime(screening.idopont)}</div>
                                    <div className="screening-room">
                                        {screening.terem?.nev || 'Ismeretlen terem'}
                                    </div>
                                    <div className="screening-language">
                                        {film.szinkron === 'dubbed' ? 'Szinkronizált' : 'Eredeti nyelven'}
                                    </div>
                                    <a
                                        href={`/foglalas/${screening.id}`}
                                        className="booking-button"
                                    >
                                        Jegyvásárlás
                                    </a>
                                </ThemeWrapper>
                            ))}
                        </div>
                    ) : (
                        <div className="no-screenings">
                            Nincsenek vetítések a kiválasztott napon.
                        </div>
                    )}
                </ThemeWrapper>
            </div>
        </ThemeWrapper>
    );
};

export default FilmAdatok;