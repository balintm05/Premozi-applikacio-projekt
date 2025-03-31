import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../layout/Layout';
import ThemeWrapper from '../layout/ThemeWrapper';

export default function AdminLayout({ children }) {
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { id: 'films', path: '/admin/filmek', name: 'Filmek' },
        { id: 'rooms', path: '/admin/termek', name: 'Termek' },
        { id: 'screenings', path: '/admin/vetitesek', name: 'Vetítések' },
        { id: 'foglalas', path: '/admin/foglalas', name: 'Foglalások' },
        { id: 'users', path: '/admin/users', name: 'Felhasználók' }
    ];

    return (
        <ThemeWrapper className="container-fluid" noBg>
            <div className="row min-vh-100">
                <ThemeWrapper
                    as="nav"
                    className="col-md-3 col-lg-2 d-md-block sidebar p-0"
                    style={{
                        backgroundColor: darkMode ? 'var(--nav-bg)' : '#f8f9fa',
                        borderRight: darkMode ? '1px solid var(--border-color)' : '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: darkMode ? 'none' : '2px 0 5px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div className="position-sticky pt-3 h-100">
                        <div
                            className="px-3 py-2 mb-3"
                            style={{
                                borderBottom: darkMode ? '1px solid var(--border-color)' : '1px solid rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <h4 className="fw-bold" style={{ color: darkMode ? 'var(--nav-text)' : '#212529' }}>
                                Adminisztrátor felület
                            </h4>
                        </div>
                        <ul className="nav flex-column">
                            {tabs.map(tab => (
                                <li className="nav-item" key={tab.id}>
                                    <button
                                        className={`nav-link w-100 text-start ${darkMode ? 'text-white' : 'text-dark'
                                            } ${location.pathname.startsWith(tab.path) ? 'active' : ''
                                            }`}
                                        style={{
                                            backgroundColor: location.pathname.startsWith(tab.path)
                                                ? (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
                                                : 'transparent',
                                            borderLeft: `3px solid ${location.pathname.startsWith(tab.path)
                                                    ? 'var(--active-link)'
                                                    : 'transparent'
                                                }`,
                                            margin: '0.1rem 0',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0 4px 4px 0',
                                            transition: 'all 0.2s ease',
                                            borderBottom: darkMode
                                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                                : '1px solid rgba(0, 0, 0, 0.05)'
                                        }}
                                        onClick={() => navigate(tab.path)}
                                    >
                                        <i
                                            className={`bi bi-${tab.id === 'users' ? 'people' :
                                                    tab.id === 'films' ? 'film' :
                                                        tab.id === 'rooms' ? 'building' :
                                                            tab.id === 'screenings' ? 'calendar-event' :
                                                                'cart'
                                                } me-2`}
                                        />
                                        {tab.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </ThemeWrapper>
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
                    {children}
                </main>
            </div>
        </ThemeWrapper>
    );
}