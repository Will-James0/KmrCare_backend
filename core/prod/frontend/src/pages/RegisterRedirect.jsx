/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Analyser l'URL pour déterminer la redirection
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');

    // Rediriger selon le paramètre 'type' ou analyser l'URL
    if (type === 'patient') {
      navigate('/register-patient', { replace: true });
    } else if (type === 'doctor' || type === 'dispensary') {
      navigate('/register-doctor', { replace: true });
    } else if (path.includes('/register')) {
      // Si pas de type spécifique, rediriger vers la sélection
      navigate('/register-selection', { replace: true });
    } else {
      // Par défaut, rediriger vers la sélection d'inscription
      navigate('/register-selection', { replace: true });
    }
  }, [navigate, location]);

  // Page de chargement pendant la redirection
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/assets/login.jpeg')` }}
      />
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <img src="/assets/logo.png" alt="KmrCare Logo" className="h-20 w-auto mx-auto" />
        </div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0f425d] mx-auto mb-4"></div>
        <p className="text-[#0f425d] text-lg font-medium">
          Redirection en cours...
        </p>
      </div>
    </div>
  );
};

export default RegisterRedirect;
