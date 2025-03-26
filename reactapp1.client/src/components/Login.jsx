import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const title = "Bejelentkez�s";
    document.title = title;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            window.open("/", "_self");
        }
        else {
            setError(result.error||"Bejelentkez�s hiba");
        }
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            setError(err.response?.data?.errorMessage || "Hib�s email vagy jelsz�");
        }
    };

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
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    placeholder="Email c�m"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
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
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">{title}</button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">M�g nincs fi�kja?
                                <a href="/account/register" className="text-dark font-weight-bold fw-bold"> Regisztr�ci�</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;