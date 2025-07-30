import React from 'react';
import { useAuthState } from '../_store/auth.js';

// Composant de débogage pour vérifier les données du store
const AuthDebugger = () => {
  const { 
    user, 
    getDispensaryToken, 
    getDispensary,
    getDispensaryName,
    getDispensaryLogo 
  } = useAuthState();

  const dispensaryToken = getDispensaryToken();
  const dispensary = getDispensary();
  const dispensaryName = getDispensaryName();
  const dispensaryLogo = getDispensaryLogo();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="font-bold text-yellow-800 mb-2">🔍 Debug Auth Store</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>User:</strong> {user ? `${user.first_name} ${user.last_name}` : 'Non connecté'}
        </div>
        <div>
          <strong>User role:</strong> {user?.role || 'N/A'}
        </div>
        <div>
          <strong>Is owner:</strong> {user?.is_owner ? 'Oui' : 'Non'}
        </div>
        <div>
          <strong>Dispensary Token:</strong> {dispensaryToken || 'NULL'}
        </div>
        <div>
          <strong>Dispensary Name:</strong> {dispensaryName || 'NULL'}
        </div>
        <div>
          <strong>Dispensary Logo:</strong> {dispensaryLogo || 'NULL'}
        </div>
        <div>
          <strong>Dispensary Object:</strong> 
          <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
            {JSON.stringify(dispensary, null, 2)}
          </pre>
        </div>
        <div>
          <strong>Full User Object:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;
