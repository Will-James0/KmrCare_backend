/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store/index.js";

const LoginAdmin = () => {
  const navigate = useNavigate();
  
  // Store d'authentification
  const { login } = useAuthActions();
  const { isLoading, isAuthenticated } = useAuthState();
  const notify = useNotify();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Gestion des changements d'input
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      // Validation des champs requis
      if (!formData.email || !formData.password) {
        notify.error('Veuillez remplir tous les champs');
        return;
      }
      
      // Connexion via l'API avec vérification du rôle admin
      const user = await login({
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });
      
      // Vérifier que l'utilisateur est bien un administrateur
      if (user.role !== 'admin' && user.role !== 'superuser') {
        notify.error('Ce compte n\'a pas les privilèges administrateur requis.');
        return;
      }
      
      // Redirection vers l'espace admin
      navigate('/admin');
      
    } catch (error) {
      console.error('Erreur lors de la connexion admin:', error);
    }
  };

  // Bouton de retour
  const BackButton = () => (
    <motion.button
      onClick={() => navigate('/auth')}
      className="absolute top-4 left-4 z-20 w-10 h-10 bg-white border rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.02, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <svg className="w-5 h-5 text-[#0f425d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center p-4 relative">
      <BackButton />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h2 className="text-2xl font-bold text-[#0b9444]">Connexion Administrateur</h2>
          <p className="text-gray-600 mt-2">Accès sécurisé à l&apos;administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block mb-2 text-sm font-medium text-[#0b9444]">
              Email ou nom d&apos;utilisateur
            </label>
            <input
              type="text"
              id="admin-email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 text-[#0f425d] border rounded-lg transition-colors"
              placeholder="admin@kmrcare.com ou nom d'utilisateur"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block mb-2 text-sm font-medium text-[#0b9444]">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={formData.showPassword ? 'text' : 'password'}
                id="admin-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mot de passe sécurisé"
                className="w-full px-4 py-3 pr-12 text-[#0f425d] border rounded-lg transition-colors"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => handleInputChange('showPassword', !formData.showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
              >
                {formData.showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-orange-800">Accès Restreint</h4>
                <p className="text-xs text-orange-700 mt-1">
                  Cet espace est réservé aux administrateurs autorisés de KmrCare.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'border border-[#0b9444] hover:bg-[#0b9444] hover:text-white text-[#0b9444] font-bold shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Vérification...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Accéder à l&apos;administration
              </div>
            )}
          </button>

          <div className="text-center space-y-3">
            <div className="text-sm text-gray-500">
              <p>Vous n&apos;êtes pas un administrateur ?</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link
                  to="/login-patient"
                  className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
                >
                  Connexion Patient
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/login-doctor"
                  className="text-[#0f425d] hover:text-blue-800 font-medium transition-colors"
                >
                  Connexion Médecin
                </Link>
              </div>
            </div>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          © KmrCare@2025. Tous droits réservés
        </p>
      </motion.div>
    </div>
  );
};

export default LoginAdmin;
