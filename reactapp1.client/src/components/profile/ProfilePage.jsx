import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ThemeWrapper from "../../Layout/ThemeWrapper";
import "./ProfilePage.css";

function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasRole, logout } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdminView, setIsAdminView] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = hasRole("Admin") && id ?
                `/api/Auth/getUserAdmin/${id}` :
                '/api/Auth/getUser';

            const response = await fetch(`https://localhost:7153${endpoint}`, {
                credentials: 'include',
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            setProfileData(data);
            setIsAdminView(hasRole("Admin") && id && id !== user?.userID.toString());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfileData(); }, [id, user, hasRole]);

    const handleDeleteAccount = async () => {
        if (window.confirm("Biztosan törölni szeretné a fiókját?")) {
            const response = await fetch(`https://localhost:7153/api/Auth/deleteUser/${profileData.userID}`, {
                method: "DELETE",
                credentials: 'include'
            });
            if (response.ok) {
                if (!isAdminView) await logout();
                navigate("/");
            }
        }
    };

    if (loading) return (
        <ThemeWrapper>
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Adatok betöltése...</p>
            </div>
        </ThemeWrapper>
    );

    if (error) return (
        <ThemeWrapper>
            <div className="profile-error">
                <h2>Hiba történt</h2>
                <p>{error}</p>
                <button onClick={fetchProfileData}>Újrapróbálkozás</button>
            </div>
        </ThemeWrapper>
    );

    return (
        <ThemeWrapper>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>{isAdminView ? "Felhasználó kezelése" : "Profilom"}</h1>
                    {isAdminView && <span className="admin-badge">Admin nézet</span>}
                </div>

                <div className="profile-section">
                    <h2>Alapadatok</h2>
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">Felhasználó ID:</span>
                            <span className="detail-value">{profileData.userID}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email cím:</span>
                            <span className="detail-value">{profileData.email}</span>
                        </div>
                    </div>
                </div>

                {!isAdminView && (
                    <div className="profile-actions">
                        <button className="btn btn-primary" onClick={() => navigate("/change-email")}>
                            Email módosítása
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate("/change-password")}>
                            Jelszó módosítása
                        </button>
                        <button className="btn btn-danger" onClick={handleDeleteAccount}>
                            Fiók törlése
                        </button>
                    </div>
                )}

                {isAdminView && (
                    <>
                        <div className="profile-section">
                            <h2>Adminisztráció</h2>
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="detail-label">Státusz:</span>
                                    <span className="detail-value">
                                        {profileData.accountStatus === 1 ? "Aktív" : "Felfüggesztett"}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Jogosultság:</span>
                                    <span className="detail-value">{profileData.role}</span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <button className="btn btn-primary" onClick={() => navigate(`/admin/user/${profileData.userID}/status`)}>
                                Státusz módosítása
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate(`/admin/user/${profileData.userID}/force-password-change`)}>
                                Jelszóváltoztatás kényszerítése
                            </button>
                        </div>
                    </>
                )}
            </div>
        </ThemeWrapper>
    );
}

export default ProfilePage;