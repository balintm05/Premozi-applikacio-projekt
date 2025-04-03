import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./FilmAdatok.css";

const FilmAdatok = () => {
    const { id } = useParams();
    const { api } = useContext(AuthContext);
    const [film, setFilm] = useState(null);
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                const filmResponse = await api.get(`/Film/get/${id}`);
                if (!filmResponse.data) {
                    throw new Error('Film not found');
                }
                const screeningsResponse = await api.get('/Vetites/get');
                const filmScreenings = screeningsResponse.data
                    .filter(item => item.Vetites?.Filmid === parseInt(id))
                    .map(item => item.Vetites);

                setFilm(filmResponse.data);
                setScreenings(filmScreenings);
            } catch (err) {
                setError(err.response?.data?.Error?.errorMessage || 'Hiba történt az adatok betöltése közben');
                console.error('Error fetching film data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilmData();
    }, [id, api]);

    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    };

    const filteredScreenings = screenings.filter(screening => {
        return new Date(screening.Idopont).toISOString().split('T')[0] === selectedDate;
    });

    if (loading) return (
        <ThemeWrapper className="betoltes">
            Betöltés...
        </ThemeWrapper>
    );

    if (error) return (
        <ThemeWrapper className="hiba">
            {error}
        </ThemeWrapper>
    );

    if (!film) return (
        <ThemeWrapper className="hiba">
            Nem található film
        </ThemeWrapper>
    );

    const imageUrl = film.ImageID
        ? `https://localhost:7153/api/Image/get/${film.ImageID}`
        : '/placeholder-image.jpg';

    return (
        <ThemeWrapper className="film-container">
            <div className="film-fejlec">
                <h1>{film.Cim} ({film.Korhatar})</h1>
                <div className="film-poster">
                    <img
                        src={imageUrl}
                        alt={`${film.Cim} poszter`}
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                        }}
                    />
                </div>
                <div className="film-info">
                    <h2>További információ:</h2>
                    <div className="info-sor">
                        <p>Mûfaj: <span>{film.Mufaj}</span></p>
                        <p>Kategória: <span>{film.Kategoria}</span></p>
                    </div>
                    <div className="info-sor">
                        <p>Játékidõ: <span>{film.Jatekido} perc</span></p>
                        <p>IMDB értékelés: <span>{film.IMDB}</span></p>
                    </div>
                    <p className="film-leiras">{film.Leiras}</p>

                    <div className="film-details">
                        <p><strong>Eredeti cím:</strong> {film.EredetiCim}</p>
                        <p><strong>Szereplõk:</strong> {film.Szereplok}</p>
                        <p><strong>Rendezõ:</strong> {film.Rendezo}</p>
                        <p><strong>Gyártó:</strong> {film.Gyarto}</p>
                        <p><strong>Eredeti nyelv:</strong> {film.EredetiNyelv}</p>
                        <p><strong>Szinkron:</strong> {film.Szinkron}</p>
                    </div>

                    {film.TrailerLink && (
                        <div className="trailer-container">
                            <a
                                href={film.TrailerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="trailer-link"
                            >
                                Trailer megtekintése
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="vetitesek">
                <h2>Vetítések</h2>
                <div className="datum-valaszto">
                    <label htmlFor="vetites-datum">Dátum:</label>
                    <input
                        type="date"
                        id="vetites-datum"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {filteredScreenings.length > 0 ? (
                    <div className="vetites-lista">
                        {filteredScreenings.map((screening) => (
                            <div key={screening.id} className="vetites-elem">
                                <div className="vetites-idopont">
                                    {formatTime(screening.Idopont)}
                                </div>
                                <div className="vetites-terem">
                                    {screening.Terem?.Nev || 'Ismeretlen terem'}
                                </div>
                                <div className="vetites-nyelv">
                                    {film.Szinkron === 'dubbed' ? 'Szinkronizált' : 'Eredeti nyelven'}
                                </div>
                                <a
                                    href={`/jegyvasarlas/${screening.id}`}
                                    className="jegyvasarlas"
                                >
                                    Jegyvásárlás
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nincsenek vetítések a kiválasztott napon.</p>
                )}
            </div>
        </ThemeWrapper>
    );
};

export default FilmAdatok;