import { useContext } from 'react';
import { ThemeContext } from '../layout/Layout';
import ThemeWrapper  from '../layout/ThemeWrapper';


function AdminIndex() {
    const { darkMode } = useContext(ThemeContext);
    return (
        <ThemeWrapper className="text-center py-4">
            <h1 className="mb-4">Adminisztrátori kezelőfelületek</h1>
            <div className="d-flex flex-column gap-3">
                <a href="/admin/users" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                    Fiókkezelő
                </a>
                <a href="/admin/filmek" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                    Film kezelő
                </a>
                <a href="/" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                    Terem kezelő
                </a>
                <a href="/" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                    Vetítés kezelő
                </a>
                <a href="/" className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                    Rendelés kezelő
                </a>
            </div>
        </ThemeWrapper>
    );
}

export default AdminIndex;