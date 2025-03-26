import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/axiosConfig';

const TwoFactorAuth = () => {
    const [formData, setFormData] = useState({ code: '', tempToken: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const tempToken = sessionStorage.getItem('2fa_tempToken');
        if (!tempToken) setError('Nincs aktív kétlépcsõs azonosítási munkafolyamat.');
        setFormData((prev) => ({ ...prev, tempToken }));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/complete-2fa-login', formData);
            sessionStorage.removeItem('2fa_tempToken');
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.errorMessage || 'Érvénytelen kód');
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div style={{ backgroundColor: "rgb(207,207,207)" }} className="card my-5">
                        <form className="card-body p-lg-5" onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <h1 className="text-dark font-weight-bold fw-bold">Kétlépcsõs azonosítás</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold fw-bold">Hitelesítési kód</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    placeholder="6 jegyû kód"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">Hitelesítés</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuth;