import { useEffect, useState } from 'react';
import '../Login.css';
import "../../../../bootstrap/css/bootstrap.min.css";
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
                console.error("Hiba a bejelentkezés ellenõrzésekor:", error)})*/
            ;
    }, []);
    if (data === null) {
        return (
            <div>
                <h4>Hiba: Nincs hozzáférése az oldalhoz</h4>
            </div>
        )
    }
    return (
        <div className="container">
            <h1>Felhasználók listája</h1>
            <table className="table">
                <thead>
                    <tr className="text-dark border-1">
                        <th className="border-1">
                            ID
                        </th>
                        <th className="border-1">
                            Email
                        </th>
                        <th className="border-1">
                            Regisztráció ideje
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
                            Mûveletek
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {data.map(row => (
                            <tr key={row.userID} className="text-dark border-1">
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
    return (
        <GetUsersTable />
    )
}
               

export default UserListAdmin;