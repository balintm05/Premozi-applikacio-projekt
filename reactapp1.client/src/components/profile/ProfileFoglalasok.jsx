import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThemeWrapper from '../../Layout/ThemeWrapper';
import './ProfilePage.css';
import '../foglalas/Foglalas.css';

function ProfileFoglalasok() {
    const { user, api } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user?.userID) return;

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/Foglalas/getByUser/${user.userID}`);
                if (response.data) {
                    const validReservations = response.data.filter(reservation =>
                        reservation.foglalasAdatok?.foglaltSzekek?.length > 0 &&
                        reservation.foglalasAdatok.foglaltSzekek[0]?.vetitesSzekek?.vetites
                    );
                    const sortedReservations = validReservations.sort((a, b) => {
                        const dateA = new Date(a.foglalasAdatok.foglalasIdopontja);
                        const dateB = new Date(b.foglalasAdatok.foglalasIdopontja);
                        return dateB - dateA; 
                    });

                    setReservations(sortedReservations);
                } else {
                    setError("Nem sikerült betölteni a foglalásokat");
                }
            } catch (err) {
                console.error("Error fetching reservations:", err);
                setError(err.response?.data?.errorMessage || "Hiba történt a foglalások betöltésekor");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user, api]);

    const handleDeleteReservation = async (reservationId) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a foglalást?")) return;

        try {
            const response = await api.delete(`/Foglalas/delete/${reservationId}`);
            if (response.data?.errorMessage === "Sikeres törlés") {
                setReservations(prev => prev.filter(r => r.foglalasAdatok.id !== reservationId));
            } else {
                setError(response.data?.errorMessage || "Hiba történt a törlés során");
            }
        } catch (err) {
            console.error("Error deleting reservation:", err);
            setError(err.response?.data?.errorMessage || "Hiba történt a foglalás törlésekor");
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (loading) return (
        <ThemeWrapper className="betoltes">
            <div className="profile-loading">
                <div className="spinner"></div>
            </div>
        </ThemeWrapper>
    );

    if (error) {
        return (
            <ThemeWrapper>
                <div className="profile-error">
                    <h2>Hiba történt</h2>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() =>navigate("/account/profile/foglalasok")}>
                        Újrapróbálkozás
                    </button>
                </div>
            </ThemeWrapper>
        );
    }

    if (reservations.length === 0) {
        return (
            <ThemeWrapper>
                <div className="profile-empty">
                    <h2>Nincsenek foglalások</h2>
                    <p>Még nem történt foglalás a fiókodhoz, vagy nincsenek érvényes foglalások.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/mozi')}
                    >
                        Moziprogram megtekintése
                    </button>
                </div>
            </ThemeWrapper>
        );
    }

    return (
        <ThemeWrapper noBg>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Foglalásaim</h1>
                </div>

                <div className="profile-section">
                    <div className="profile-details">
                        {reservations.map(reservation => {
                            const screening = reservation.foglalasAdatok.foglaltSzekek[0]?.vetitesSzekek?.vetites;
                            const seats = reservation.foglalasAdatok.foglaltSzekek;
                            return (
                                <div key={reservation.foglalasAdatok.id} className="detail-row">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="detail-label">
                                                {screening?.film?.cim || 'Ismeretlen film'}
                                            </span>
                                            <span className="detail-value">
                                                {formatDateTime(reservation.foglalasAdatok.foglalasIdopontja)}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className="detail-value">
                                                {screening?.terem?.nev || 'Ismeretlen terem'},&nbsp;
                                                {screening?.idopont ?
                                                    new Date(screening.idopont).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }) :
                                                    'Ismeretlen időpont'}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            {seats.map((seat, index) => (
                                                <span
                                                    key={index}
                                                    className="ticket-type-badge"
                                                    style={{ marginRight: '8px', marginBottom: '8px', display: 'inline-block' }}
                                                >
                                                    {seat.x + 1}. sor {seat.y + 1}. szék - {seat.jegyTipus?.nev} ({seat.jegyTipus?.ar} Ft)
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteReservation(reservation.foglalasAdatok.id)}
                                        style={{ marginLeft: '16px', alignSelf: 'center' }}
                                        disabled={new Date(screening?.idopont) <= new Date()}
                                    >
                                        Törlés
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
}

export default ProfileFoglalasok;