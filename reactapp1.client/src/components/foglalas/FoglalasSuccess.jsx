import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeWrapper from '../../layout/ThemeWrapper';
import { ThemeContext } from '../../layout/Layout';
import "./FoglalasSuccess.css";

const FoglalasSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const { state } = useLocation();
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        if (!state?.fromFoglalas) {
            navigate('/musor');
        }
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, state]);

    const progressPercentage = (countdown / 10) * 100;

    return (
        <ThemeWrapper>
            <div className="foglalas-success-container">
                <div className="foglalas-success-card">
                    <h1 className="text-center mb-4">Köszönjük a foglalását!</h1>

                    <div className="alert alert-success mb-4">
                        A foglalását sikeresen rögzítettük. A részleteket tartalmazó emailt elküldtük a megadott címre.
                        <div className="countdown-text">
                            Átirányítás a főoldalra {countdown} másodperc múlva...
                        </div>
                    </div>
                    <div className="progress-slider-container">
                        <div
                            className="progress-slider"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            className="btn btn-success-foglalas"
                            onClick={() => navigate('/musor')}
                        >
                            Vissza a főoldalra most
                        </button>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default FoglalasSuccess;