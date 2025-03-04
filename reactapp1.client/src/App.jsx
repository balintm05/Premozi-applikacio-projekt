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
                setError(data.message || "Hib�s bejelentkez�si adatok");
            }
        } catch (err) {
            setError("Hib�s felhaszn�l�n�v vagy jelsz�");
        }
    };

    if (window.location.href =="https://localhost:60769/login") {
        return (
            <div style={{ width: "500px", fontSize: "16px", margin: "auto" }}>
                <form style={{ paddingBottom: "10px", backgroundColor: "whitesmoke" }} className="" onSubmit={handleSubmit}>
                    <div style={{ backgroundColor: "royalblue", color: "white", alignContent: "center", borderTopRightRadius: "5px", borderTopLeftRadius: "5px" }}>
                        <h1>Bejelentkez�s</h1>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div style={{ paddingTop: "40px" }}>
                        <label>Felhaszn�l�n�v</label><br></br>
                        <input style={{ fontSize: "14px", height: "25px", width: "300px", borderRadius: "5px" }} type="text" name="username" placeholder="Felhaszn�l�n�v" value={formData.username} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "20px" }}>
                        <label>Jelsz�</label><br></br>
                        <input style={{ fontSize: "14px", height: "25px", width: "300px", borderRadius: "5px" }} type="password" name="password" placeholder="Jelsz�" value={formData.password} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "30px" }}>
                        <button style={{ color: "white", backgroundColor: "royalblue", borderRadius: "5px", fontSize: "14px", height: "38px", width: "190px" }} type="submit" >
                            Bejelentkez�s
                        </button>
                    </div>
                    <br></br>
                    <div style={{ borderBottomRightRadius: "5px", borderBottomLeftRadius: "5px" }}>
                        Nincs m�g fi�kja? <br></br>
                        <a href="/register">
                            Regisztr�ljon most.
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
                        <h1 style={{ color: "dodgerblue" }}>Regisztr�l�s</h1>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <div>
                        <label>Felhaszn�l�n�v</label><br></br>
                        <input style={{ fontSize: "14px", height: "20px", width: "185px" }} type="text" name="username" placeholder="Felhaszn�l�n�v" value={formData.username} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label>Jelsz�</label><br></br>
                        <input style={{ fontSize: "14px", height: "20px", width: "185px" }} type="password" name="password" placeholder="Jelsz�" value={formData.password} onChange={handleChange} required
                        />
                    </div>
                    <div style={{ paddingTop: "10px" }}>
                        <button style={{ color: "white", backgroundColor: "royalblue", borderRadius: "5px", fontSize: "14px", height: "30px", width: "190px" }} type="submit" >
                            Bejelentkez�s
                        </button>
                    </div>
                    <br></br>
                    <div>
                        Van m�r fi�kja? <br></br>
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

