import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { user, register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const title = "Regisztr�ci�";
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
                navigate('/account/login', { state: { message: "Sikeres regisztr�ci�, k�rj�k hiteles�tse az email c�m�t" } });
            } else {
                setError(result.error || "Hiba t�rt�nt a regisztr�ci� sor�n");
            }
        } catch (err) {
            setError("V�ratlan hiba t�rt�nt");
        } finally {
            setIsLoading(false);
        }
    };

    if (user) return null; 


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div style={{ backgroundColor: "rgb(207,207,207)" }} className="card my-5">
                        <form className="card-body p-lg-5" onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <h1 className="text-dark font-weight-bold fw-bold">{title}</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold fw-bold">Email c�m</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Email c�m"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold fw-bold">Jelsz�</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Jelsz�"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-dark px-5 mb-5 w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Regisztr�l�s...' : title}
                                </button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">
                                M�r van fi�kja?
                                <a href="/account/login" className="text-dark font-weight-bold fw-bold"> Bejelentkez�s</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;