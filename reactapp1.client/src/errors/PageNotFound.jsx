import ThemeWrapper from "../layout/ThemeWrapper";
import { useNavigate } from 'react-router-dom';
function PageNotFound() {
    const navigate = useNavigate();
    document.title = "Nem található oldal - Premozi";
    return (
        <ThemeWrapper className="container text-center row col-md-6 offset-md-3 d-flex flex-column align-items-center justify-content-center" style={{  alignContent: 'center' }} as="div">
            <h2 className="mt-3 mb-4">A keresett oldal nem található</h2>
            <button className="btn btn-primary mb-3" style={{ maxWidth: '30%', alignContent: 'center' }} onClick={() => navigate('/')}>
                Vissza a főoldalra
            </button>
        </ThemeWrapper>

    );
}

export default PageNotFound;