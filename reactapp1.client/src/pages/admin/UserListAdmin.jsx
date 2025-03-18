import { useEffect, useState } from 'react';
import "../../../bootstrap/css/bootstrap.min.css";
import React from "react";

function GetUsersTable() {
    const [formData, setFormData] = useState({ userID: "", email: "", accountStatus: "", role: "", megjegyzes: "" });
    const [rowData, setRowData] = useState([]); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetch("https://localhost:7153/api/Auth/queryUsers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(d => ({
                    userID: d.userID,
                    email: d.email,
                    creationDate: d.creationDate,
                    accountStatus: d.accountStatus,
                    role: d.role,
                    megjegyzes: d.megjegyzes,
                }));
                setRowData(formattedData); 
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, [formData]); 

    return (
        <div className="container text-center" style={{ width: "100%", maxWidth: "95%", margin: "0 auto" }}>
            <br></br><h1>Felhasználók listája</h1><br></br><br></br>
            <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className="table table-bordered table-dark" style={{ width: "100%" }}>
                    <thead>
                        <tr className="text-white border-1">
                            <th className="border-1">ID</th>
                            <th className="border-1">Email</th>
                            <th className="border-1">Regisztráció időpontja</th>
                            <th className="border-1">Felhasználó státusza</th>
                            <th className="border-1">Jogosultság</th>
                            <th className="border-1">Megjegyzés</th>
                            <th className="border-1">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-white border-1">
                            <th className="border-1">
                                <input type="text" name="userID" onChange={handleChange} value={formData.userID} />
                            </th>
                            <th className="border-1">
                                <input type="text" name="email" onChange={handleChange} value={formData.email} />
                            </th>
                            <th className="border-1"></th>
                            <th className="border-1">
                                <select className="form-select" name="accountStatus" onChange={handleChange} value={formData.accountStatus}>
                                    <option defaultValue value="none">Mind</option>
                                    <option value="1">Aktív</option>
                                    <option value="2">Felfüggesztett</option>
                                    <option value="3">Törölt</option>
                                </select>
                            </th>
                            <th className="border-1">
                                <select className="form-select" name="role" onChange={handleChange} value={formData.role}>
                                    <option defaultValue value="none">Mind</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                                
                            </th>
                            <th className="border-1">
                                <input type="text" name="megjegyzes" onChange={handleChange} value={formData.megjegyzes} />
                            </th>
                            <th className="border-1"></th>
                        </tr>
                        {rowData.map(row => (
                            <tr key={row.userID} className="text-white border-1">
                                <td className="border-1">{row.userID}</td>
                                <td className="border-1">{row.email}</td>
                                <td className="border-1">{row.creationDate}</td>
                                <td className="border-1">{row.accountStatus}</td>
                                <td className="border-1">{row.role}</td>
                                <td className="border-1">{row.megjegyzes}</td>
                                <td className="border-1">
                                    <a href={`/account/profile/details/${row.userID}`} className="mr-1">
                                        <button className="btn my-2 btn-outline-light my-sm-0 text-light text-center bg-primary font-weight-bold text-white">
                                            Profil
                                        </button>
                                    </a>
                                    <a href={`/account/profile/manage/edit/${row.userID}`}>
                                        <button className="btn my-2 btn-outline-light my-sm-0 text-light font-weight-bold text-center bg-info text-white">
                                            Módosítás
                                        </button>
                                    </a>                             
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br></br><br></br><br></br>
        </div>
    );
}

function UserListAdmin() {
    return <GetUsersTable />;
}

export default UserListAdmin;
