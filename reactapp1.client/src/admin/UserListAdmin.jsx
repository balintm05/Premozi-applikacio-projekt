import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../layout/Layout';
import AdminLayout from './AdminLayout';
import ThemeWrapper from '../layout/ThemeWrapper';
import { useNavigate } from 'react-router-dom';

function UserListAdmin() {
    const { api } = useContext(AuthContext);
    const { darkMode } = useContext(ThemeContext);
    const [filter, setFilter] = useState({
        userID: "",
        email: "",
        accountStatus: "none",
        role: "none",
        Megjegyzes: ""
    });
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        api.get('/Auth/get', {
            signal: controller.signal
        })
            .then(response => {
                setAllUsers(response.data);
                setFilteredUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.name !== 'CanceledError') {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [api]);

    useEffect(() => {
        const filtered = allUsers.filter(user => {
            return (
                (filter.userID === "" || user.userID.toString().includes(filter.userID)) &&
                (filter.email === "" || user.email.toLowerCase().includes(filter.email.toLowerCase())) &&
                (filter.accountStatus === "none" || user.accountStatus.toString() === filter.accountStatus) &&
                (filter.role === "none" || user.role === filter.role) &&
                (filter.Megjegyzes === "" || (user.Megjegyzes && user.Megjegyzes.toLowerCase().includes(filter.Megjegyzes.toLowerCase())))
            );
        });
        setFilteredUsers(filtered);
    }, [filter, allUsers]);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <AdminLayout><p>Loading...</p></AdminLayout>;
    }

    return (
        <AdminLayout>
            <ThemeWrapper className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Felhasználók kezelése</h1>
            </ThemeWrapper>

            <ThemeWrapper className="table-responsive">
                <table className={`table table-bordered ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Regisztráció időpontja</th>
                            <th>Felhasználó státusza</th>
                            <th>Jogosultság</th>
                            <th>Megjegyzés</th>
                            <th>Műveletek</th>
                        </tr>
                        <tr>
                            <th>
                                <input
                                    type="text"
                                    name="userID"
                                    onChange={handleFilterChange}
                                    value={filter.userID}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="email"
                                    onChange={handleFilterChange}
                                    value={filter.email}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                />
                            </th>
                            <th></th>
                            <th>
                                <select
                                    className={`form-select ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    name="accountStatus"
                                    onChange={handleFilterChange}
                                    value={filter.accountStatus}
                                >
                                    <option value="none">Mind</option>
                                    <option value="1">Aktív</option>
                                    <option value="2">Felfüggesztett</option>
                                </select>
                            </th>
                            <th>
                                <select
                                    className={`form-select ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                    name="role"
                                    onChange={handleFilterChange}
                                    value={filter.role}
                                >
                                    <option value="none">Mind</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                </select>
                            </th>
                            <th>
                                <input
                                    type="text"
                                    name="Megjegyzes"
                                    onChange={handleFilterChange}
                                    value={filter.Megjegyzes}
                                    className={`form-control ${darkMode ? 'bg-dark text-white border-light' : ''}`}
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(row => (
                            <tr key={row.userID}>
                                <td>{row.userID}</td>
                                <td>{row.email}</td>
                                <td>{new Date(row.creationDate).toLocaleString()}</td>
                                <td>{row.accountStatus === "1" ? "Aktív" : row.accountStatus === "2" ? "Felfüggesztett" : "Törölt"}</td>
                                <td>{row.role}</td>
                                <td>{row.Megjegyzes}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className={`btn ${darkMode ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => navigate(`/account/profile/details/${row.userID}`)}
                                            style={{
                                                borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`
                                            }}
                                        >
                                            Profil
                                        </button>
                                        <button
                                            className={`btn ${darkMode ? 'btn-info' : 'btn-outline-info'}`}
                                            onClick={() => navigate(`/account/profile/manage/edit/${row.userID}`)}
                                        >
                                            Módosítás
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ThemeWrapper>
        </AdminLayout>
    );
}

export default UserListAdmin;