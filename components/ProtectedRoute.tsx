import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../services/apiClient';

const ProtectedRoute: React.FC = () => {
  if (!api.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
