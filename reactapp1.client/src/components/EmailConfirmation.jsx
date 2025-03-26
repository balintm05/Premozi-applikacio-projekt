import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Folyamatban...');
    const { api } = useContext(AuthContext);

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            try {
                const result = await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`);
                if (result.success) {
                    setMessage('Email c�m sikeresen meger�s�tve!');
                    window.open("/", "_self");
                } else {
                    setMessage(result.error || 'Hiba t�rt�nt az email meger�s�t�s sor�n.');
                }
            } catch (error) {
                setMessage(error.response?.data?.errorMessage || 'Hiba t�rt�nt az email meger�s�t�s sor�n.');
            }
        };
        confirmEmail();
    }, [searchParams]);

    return (
        <div className="container text-center mt-5">
            <h2>{message}</h2>
        </div>
    );
};

export default EmailConfirmation;