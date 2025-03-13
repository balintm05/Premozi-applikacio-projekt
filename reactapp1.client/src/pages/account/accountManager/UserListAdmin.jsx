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
                console.error("Hiba a bejelentkez�s ellen�rz�sekor:", error)})*/
            ;
    }, []);
    if (data === null) {
        return (
            <div>
                <h4>Hiba: Nincs hozz�f�r�se az oldalhoz</h4>
            </div>
        )
    }
    return (
        <div className="container">
            <h1>Felhaszn�l�k list�ja</h1>
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
                            Regisztr�ci� ideje
                        </th>
                        <th className="border-1">
                            Felhaszn�l� st�tusza
                        </th>
                        <th className="border-1">
                            Jogosults�g
                        </th>
                        <th className="border-1">
                            Megjegyz�s
                        </th>
                        <th className="border-1">
                            M�veletek
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
                                    <a href="/account/manage/editUser/${row.userID}">M�dos�t�s</a> <br></br>
                                    <a href="/">R�szletek</a> <br></br>
                                    <a href="/">T�rl�s</a>
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