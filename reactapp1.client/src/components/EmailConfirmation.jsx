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
                setMessage('Email cím sikeresen megerõsítve!');
            } catch (err) {
                setMessage(err.response?.data?.errorMessage || 'Hiba történt az email megerõsítés során.');
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