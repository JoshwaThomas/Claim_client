import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const loggedInUser = localStorage.getItem('username');
  const { username } = useParams(); // get the username from the URL

  if (!token) return <Navigate to="/" />;

  // Check if URL username matches logged-in user
  if (username && username !== loggedInUser) {
    return <Navigate to="/" />; // or "/unauthorized"
  }

  return children;
};

export default ProtectedRoute;
