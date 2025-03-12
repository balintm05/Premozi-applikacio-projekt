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
    var switchPage = ["","",""];
    switch (title) {
        case "Bejelentkezés":
            switchPage = ["/account/register", "Nincs még fiókja?", " Regisztráljon most."];
            break;
        case "Regisztráció":
            switchPage = ["/account/login", "Van már fiókja?", " Jelentkezzen be."];
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

            //I'll make this one later
            /*
            const jwtToken = cookies.get("JWTToken");
            const rToken = cookies.get("/refresh/refreshToken");
            let response;
            if (jwtToken != null && rToken != null) {
                return (
                    <div>
                        <p>Már be vagy jelentkezve</p>
                    </div>
                )
            } 
            if (rToken != null) {
                response = await fetch("https://localhost:7153/api/Auth/refresh-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", 'Authorization': (`Bearer ` + jwtToken),
                }
                })
            }            
            if (response == null) {
                response = await fetch(("https://localhost:7153/api/Auth/" + path[path.length - 1]), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
            }*/
            const jwtToken = cookies.get("JWTToken");
            let response;
            if (jwtToken != "") {
                response = await fetch(("https://localhost:7153/api/Auth/" + path[path.length - 1]), {
                    method: "POST",
                    headers: { "Content-Type": "application/json", 'authorization': `Bearer ${jwtToken}` },
                    body: JSON.stringify(formData)
                });
            }
            else {
                response = await fetch(("https://localhost:7153/api/Auth/" + path[path.length - 1]), {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(formData)
                });
            }
            const data = await response.json();
            if (response.status == 200) {
                cookies.set("JWTToken", data.accessToken, { Expires: new Date(Date.now() + 604800000), path: "/",  sameSite: true, secure: true });
                cookies.set("refreshToken", data.refreshToken, { Expires: new Date(Date.now() + 604800000), path: "/", sameSite: true, secure: true });
                window.open("/", "_self");
            } 
            else {
                setError(data.error.errorMessage);
            }
        } catch (err) {
            setError(err.status + " " + err.message);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card my-5">
                        <form className="card-body p-lg-5" onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <h1 className="text-dark font-weight-bold fw-bold">{title}</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label className="text-dark font-weight-bold fw-bold">Email cím</label>
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
                                <label className="text-dark font-weight-bold fw-bold">Jelszó</label>
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
                                <button type="submit" className="btn btn-dark px-5 mb-5 w-100">{title}</button>
                            </div>
                            <div className="form-text text-center mb-5 text-dark">{switchPage[1]}
                                <a href={switchPage[0]} className="text-dark font-weight-bold fw-bold">{switchPage[2]}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>            
        </div>
    );
};
export default AccountForm;
