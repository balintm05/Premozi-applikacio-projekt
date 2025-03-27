import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import ThemeWrapper from '../layout/ThemeWrapper';

const Register = () => {
    const { user, register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const title = "Regisztráció";
    document.title = title;

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await register(formData.email, formData.password);
            if (result.success) {
                navigate('/account/login', { state: { message: "Sikeres regisztráció, kérjük hitelesítse az email címét" } });
            } else {
                setError(result.error || "Hiba történt a regisztráció során");
            }
        } catch {
            setError("Váratlan hiba történt");
        } finally {
            setIsLoading(false);
        }
    };

    if (user) return null;

    return (
        <ThemeWrapper noBg>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1>{title}</h1>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label>Email cím</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="pelda@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Jelszó</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Regisztrálás...' : title}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Már van fiókja?</p>
                        <a href="/account/login">Jelentkezzen be</a>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default Register;