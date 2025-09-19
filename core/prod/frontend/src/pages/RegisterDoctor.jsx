/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store";

const RegisterDoctor = () => {
  const navigate = useNavigate();
  
  // Store d'authentification
  const { register } = useAuthActions();
  const { isLoading, isAuthenticated } = useAuthState();
  const notify = useNotify();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    // Informations du responsable
    manager_first_name: '',
    manager_last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    
    // Informations du dispensaire
    dispensary_name: '',
    quarter: '',
    address: '',
    dispensary_phone: '',
    dispensary_email: '',
    logo: null,
    opening_time: '',
    closing_time: '',
    description: '',
    
    // Conditions
    acceptCertification: false
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
      if (!formData.dispensary_name || !formData.manager_first_name || !formData.manager_last_name || 
          !formData.email || !formData.password || !formData.address || !formData.phone) {
        notify.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        notify.error('Les mots de passe ne correspondent pas');
        return;
      }

      // Vérification des conditions

      if (!formData.acceptCertification) {
        notify.error('Vous devez certifier l\'exactitude des informations');
        return;
      }
      
      // Envoi de la demande d'inscription dispensaire
      await register({
        // Informations du responsable (correspondent au serializer backend)
        first_name: formData.manager_first_name,
        last_name: formData.manager_last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        
        // Informations du dispensaire (correspondent au serializer backend)
        dispensary_name: formData.dispensary_name,
        dispensary_specialities: formData.description || '',
        dispensary_localisation: formData.address,
        dispensary_phone: formData.dispensary_phone || formData.phone,
        dispensary_email: formData.dispensary_email,
        dispensary_quarter: formData.quarter,
        dispensary_opening: formData.opening_time,
        dispensary_ending: formData.closing_time,
        logo: formData.logo,
        
        // Indicateur du type d'inscription
        registration_type: 'dispensary_request'
      });
      
      // Navigation vers la page de confirmation avec les données
      navigate('/register-doctor-confirm', {
        state: {
          registrationData: {
            dispensaryName: formData.dispensary_name,
            managerFirstName: formData.manager_first_name,
            managerLastName: formData.manager_last_name,
            email: formData.email,
            phone: formData.phone
          }
        }
      });
      notify.success('Votre demande d\'inscription a été envoyée avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription dispensaire:', error);
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
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[90vh]"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0f425d]">Inscription Dispensaire</h1>
          <p className="text-gray-600 mt-2">Rejoignez le réseau KmrCare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Étape 1 - Responsable */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations du Responsable</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Inscrivez votre dispensaire sur KmrCare pour offrir à vos patients un moyen simple et moderne de prendre rendez-vous.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Noms*</label>
                <input
                  type="text"
                  value={formData.manager_last_name}
                  onChange={(e) => handleInputChange('manager_last_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Nom du responsable"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Prénoms*</label>
                <input
                  type="text"
                  value={formData.manager_first_name}
                  onChange={(e) => handleInputChange('manager_first_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Prénoms du responsable"
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
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="email.professionnel@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone*</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Créer un mot de passe*</label>
                <div className="relative">
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mot de passe sécurisé"
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
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Confirmer le mot de passe*</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 2 - Informations Dispensaire */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations du Dispensaire</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Nom Officiel du Dispensaire*</label>
                <input
                  type="text"
                  value={formData.dispensary_name}
                  onChange={(e) => handleInputChange('dispensary_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Nom officiel du dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Quartier*</label>
                <input
                  type="text"
                  value={formData.quarter}
                  onChange={(e) => handleInputChange('quarter', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Quartier où se trouve le dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Logo du Dispensaire</label>
                <input
                  type="file"
                  onChange={(e) => handleInputChange('logo', e.target.files[0])}
                  className="w-full px-4 py-3 bg-gray-50 border rounded-lg border-black text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Adresse Complète*</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="Adresse complète du dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Téléphone du Dispensaire</label>
                <input
                  type="tel"
                  value={formData.dispensary_phone}
                  onChange={(e) => handleInputChange('dispensary_phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Email du Dispensaire</label>
                <input
                  type="email"
                  value={formData.dispensary_email}
                  onChange={(e) => handleInputChange('dispensary_email', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  placeholder="contact@dispensaire.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Horaires d&apos;Ouverture*</label>
                <input
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) => handleInputChange('opening_time', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Horaires de Fermeture*</label>
                <input
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) => handleInputChange('closing_time', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Étape 3 - Services et Conditions */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Services et Conditions</h2>
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-[#0f425d]">Spécialités du Dispensaire</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez les spécialités et services offerts par votre dispensaire...(ex: Médecine générale, Pédiatrie, Gynécologie)"
                rows="4"
                className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="doctor-certify" 
                  checked={formData.acceptCertification}
                  onChange={(e) => handleInputChange('acceptCertification', e.target.checked)}
                  required 
                  className="mt-1" 
                  disabled={isLoading}
                />
                <label htmlFor="doctor-certify" className="text-sm text-gray-700">
                  Je certifie que les informations fournies sont exactes et que je suis autorisé(e) à inscrire ce dispensaire.*
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.acceptCertification}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading || !formData.acceptCertification
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Soumission en cours...
              </div>
            ) : (
              'Soumettre ma demande d\'inscription'
            )}
          </button>

          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login-doctor"
                className="text-[#0f425d] hover:text-blue-800 font-medium transition-colors"
              >
                Connectez-vous
              </Link>
            </p>
            
            <div className="text-sm text-gray-500">
              <p>Vous êtes un patient ?</p>
              <Link
                to="/register-patient"
                className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
              >
                Inscription Patient
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

export default RegisterDoctor;
