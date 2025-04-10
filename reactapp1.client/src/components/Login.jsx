import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeWrapper from '../layout/ThemeWrapper';

const Login = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const title = "Bejelentkezés";
    document.title = title + " - Premozi";

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
            const result = await login(formData.email, formData.password);
            if (result.success) {
                if (result.requires2FA) {
                    sessionStorage.setItem('2fa_userId', result.userId);
                    navigate('/auth/2fa');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.error || "Bejelentkezési hiba");
            }
        } catch  {
            setError("Váratlan hiba történt");
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (<ThemeWrapper noBg className="betoltes">
            <div style={{ textAlign: "center", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div className="spinner"></div>
            </div>
        </ThemeWrapper>);
    }
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
                            {isLoading ? 'Betöltés...' : title}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Még nincs fiókja? </p>
                        <a style={{ cursor: 'pointer' }} onClick={e => { e.preventDefault(); navigate("/account/register") }}>Regisztráljon most</a>
                    </div>
                </div>
            </div>
        </ThemeWrapper>
    );
};

export default Login;