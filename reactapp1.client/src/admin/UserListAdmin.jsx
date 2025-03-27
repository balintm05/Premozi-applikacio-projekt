import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout'; 
import  ThemeWrapper  from '../layout/ThemeWrapper';
import "../../bootstrap/css/bootstrap.min.css";

function GetUsersTable() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext); // Get darkMode from ThemeContext
    const [formData, setFormData] = useState({ userID: "", email: "", accountStatus: "", role: "", megjegyzes: "" });
    const [rowData, setRowData] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const controller = new AbortController();

        api.post('/Auth/queryUsers', formData, {
            signal: controller.signal
        })
            .then(response => {
                const formattedData = response.data.map(d => ({
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
                if (error.name !== 'CanceledError') {
                    console.error("Error fetching user data:", error);
                }
            });

        return () => controller.abort();
    }, [formData, api]);

    return (
        <ThemeWrapper className="container text-center" style={{ width: "100%", maxWidth: "95%", margin: "0 auto" }}>
            <br /><h1>Felhasználók listája</h1><br /><br />
            <div className="table-responsive" style={{ overflowX: "auto" }}>
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr className={`${darkMode ? 'text-white' : 'text-dark'} border-1`}>
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
                        <tr className={`${darkMode ? 'text-white' : 'text-dark'} border-1`}>
                            <th className="border-1">
                                <input
                                    type="text"
                                    name="userID"
                                    onChange={handleChange}
                                    value={formData.userID}
                                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                />
                            </th>
                            <th className="border-1">
                                <input
                                    type="text"
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                />
                            </th>
                            <th className="border-1"></th>
                            <th className="border-1">
                                <select
                                    className={`form-select ${darkMode ? 'bg-secondary text-white' : ''}`}
                                    name="accountStatus"
                                    onChange={handleChange}
                                    value={formData.accountStatus}
                                >
                                    <option defaultValue value="none">Mind</option>
                                    <option value="1">Aktív</option>
                                    <option value="2">Felfüggesztett</option>
                                    <option value="3">Törölt</option>
                                </select>
                            </th>
                            <th className="border-1">
                                <select
                                    className={`form-select ${darkMode ? 'bg-secondary text-white' : ''}`}
                                    name="role"
                                    onChange={handleChange}
                                    value={formData.role}
                                >
                                    <option defaultValue value="none">Mind</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                            </th>
                            <th className="border-1">
                                <input
                                    type="text"
                                    name="megjegyzes"
                                    onChange={handleChange}
                                    value={formData.megjegyzes}
                                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                                />
                            </th>
                            <th className="border-1"></th>
                        </tr>
                        {rowData.map(row => (
                            <tr key={row.userID} className={`${darkMode ? 'text-white' : 'text-dark'} border-1`}>
                                <td className="border-1">{row.userID}</td>
                                <td className="border-1">{row.email}</td>
                                <td className="border-1">{row.creationDate}</td>
                                <td className="border-1">{row.accountStatus}</td>
                                <td className="border-1">{row.role}</td>
                                <td className="border-1">{row.megjegyzes}</td>
                                <td className="border-1">
                                    <a href={`/account/profile/details/${row.userID}`} className="mr-1">
                                        <button className={`btn my-2 my-sm-0 text-center font-weight-bold ${darkMode ? 'btn-primary' : 'btn-outline-primary'
                                            }`}>
                                            Profil
                                        </button>
                                    </a>
                                    <a href={`/account/profile/manage/edit/${row.userID}`}>
                                        <button className={`btn my-2 my-sm-0 font-weight-bold text-center ${darkMode ? 'btn-info' : 'btn-outline-info'
                                            }`}>
                                            Módosítás
                                        </button>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br /><br /><br />
        </ThemeWrapper>
    );
}

function UserListAdmin() {
    return <GetUsersTable />;
}

export default UserListAdmin;