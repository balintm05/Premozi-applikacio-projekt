import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeWrapper from "../../Layout/ThemeWrapper";
import "./ProfilePage.css";

function ProfilePage() {
    const { id } = useParams();
    const location = useLocation();
    const { user, hasRole } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdminView, setIsAdminView] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            if (hasRole("Admin") && id) {
                // Admin viewing another user's profile
                response = await fetch(`https://localhost:7153/api/Auth/getUserAdmin/${id}`, {
                    method: "GET",
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }
                });
                setIsAdminView(true);
            } else {
                // Regular user viewing their own profile
                response = await fetch("https://localhost:7153/api/Auth/getUser", {
                    method: "GET",
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }
                });
                setIsAdminView(false);
            }

            if (!response.ok) {
                throw new Error(response.statusText || "Failed to fetch profile data");
            }

            const data = await response.json();
            setProfileData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [id, user, hasRole]);

    if (loading) {
        return (
            <ThemeWrapper>
                <div className="profile-loading">
                    <div className="spinner"></div>
                    <p>Adatok betöltése...</p>
                </div>
            </ThemeWrapper>
        );
    }

    if (error) {
        return (
            <ThemeWrapper>
                <div className="profile-error">
                    <h2>Hiba történt</h2>
                    <p>{error}</p>
                    <button onClick={fetchProfileData}>Újrapróbálkozás</button>
                </div>
            </ThemeWrapper>
        );
    }

    if (!profileData) {
        return (
            <ThemeWrapper>
                <div className="profile-empty">
                    <h2>Nincsenek megjeleníthető adatok</h2>
                </div>
            </ThemeWrapper>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <ThemeWrapper>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Felhasználói profil</h1>
                    {isAdminView && <span className="admin-badge">Admin nézet</span>}
                </div>

                <div className="profile-section">
                    <h2>Alapadatok</h2>
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Felhasználó ID:</span>
                            <span className="detail-value">{profileData.userID || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email cím:</span>
                            <span className="detail-value">{profileData.email || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Regisztráció dátuma:</span>
                            <span className="detail-value">{formatDate(profileData.creationDate)}</span>
                        </div>
                    </div>
                </div>

                {(hasRole("Admin") || isAdminView) && (
                    <div className="profile-section">
                        <h2>Adminisztratív adatok</h2>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Fiók státusza:</span>
                                <span className="detail-value">{profileData.accountStatus || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Jogosultsági szint:</span>
                                <span className="detail-value">{profileData.role || "N/A"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Megjegyzés:</span>
                                <span className="detail-value">{profileData.Megjegyzes || "Nincs megjegyzés"}</span>
                            </div>
                        </div>
                    </div>
                )}

                {hasRole("Admin") && isAdminView && (
                    <div className="profile-actions">
                        <button className="btn btn-primary">Fiók állapotának módosítása</button>
                        <button className="btn btn-secondary">Jogosultság módosítása</button>
                        <button className="btn btn-danger">Megjegyzés hozzáadása</button>
                    </div>
                )}
            </div>
        </ThemeWrapper>
    );
}

export default ProfilePage;