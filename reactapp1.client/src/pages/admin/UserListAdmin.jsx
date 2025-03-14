import { useEffect, useState } from 'react';
import "../../../bootstrap/css/bootstrap.min.css";
import React from "react";

function GetUsersTable() {   
    const [data, setData] = useState(null);
   
    useEffect(() => {
        fetch("https://localhost:7153/api/Auth/getAllUsers", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setData(data))
            /*.catch((error) => {
                console.error("Hiba a bejelentkezés ellenőrzésekor:", error)})*/
            ;
    }, []);
    if (data === null) {
        return;
    }
    return (
        <div className="container text-center">
            <br></br><h1>Felhasználók listája</h1><br></br><br></br>
            <table className="table table-bordered">
                <thead>
                    <tr className="text-white border-1">
                        <th className="border-1">
                            ID
                        </th>
                        <th className="border-1">
                            Email
                        </th>
                        <th className="border-1">
                            Regisztráció időpontja
                        </th>
                        <th className="border-1">
                            Felhasználó státusza
                        </th>
                        <th className="border-1">
                            Jogosultság
                        </th>
                        <th className="border-1">
                            Megjegyzés
                        </th>
                        <th className="border-1">
                            Műveletek
                        </th>
                    </tr>
                </thead>                
                <tbody>
                    <tr className="text-white border-1">
                        <th className="border-1">
                            ID kereső
                        </th>
                        <th className="border-1">
                            Email kereső
                        </th>
                        <th className="border-1">
                            
                        </th>
                        <th className="border-1">
                            Státusz kereső
                        </th>
                        <th className="border-1">
                            Jogosultság kereső
                        </th>
                        <th className="border-1">
                            Megjegyzés kereső

                        </th>
                        <th className="border-1">
                            
                        </th>
                    </tr>
                    <>
                        {data.map(row => (
                            <tr key={row.userID} className="text-white border-1">
                                <td className="border-1">{row.userID}</td>
                                <td className="border-1">{row.email}</td>
                                <td className="border-1">{row.creation_date}</td>
                                <td className="border-1">{row.account_status}</td>
                                <td className="border-1">{row.role}</td>
                                <td className="border-1">{row.Megjegyzes}</td>
                                <td className="border-1">
                                    <a href="/account/manage/editUser/${row.userID}">Módosítás</a> <br></br>
                                    <a href="/">Részletek</a> <br></br>
                                    <a href="/">Törlés</a>
                                </td>
                            </tr>
                        ))}
                    </>
                </tbody>
            </table>
        </div>
    );

}
function UserListAdmin() {
    const [formData, setFormData] = useState({ userID: "", email: "", account_status: "", role: "", Megjegyzes: "" });
    const handleQuery = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(("https://localhost:7153/api/Auth/"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
        }
        catch (err) {
            console.log(err.status + " " + err.message);
        }
    };
    return (
        <GetUsersTable />
    )
}
               

export default UserListAdmin;