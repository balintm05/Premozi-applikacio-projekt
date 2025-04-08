import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminIndex() {
    const navigate = useNavigate();
    document.title = "Admin index - Premozi";
    useEffect(() => {
        navigate('/admin/filmek');
    }, [navigate]);
    return null;
}

export default AdminIndex;