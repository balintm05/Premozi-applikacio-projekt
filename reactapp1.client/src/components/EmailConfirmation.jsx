import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/axiosConfig';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Folyamatban...');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const userId = searchParams.get('userId');
                const token = searchParams.get('token');
                await api.get(`/auth/confirm-email?userId=${userId}&token=${token}`);
                setMessage('Email c�m sikeresen meger�s�tve!');
            } catch (err) {
                setMessage(err.response?.data?.errorMessage || 'Hiba t�rt�nt az email meger�s�t�s sor�n.');
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