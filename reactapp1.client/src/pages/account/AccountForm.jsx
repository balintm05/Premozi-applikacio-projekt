/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import './Login.css';
import "../../../bootstrap/css/bootstrap.min.css";
import Cookies from 'universal-cookie';

const AccountForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const cookies = new Cookies();
    const title = document.title;
    const path = location.pathname.split('/');
    var switchPage = ["",""];
    switch (title) {
        case "Bejelentkezés":
            switchPage = ["/account/register", "Regisztráljon most."];
            break;
        case "Regisztráció":
            switchPage = ["/account/login", "Jelentkezzen be."];
            break;
        default:
            break;
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(("https://localhost:7153/api/Auth/" + path[path.length - 1]), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                cookies.set("JWTToken", data.accessToken, { Expires: new Date(Date.now() + 604800000), path: "/", httpOnly: true, sameSite: true, secure: true });
                cookies.set("refreshToken", data.refreshToken, { Expires: new Date(Date.now() + 604800000), path: "/refresh", httpOnly: true, sameSite : true, secure:true});
                window.open("/", "_self");
            } 
            else {
                setError(data.error);
            }
        } catch (err) {
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
                                <h1 className="text-dark fw-bold">{title}</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark fw-bold">Email cím</label>
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
                                <label className="text-dark fw-bold">Jelszó</label>
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
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">Bejelentkezés</button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">Nincs még fiókja?
                                <a href={switchPage[0]} className="text-dark fw-bold"> {switchPage[1]}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>            
        </div>
    );
};
export default AccountForm;
