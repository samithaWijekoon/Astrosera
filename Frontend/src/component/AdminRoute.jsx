import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    // Check if user is logged in AND is an admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />; // Send them back to Home if they aren't an admin
    }

    return children;
};

export default AdminRoute;