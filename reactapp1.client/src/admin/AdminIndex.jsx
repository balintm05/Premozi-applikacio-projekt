import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../layout/Layout';

function AdminIndex() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/admin/filmek');
    }, [navigate]);
    return null;
}

export default AdminIndex;