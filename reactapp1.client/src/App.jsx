/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './App.css';
import "../bootstrap/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const cookies = new Cookies();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("https://localhost:7153/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json",  },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                cookies.set("JWTToken", data.accessToken, { Expires: 7, httpOnly: true });
                cookies.set("refreshToken", data.refreshToken, { Expires: 7, path: "/refresh", httpOnly: true });
                console.log("Login successful");
                console.log("5");
            } else {
                setError(response.status);
            }
        } catch (err) {
            console.log("7");
            setError(err.message);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card my-5">
                        <form className="card-body p-lg-5" onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <h1 className="text-dark font-weight-bold">Bejelentkezés</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold">Email cím</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    placeholder="Email cím"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold">Jelszó</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Jelszó"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">
                                    Bejelentkezés
                                </button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">
                                Nincs még fiókja?
                                <a href="/register" className="text-dark font-weight-bold">
                                    Regisztráljon most.
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
