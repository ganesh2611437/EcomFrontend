import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import Unauthorizedaccess from '../Unauthorizedaccess/Unauthorizedaccess';
const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    toast.warn('Login to continue', {
      autoClose: 3000,
    });
    return <Navigate to="/Login" />;
  }
  try {
    const decodedToken = jwtDecode(token);
    if (allowedRoles.includes(decodedToken.userRole)) {
      return <Component />;
    } else {
      return <Unauthorizedaccess/> ;
    }
  } catch (error) {
    console.error('Token is not valid:', error);
    return <Navigate to="/Login" />;
  }
};

export default ProtectedRoute;
