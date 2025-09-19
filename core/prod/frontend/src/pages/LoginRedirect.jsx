/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthState } from "../_store/auth.js";

const LoginRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthState();
  
  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard approprié
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Vérifier s'il y a un paramètre de type dans l'URL
    const userType = searchParams.get('type');
    
    switch (userType) {
      case 'patient':
        navigate('/login-patient');
        break;
      case 'doctor':
      case 'medecin':
        navigate('/login-doctor');
        break;
      case 'admin':
      case 'administrateur':
        navigate('/login-admin');
        break;
      default:
        // Si aucun type spécifié, aller à la page de sélection
        navigate('/auth');
        break;
    }
  }, [navigate, searchParams, isAuthenticated]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b9444] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default LoginRedirect;
