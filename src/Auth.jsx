import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function Auth() {


    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/signin" />;
    }

    return <Outlet />


}

export default Auth