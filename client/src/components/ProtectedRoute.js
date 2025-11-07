import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    // Nếu yêu cầu quyền admin nhưng user không phải admin
    if (requiredRole === 'quan_tri' && user?.vai_tro !== 'quan_tri') {
      return <Navigate to="/" replace />;
    }
    // Nếu yêu cầu quyền staff nhưng user không phải staff hoặc admin
    if (requiredRole === 'nhan_vien' && !['nhan_vien', 'quan_tri'].includes(user?.vai_tro)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;