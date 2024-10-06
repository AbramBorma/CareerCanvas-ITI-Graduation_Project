import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Adjust the path based on your project structure
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useProtectedRoute = (Component) => {
    const { user } = useContext(AuthContext);

    if (user && !user.is_approved_by_admin) {
        toast.error('Not approved yet by the admin');
        return <Navigate to="/home" />;
    }

    return <Component />;
};

export default useProtectedRoute;
