import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <p className="text-lg font-medium text-slate-600 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;