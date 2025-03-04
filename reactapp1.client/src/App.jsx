import { useEffect, useState } from 'react';
import './App.css';
//import "./bootstrap.bundle.min.js";

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
                setError(data.message || "Hibás bejelentkezési adatok");
            }
        } catch (err) {
            setError("Hibás felhasználónév vagy jelszó");
        }
    };

    if (window.location.href =="https://localhost:60769/login") {
        return (
            <div style={{ width: "500px", fontSize: "16px", margin: "auto" }}>
                <form style={{ paddingBottom: "10px", backgroundColor: "whitesmoke" }} className="" onSubmit={handleSubmit}>
                    <div style={{ backgroundColor: "royalblue", color: "white", alignContent: "center", borderTopRightRadius: "5px", borderTopLeftRadius: "5px" }}>
                        <h1>Bejelentkezés</h1>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div style={{ paddingTop: "40px" }}>
                        <label>Felhasználónév</label><br></br>
                        <input style={{ fontSize: "14px", height: "25px", width: "300px", borderRadius: "5px" }} type="text" name="username" placeholder="Felhasználónév" value={formData.username} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "20px" }}>
                        <label>Jelszó</label><br></br>
                        <input style={{ fontSize: "14px", height: "25px", width: "300px", borderRadius: "5px" }} type="password" name="password" placeholder="Jelszó" value={formData.password} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "30px" }}>
                        <button style={{ color: "white", backgroundColor: "royalblue", borderRadius: "5px", fontSize: "14px", height: "38px", width: "190px" }} type="submit" >
                            Bejelentkezés
                        </button>
                    </div>
                    <br></br>
                    <div style={{ borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px" }}>
                        Nincs még fiókja? <br></br>
                        <a href="/register">
                            Regisztráljon most.
                        </a>
                    </div>
                </form>
            </div>
        );
    }
    else if (window.location.href =="https://localhost:60769/register") {
        return (
            <div style={{ paddingRight: "35%", paddingLeft: "35%", fontSize: "14px" }}>
                <form style={{ "padding-top": "1px", paddingBottom: "10px", backgroundColor: "whitesmoke" }} className="" onSubmit={handleSubmit}>
                    <div>
                        <h1 style={{ color: "dodgerblue" }}>Regisztrálás</h1>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div>
                        <label>Felhasználónév</label><br></br>
                        <input style={{ fontSize: "14px", height: "20px", width: "185px" }} type="text" name="username" placeholder="Felhasználónév" value={formData.username} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label>Jelszó</label><br></br>
                        <input style={{ fontSize: "14px", height: "20px", width: "185px" }} type="password" name="password" placeholder="Jelszó" value={formData.password} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "10px" }}>
                        <button style={{ color: "white", backgroundColor: "royalblue", borderRadius: "5px", fontSize: "14px", height: "30px", width: "190px" }} type="submit" >
                            Bejelentkezés
                        </button>
                    </div>
                    <br></br>
                    <div>
                        Van már fiókja? <br></br>
                        <a href="/login">
                            jelentkezzen be.
                        </a>
                    </div>
                </form>
            </div>
        );
    }
    else if (window.location.href == "https://localhost:60769/musorok") {
        //
    }
    
};

export default Login;

