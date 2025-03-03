import { useEffect, useState } from 'react';
//import './App.css';
import "./bootstrap.bundle.min.js";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("https://localhost:60769/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                console.log("Login successful");
            } else {
                setError(data.message || "Hib�s bejelentkez�si adatok");
            }
        } catch (err) {
            setError("H�l�zati hiba");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card my-5">
                        <form className="card-body p-lg-5" onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <h1 className="text-dark font-weight-bold">Bejelentkez�s</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold">Felhaszn�l�n�v</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    placeholder="Felhaszn�l�n�v"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="">
                                <label className="text-dark font-weight-bold">Jelsz�</label>
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
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">
                                    Bejelentkez�s
                                </button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">
                                Nincs m�g fi�kja? 
                                <a href="/register" className="text-dark font-weight-bold">
                                    Regisztr�ljon most.
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
