import { Navigate, Outlet } from 'react-router';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
