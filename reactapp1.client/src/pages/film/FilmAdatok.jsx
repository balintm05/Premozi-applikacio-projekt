import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./FilmAdatok.css";
import YouTubeModal from '../../components/videos/YoutubeModal';

const FilmAdatok = () => {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');

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

    const groupScreeningsByDate = (screenings) => {
        const grouped = {};
        screenings.forEach(screening => {
            const dateKey = new Date(screening.idopont).toISOString().split('T')[0];
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(screening);
        });
        return grouped;
    };

    const upcomingScreenings = film?.vetitesek?.filter(screening =>
        new Date(screening.idopont) >= new Date()
    ).sort((a, b) => new Date(a.idopont) - new Date(b.idopont)) || [];

    const filteredScreenings = selectedDate
        ? upcomingScreenings.filter(screening =>
            new Date(screening.idopont).toISOString().split('T')[0] === selectedDate
        )
        : upcomingScreenings;

    const groupedScreenings = groupScreeningsByDate(filteredScreenings);

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
                <div className="film-header" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1>{film.cim}</h1>
                    <img
                        src={`https://localhost:7153/images/(${film.korhatar}).png`}
                        alt={`Korhatár: ${film.Korhatar}`}
                        style={{ height: '40px' }}
                    />
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
                                <YouTubeModal youtubeUrl={film.trailerLink}>
                                    <button className="trailer-button">
                                        Trailer megtekintése
                                    </button>
                                </YouTubeModal>
                            </div>
                        )}
                    </div>
                    <div className="info-column">
                        <ThemeWrapper className="basic-info">
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
                                    <span className="info-label">Szinkron:</span>
                                    <span className="info-value">{film.szinkron}</span>
                                </div>
                            </div>
                        </ThemeWrapper>

                        <ThemeWrapper className="film-description" noBg>
                            <h3>Leírás</h3>
                            <p>{film.leiras || 'Nincs elérhető leírás.'}</p>
                        </ThemeWrapper>

                        <ThemeWrapper className="detailed-info">
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Eredeti nyelv:</span>
                                    <span className="info-value">{film.eredetiNyelv || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Eredeti cím:</span>
                                    <span className="info-value">{film.eredetiCim || film.cim}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Gyártó:</span>
                                    <span className="info-value">{film.gyarto || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Rendező:</span>
                                    <span className="info-value">{film.rendezo || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Szereplők:</span>
                                    <span className="info-value">{film.szereplok || 'Nincs információ'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">IMDB:</span>
                                    <span className="info-value">{film.imdb || 'Nincs információ'}</span>
                                </div>
                            </div>
                        </ThemeWrapper>
                    </div>
                </div>
                <ThemeWrapper className="screenings-section">
                    <h2>Vetítések</h2>

                    <div className="date-selector-container">
                        <div className="date-picker-wrapper">
                            <label htmlFor="screening-date" className="date-picker-label">
                                <i className="bi bi-calendar3 me-2"></i>
                                Válasszon dátumot:
                            </label>
                            <div className="date-input-container">
                                <input
                                    type="date"
                                    id="screening-date"
                                    className="date-picker-input"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <i className="bi bi-chevron-down date-picker-icon"></i>
                            </div>
                            {selectedDate && (
                                <button
                                    className="clear-date-button"
                                    onClick={() => setSelectedDate('')}
                                >
                                    Összes dátum
                                </button>
                            )}
                        </div>
                    </div>
                    <br></br>
                    {Object.keys(groupedScreenings).length > 0 ? (
                        <div className="screenings-list">
                            {Object.entries(groupedScreenings).map(([date, screenings]) => (
                                <div key={date} className="date-group">
                                    <h3 className="screening-date-header">{formatDate(date)}</h3>
                                    {screenings.map((screening) => (
                                        <ThemeWrapper key={screening.id} className="screening-item mt-1 mb-2" noBg>
                                            <div className="screening-time">{formatTime(screening.idopont)}</div>
                                            <div className="screening-room">
                                                {screening.terem?.nev || 'Ismeretlen terem'}
                                            </div>
                                            <div className="screening-language">
                                                Szinkron: {film.szinkron}
                                            </div>
                                            <div className="screening-category">Típus: {film.kategoria}</div>
                                            <a
                                                href={`/musor/foglalas/${screening.id}`}
                                                className="booking-button"
                                            >
                                                Jegyfoglalás
                                            </a>
                                        </ThemeWrapper>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-screenings">
                            {selectedDate
                                ? "Nincsenek vetítések a kiválasztott napon."
                                : "Jelenleg nincsenek tervezett vetítések."}
                        </div>
                    )}
                </ThemeWrapper>
            </div>
        </ThemeWrapper>
    );
};

export default FilmAdatok;