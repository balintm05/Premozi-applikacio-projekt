import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./Musor.css";

const Musor = () => {
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/Film/get');
                if (response.data?.errorMessage) {
                    setError(response.data.errorMessage);
                } else {
                    setFilms(response.data);
                }
            } catch (err) {
                setError(err.message || "Hiba történt az adatok betöltése közben");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api]);

    const getFilmsWithScreeningsInNextWeek = () => {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 30);

        const filteredFilms = films.filter(film => {
            if (!film.vetitesek || film.vetitesek.length === 0) return false;
            return film.vetitesek.some(screening => {
                const screeningDate = new Date(screening.idopont);
                return screeningDate >= now && screeningDate <= nextWeek;
            });
        });
        return filteredFilms.sort((a, b) => {
            const aCount = a.vetitesek ? a.vetitesek.filter(screening => {
                const screeningDate = new Date(screening.idopont);
                return screeningDate >= now && screeningDate <= nextWeek;
            }).length : 0;

            const bCount = b.vetitesek ? b.vetitesek.filter(screening => {
                const screeningDate = new Date(screening.idopont);
                return screeningDate >= now && screeningDate <= nextWeek;
            }).length : 0;

            return bCount - aCount;
        });
    };

    const handleFilmClick = (filmId) => {
        navigate(`/film/${filmId}`);
    };

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
        </ThemeWrapper>
    );

    const filmsToShow = getFilmsWithScreeningsInNextWeek();

    if (filmsToShow.length === 0) return (
        <ThemeWrapper className="nincs-musor">
            <div className="alert alert-info">
                Nincsenek vetítések a következő 30 napban.
            </div>
        </ThemeWrapper>
    );
    return (
        <ThemeWrapper>
            <div className="container musor-container">
                <h1 className="text-center mb-4">Műsorajánló</h1>
                <br></br>
                <div className="row">
                    {filmsToShow.map(film => {
                        const imageUrl = film.images?.relativePath
                            ? `https://localhost:7153${film.images.relativePath}`
                            : '/placeholder-image.jpg';

                        return (
                            <div
                                key={film.id}
                                className="col-md-6 col-lg-4 mb-4"
                            >
                                <div className="film-card" onClick={() => handleFilmClick(film.id)}>
                                    <div
                                        className="film-card-image"
                                        style={{
                                            backgroundImage: `url(${imageUrl})`
                                        }}
                                    >
                                        <div className="film-card-overlay">
                                            <div className="film-card-content">
                                                <div className="film-card-header">
                                                    <div className="film-title-container">
                                                        <div className="film-title">{film.cim}</div>
                                                        {film.korhatar && (
                                                            <img
                                                                alt="korhatár besorolás"
                                                                className="age-rating-musor"
                                                                src={`${window.location.protocol}//${window.location.hostname}:7153/images/${film.korhatar}.png`}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="film-genre">{film.mufaj} | {film.jatekido} perc</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default Musor;