import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  console.log('ProtectedRoute - Token exists:', !!token);
  console.log('ProtectedRoute - Current path:', window.location.pathname);
  
  if (!token) {
    console.log('ProtectedRoute - No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
