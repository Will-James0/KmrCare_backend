/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store/index.js";

const LoginDoctor = () => {
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
      navigate('/doctor');
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
      
      // Connexion via l'API avec vérification du rôle médecin
      const user = await login({
        email: formData.email,
        password: formData.password,
        role: 'doctor'
      });
      
      // Vérifier que l'utilisateur est bien un professionnel de santé
      if (user.role !== 'doctor' && user.role !== 'dispensary_manager') {
        notify.error('Ce compte n\'est pas un compte professionnel. Veuillez utiliser le formulaire approprié selon votre profil.');
        return;
      }
      
      // Redirection selon le rôle exact
      if (user.role === 'doctor') {
        navigate('/doctor');
      } else if (user.role === 'dispensary_manager') {
        navigate('/dispensary');
      } else {
        navigate('/admin');
      }
      
    } catch (error) {
      console.error('Erreur lors de la connexion médecin:', error);
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
          <h2 className="text-2xl font-bold text-[#0f425d]">Connexion Médecin</h2>
          <p className="text-gray-600 mt-2">Accédez à votre espace professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="doctor-email" className="block mb-2 text-sm font-medium text-[#0f425d]">
              Email ou nom d&apos;utilisateur
            </label>
            <input
              type="text"
              id="doctor-email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
              placeholder="Votre email ou nom d&apos;utilisateur"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="doctor-password" className="block mb-2 text-sm font-medium text-[#0f425d]">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={formData.showPassword ? 'text' : 'password'}
                id="doctor-password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 pr-12 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
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

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[#0f425d] hover:text-blue-800 font-medium text-sm transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#0f425d] hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Vous n&apos;avez pas de compte professionnel ?{' '}
              <Link
                to="/register-dispensary"
                className="text-[#0f425d] hover:text-blue-800 font-medium transition-colors"
              >
                Inscrivez votre dispensaire
              </Link>
            </p>
            
            <div className="text-sm text-gray-500">
              <p>Vous êtes un patient ou un administrateur ?</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link
                  to="/login-patient"
                  className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
                >
                  Connexion Patient
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/login-admin"
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Connexion Admin
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

export default LoginDoctor;
