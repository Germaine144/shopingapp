import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "../components/../context/AuthContext";

/**
 * AdminRoute component - Protects routes that require admin access
 * Only allows users with role='admin' to access
 */
const AdminRoute = ({ children }) => {
  const { user, isLoggedIn, loading } = useContext(AuthContext);

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

  // Not logged in - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin - redirect to home with message
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // User is admin - allow access
  return children;
};

export default AdminRoute;