import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeWrapper from '../../layout/ThemeWrapper';
import "./FoglalasSuccess.css";

const FoglalasSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const { state } = useLocation();

    useEffect(() => {
        if (!state?.fromFoglalas) {
            navigate('/musor');
        }
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/musor');
                    return 0;
                }
                return prev - 1;
            });
        }, 10000);

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
                            Átirányítás a műsorhoz {countdown} másodperc múlva...
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
                            className="btn btn-primary"
                            onClick={() => navigate('/musor')}
                        >
                            Vissza a műsorhoz most
                        </button>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default FoglalasSuccess;