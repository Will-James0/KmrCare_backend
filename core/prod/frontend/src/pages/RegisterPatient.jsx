/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store";

const RegisterPatient = () => {
  const navigate = useNavigate();
  
  // Store d'authentification
  const { register } = useAuthActions();
  const { isLoading, isAuthenticated } = useAuthState();
  const notify = useNotify();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    discovery_source: '',
    showPassword: false
  });

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/patient');
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
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
        notify.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        notify.error('Les mots de passe ne correspondent pas');
        return;
      }

      // Inscription via l'API comme patient
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone || '',
        gender: formData.gender || 'other',
        discovery_source: formData.discovery_source,
        role: 'patient'
      });
      
      notify.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login-patient');
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription patient:', error);
    }
  };

  // Bouton de retour
  const BackButton = () => (
    <motion.button
      onClick={() => navigate('/register-selection')}
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
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[90vh]"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0f425d]">Inscription Patient</h1>
          <p className="text-gray-600 mt-2">Créez votre compte pour accéder aux soins</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Étape 1 - Identification */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0b9444] text-white rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Identification</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Cette identification est obligatoire conformément à la réglementation de KmrCare. Vos données sont sécurisées.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Noms*</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="Votre nom de famille"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Prénoms*</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="Vos prénoms"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Nom d&apos;utilisateur*</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="Votre nom d'utilisateur"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">E-mail*</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="votre.email@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Créer un mot de passe*</label>
                <div className="relative">
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mot de passe sécurisé"
                    className="w-full px-4 py-3 pr-12 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
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
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Confirmer le mot de passe*</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 2 - Informations supplémentaires */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0b9444] text-white rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations supplémentaires</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Ces informations nous aident à mieux vous servir (optionnel).
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Genre</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Sélectionnez votre genre</option>
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Comment avez-vous connu KmrCare?</label>
                <select 
                  value={formData.discovery_source}
                  onChange={(e) => handleInputChange('discovery_source', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#0b9444] focus:ring-2 focus:ring-[#0b9444] focus:ring-opacity-20 transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Recommandation">Recommandation d&apos;un ami</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-[#0b9444] hover:bg-[#0a7c3a] text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Inscription en cours...
              </div>
            ) : (
              'Créer mon compte patient'
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login-patient"
                className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
              >
                Connectez-vous
              </Link>
            </p>
            
            <div className="text-sm text-gray-500">
              <p>Vous êtes un professionnel de santé ?</p>
              <Link
                to="/register-doctor"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Inscription Dispensaire
              </Link>
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

export default RegisterPatient;
