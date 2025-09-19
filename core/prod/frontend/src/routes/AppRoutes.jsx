/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../_store/auth';

// Pages Admin
import AdminDashboard from '../pages/Admin/AdminDashboard';
import PendingRegistrations from '../pages/Admin/PendingRegistrations';

// Pages Owner (Propriétaire de dispensaire)
import DispensaryOwnerDashboard from '../pages/DispensaryOwnerDashboard';

// Pages Patient
import PatientHistory from '../pages/Patient/PatientHistory';
import PatientDashboard from '../pages/PatientDashboard';
import PatientReservation from '../pages/PatientReservation';

// Pages User (communes)
import UserProfile from '../pages/User/UserProfile';

// Composant de protection des routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex">
            <span className="text-red-400 text-xl mr-3">🚫</span>
            <div>
              <h3 className="text-red-800 font-medium">Accès refusé</h3>
              <p className="text-red-600 text-sm">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes Admin */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="pending-registrations" element={<PendingRegistrations />} />
            </Routes>
          </ProtectedRoute>
        } 
      />

      {/* Routes Owner (Propriétaire de dispensaire) */}
      <Route 
        path="/owner/*" 
        element={
          <ProtectedRoute allowedRoles={['owner', 'dispensary_owner']}>
            <Routes>
              <Route index element={<DispensaryOwnerDashboard />} />
              <Route path="dashboard" element={<DispensaryOwnerDashboard />} />
            </Routes>
          </ProtectedRoute>
        } 
      />

      {/* Routes Patient */}
      <Route 
        path="/patient/*" 
        element={
          <ProtectedRoute allowedRoles={['patient', 'user']}>
            <Routes>
              <Route index element={<PatientDashboard />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="history" element={<PatientHistory />} />
              <Route path="reservation/:dispensaryToken" element={<PatientReservation />} />
            </Routes>
          </ProtectedRoute>
        } 
      />

      {/* Routes User (accessibles à tous les utilisateurs connectés) */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />

      {/* Redirections basées sur le rôle */}
      <Route 
        path="/dashboard" 
        element={<RoleBasedRedirect />} 
      />
    </Routes>
  );
};

// Composant pour rediriger selon le rôle
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'owner':
    case 'dispensary_owner':
      return <Navigate to="/owner" replace />;
    case 'patient':
    case 'user':
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/profile" replace />;
  }
};

export default AppRoutes;
