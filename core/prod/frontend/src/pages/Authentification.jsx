/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth, useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store";
import AuthSelection from "./AuthSelection.jsx";

const Authentification = () => {
  // Navigation React Router
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store d'authentification
  const { login, register, logout } = useAuthActions();
  const { isLoading, isAuthenticated } = useAuthState();
  const notify = useNotify();
  
  // Déterminer la page initiale basée sur la route
  const getInitialPage = () => {
    const path = location.pathname;
    if (path === '/register-patient') return 'register-patient';
    if (path === '/register-dispensary') return 'register-dispensary';
    if (path === '/auth') return 'auth-selection';
    return 'auth-selection';
  };
  
  // États pour la gestion des pages et formulaires
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageHistory, setPageHistory] = useState([getInitialPage()]);
  const [formData, setFormData] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);

   

  //Gestion des Input de mot de passe
  const PasswordInput = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez votre mot de passe"
          style={{ paddingRight: '40px' }}
          className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
        />
        <button
        type="button"
        onClick={togglePasswordVisibility}
        style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#666',
          }}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </button>
      </div>
    );
  };
  
  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && currentPage === 'auth-selection') {
      navigate('/admin'); // ou page appropriée selon le rôle
    }
  }, [isAuthenticated, navigate, currentPage]);

  // Données du carrousel médical
  const carouselData = [
    {
      img: '/ico.png',
      text: 'KmrCare relie les patients aux meilleurs professionnels de santé du Cameroun, facilitant l\'accès aux soins où que vous soyez.',
      bgColor: '#0f425d'
    }
  ];

  // Navigation entre les pages - Version optimisée
  const navigateTo = useCallback((pageId, pushToHistory = true) => {
    setCurrentPage(pageId);
    if (pushToHistory) {
      if (pageId === 'landing') {
        setPageHistory(['landing']);
      } else {
        setPageHistory(prev => {
          const lastPage = prev[prev.length - 1];
          if (pageId !== lastPage) {
            return [...prev, pageId];
          }
          return prev;
        });
      }
    }
  }, []);
  
  //Retour page precedente - Version optimisée
  const goBack = useCallback(() => {
    setPageHistory(prev => {
      if (prev.length > 1) {
        const newHistory = [...prev];
        newHistory.pop();
        const prevPage = newHistory[newHistory.length - 1];
        setCurrentPage(prevPage);
        return newHistory;
      }
      return prev;
    });
  }, []);

  // Gestion simple des formulaires (frontend uniquement) - Version optimisée
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      // Éviter les re-rendus inutiles si la valeur n'a pas changé
      if (prev[field] === value) {
        return prev;
      }
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  // Alias pour la compatibilité
  const updateFormData = useCallback((field, value) => {
    handleInputChange(field, value);
  }, [handleInputChange]);

  // Composant optimisé pour les champs de saisie
  const OptimizedInput = React.memo(({ 
    type = "text", 
    field, 
    placeholder, 
    required = false, 
    className = "w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors",
    disabled = false,
    ...props 
  }) => {
    const value = formData[field] || '';
    
    const handleChange = useCallback((e) => {
      updateFormData(field, e.target.value);
    }, [field]);

    return (
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled || isLoading}
        className={className}
        {...props}
      />
    );
  });

  // Composant optimisé pour les textarea
  const OptimizedTextarea = React.memo(({ 
    field, 
    placeholder, 
    rows = 3,
    className = "w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:ring-[#159eec] focus:border-[#159eec] transition-colors",
    ...props 
  }) => {
    const value = formData[field] || '';
    
    const handleChange = useCallback((e) => {
      updateFormData(field, e.target.value);
    }, [field]);

    return (
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={isLoading}
        className={className}
        {...props}
      />
    );
  });

  // Gestion de la soumission des formulaires avec API backend
  const handleSubmit = async (formType, role = null) => {
    // Prévenir la soumission multiple
    if (isLoading) return;
    
    try {
      switch(formType) {
        case 'login-patient': {
          // Validation des champs requis pour connexion patient
          if (!formData.email || !formData.password) {
            notify.error('Veuillez remplir tous les champs');
            return;
          }
          
          // Connexion via l'API avec vérification du rôle patient
          const user = await login({
            email: formData.email,
            password: formData.password,
            role: 'patient' // Spécifier que c'est une connexion patient
          });
          
          // Vérifier que l'utilisateur est bien un patient
          if (user.role !== 'patient') {
            notify.error('Ce compte n\'est pas un compte patient. Utilisez le bouton "Connexion Médecin" si vous êtes un professionnel de santé.');
            return;
          }
          
          // Redirection vers l'espace patient
          navigate('/patient');
          break;
        }
          
        case 'login-doctor': {
          // Validation des champs requis pour connexion médecin
          if (!formData.email || !formData.password) {
            notify.error('Veuillez remplir tous les champs');
            return;
          }
          
          // Connexion via l'API avec vérification du rôle médecin
          const user = await login({
            email: formData.email,
            password: formData.password,
            role: 'doctor' // Spécifier que c'est une connexion médecin
          });
          
          // Vérifier que l'utilisateur est bien un médecin
          if (user.role !== 'doctor' && user.role !== 'dispensary_manager') {
            notify.error('Ce compte n\'est pas un compte professionnel. Utilisez le bouton "Connexion Patient" si vous êtes un patient.');
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
          break;
        }
          
        case 'login-admin': {
          // Validation des champs requis pour connexion admin
          if (!formData.email || !formData.password) {
            notify.error('Veuillez remplir tous les champs');
            return;
          }
          
          // Connexion via l'API avec vérification du rôle admin
          const user = await login({
            email: formData.email,
            password: formData.password,
            role: 'admin' // Spécifier que c'est une connexion admin
          });
          
          // Redirection vers l'espace admin
          navigate('/admin');
          break;
        }
          
        case 'register-patient': {
          // Validation des champs requis pour inscription patient
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
            date_of_birth: formData.date_of_birth,
            gender: formData.gender || 'other',
            role: 'patient'
          });
          
          notify.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          navigate('/patient');
          break;
        }
          
        case 'register-dispensary': {
          // Validation des champs requis pour demande d'inscription dispensaire
          if (!formData.dispensary_name || !formData.manager_first_name || !formData.manager_last_name || 
              !formData.email || !formData.password || !formData.address || !formData.phone) {
            notify.error('Veuillez remplir tous les champs obligatoires');
            return;
          }
          
          if (formData.password !== formData.confirmPassword) {
            notify.error('Les mots de passe ne correspondent pas');
            return;
          }
          
          // Envoi de la demande d'inscription dispensaire à l'administrateur
          await register({
            // Informations du responsable
            manager_first_name: formData.manager_first_name,
            manager_last_name: formData.manager_last_name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            phone: formData.phone,
            
            // Informations du dispensaire
            dispensary_name: formData.dispensary_name,
            dispensary_type: formData.dispensary_type,
            dispensary_address: formData.address,
            dispensary_phone: formData.dispensary_phone || formData.phone,
            dispensary_email: formData.dispensary_email,
            dispensary_description: formData.description || '',
            
            // Indicateur du type d'inscription
            registration_type: 'dispensary_request'
          });
          
          // Navigation vers la page de confirmation
          navigateTo('register-dispensary-confirm');
          notify.success('Votre demande d\'inscription a été envoyée avec succès ! Un administrateur va l\'examiner.');
          break;
        }
          
        default:
          notify.error('Action non reconnue');
          break;
      }
    } catch (error) {
      // L'erreur est déjà gérée par le service API et affichée via notify
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Composant de bouton de retour
  const BackButton = () => (
    <motion.button
      onClick={goBack}
      className={`absolute top-4 left-4 z-20 w-10 h-10 bg-white border  rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 ${
        pageHistory.length <= 1 || currentPage === 'landing' || currentPage === 'register-dispensary-confirm' ? 'hidden' : 'flex'
      }`}
      whileHover={{ scale: 1.02, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <svg className="w-5 h-5 text-[#0f425d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
    </motion.button>
  );

  // Page d'accueil / Landing
  const LandingPage = () => (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/assets/login.jpeg')` }}
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div>
          <Link to="/" className="inline-block mb-8">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-20 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f425d] mb-12 leading-tight">
            BIENVENUE SUR KmrCare<br />
            <span className="text-[#0b9444]">LA PLUS GRANDE COMMUNAUTÉ DE SOINS AU CAMEROUN</span>
          </h1>
        </div>

        <motion.div
          initial={{ y: -5, opacity: 0}}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
            <h3 className="text-2xl font-bold text-[#0b9444] mb-4">PATIENT</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Vous recherchez des soins au plus vite? Pas de panique, nous sommes là pour vous !
            </p>
            <button
              onClick={() => navigateTo('register-patient')}
              className="w-full py-3 bg-[#0b9444] text-white font-semibold rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200"
            >
              Je m&apos;inscris
            </button>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
            <h3 className="text-2xl font-bold text-[#0f425d] mb-4">Dispensaires</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Rejoignez l&apos;équipe KmrCare, et vous aussi, participez à sauver des vies plus efficacement
            </p>
            <button
              onClick={() => navigateTo('register-dispensary')}
              className="w-full py-3 bg-[#0f425d] text-white font-semibold rounded-lg hover:bg-[#0a2a3a] transition-colors duration-200"
            >
              Rejoignez-nous
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.7 }}
          className="text-gray-600 mt-12 text-sm"
        >
          © KmrCare@2025. Tous droits réservés
        </motion.p>
      </div>
    </div>
  );

  // Page de sélection du type d'authentification
  const AuthSelectionPage = () => <AuthSelection />;

  // Page d'inscription patient
  const RegisterPatientPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center p-4 relative">
      <BackButton />
      
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0f425d]">Votre profil en trois étapes</h1>
        </div>

        <form onSubmit={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          return false;
        }} className="space-y-8">
          {/* Étape 1 - Identification */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">1</span>
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
                  value={formData.last_name || ''}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Votre nom de famille"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Prénoms*</label>
                <input
                  type="text"
                  value={formData.first_name || ''}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Vos prénoms"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Nom d&apos;utilisateur*</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => updateFormData('username', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Votre nom d'utilisateur"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">E-mail*</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="votre.email@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Créer un mot de passe*</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Mot de passe sécurisé"
                    style={{ paddingRight: '40px' }}
                    className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => updateFormData('showPassword', !formData.showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#666',
                    }}
                    disabled={isLoading}
                  >
                    {formData.showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Confirmer le mot de passe*</label>
                <input
                  type="password"
                  value={formData.confirmPassword || ''}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Étape 2 - Règlementation */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Règlementation</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bienvenue sur KmrCare, votre plateforme de prise de rendez-vous en ligne... En utilisant nos services, vous acceptez les présentes conditions. Veuillez les lire attentivement.
            </p>
          </div>

          <hr />

          {/* Étape 3 - Informations supplémentaires */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">3</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations supplémentaires</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Comment avez-vous connu KmrCare?</label>
                <select 
                  value={formData.discovery_source || ''}
                  onChange={(e) => updateFormData('discovery_source', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit('register-patient')}
            disabled={isLoading}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-[#0b9444] hover:bg-[#0a7c3a] text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Inscription en cours...
              </div>
            ) : (
              'Je m\'inscris'
            )}
          </button>

          <p className="text-center text-gray-600">
            Vous avez déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('auth-selection')}
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
            >
              Connectez-vous
            </button>
          </p>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          © KmrCare@2025. Tous droits réservés
        </p>
      </div>
    </div>
  );

  // Page d'inscription dispensaire
  const RegisterDispensaryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center p-4 relative">
      <BackButton />
      
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0f425d]">Votre profil en trois étapes</h1>
        </div>

        <form onSubmit={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          return false;
        }} className="space-y-8">
          {/* Étape 1 - Responsable */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations du Responsable du Compte</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Inscrivez votre dispensaire sur KmrCare pour offrir à vos patients un moyen simple et moderne de prendre rendez-vous.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Noms*</label>
                <OptimizedInput
                  field="manager_last_name"
                  placeholder="Nom du responsable"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Prénoms*</label>
                <OptimizedInput
                  field="manager_first_name"
                  placeholder="Prénoms du responsable"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">E-mail*</label>
                <OptimizedInput
                  type="email"
                  field="email"
                  placeholder="email.professionnel@exemple.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone*</label>
                <OptimizedInput
                  type="tel"
                  field="phone"
                  placeholder="+237 6XX XXX XXX"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Créer un mot de passe*</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={formData.showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Mot de passe sécurisé"
                    style={{ paddingRight: '40px' }}
                    className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => updateFormData('showPassword', !formData.showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#666',
                    }}
                    disabled={isLoading}
                  >
                    {formData.showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Confirmer votre mot de passe*</label>
                <input
                  type="password"
                  value={formData.confirmPassword || ''}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Étape 2 - Informations Dispensaire */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Informations Générales du Dispensaire</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Nom Officiel du Dispensaire*</label>
                <OptimizedInput
                  field="dispensary_name"
                  placeholder="Nom officiel du dispensaire"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Quartier*</label>
                <OptimizedInput
                  field="quarter"
                  placeholder="Quartier où se trouve le dispensaire"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Adresse Complète*</label>
                <OptimizedInput
                  field="address"
                  placeholder="Adresse complète du dispensaire"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Téléphone du Dispensaire*</label>
                <OptimizedInput
                  type="tel"
                  field="dispensary_phone"
                  placeholder="+237 6XX XXX XXX"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Email du Dispensaire*</label>
                <OptimizedInput
                  type="email"
                  field="dispensary_email"
                  placeholder="contact@dispensaire.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Logo du Dispensaire</label>
                <input
                  type="file"
                  onChange={(e) => updateFormData('logo', e.target.files[0])}
                  className="w-full px-4 py-3 bg-[#4356617e] rounded-lg focus:border-[#4356614d] transition-colors"
                  accept="image/*"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Horaires d&apos;Ouverture*</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Horaires de Fermeture*</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Étape 3 - Services */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-[#0f425d] text-white rounded-full flex items-center justify-center font-bold">3</span>
              <h2 className="text-xl font-bold text-[#0f425d]">Services et Spécialités Proposés</h2>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Lister les principaux types de consultations offertes pour faciliter la recherche par les patients.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Description*</label>
                <OptimizedTextarea
                  field="description"
                  placeholder="Description des services offerts..."
                  rows="3"
                />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="disp-certify" 
                  checked={formData.acceptCertification || false}
                  onChange={(e) => updateFormData('acceptCertification', e.target.checked)}
                  required 
                  className="mt-1" 
                  disabled={isLoading}
                />
                <label htmlFor="disp-certify" className="text-sm text-gray-700">
                  Je certifie que les informations fournies sont exactes et que je suis autorisé(e) à inscrire ce dispensaire.
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit('register-dispensary')}
            disabled={isLoading || !formData.acceptCertification}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading || !formData.acceptCertification
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-[#0b9444] hover:bg-[#0a7c3a] text-white'
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

          <p className="text-center text-gray-600">
            Vous avez déjà un compte ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('auth-selection')}
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
            >
              Connectez-vous
            </button>
          </p>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          © KmrCare@2025. Tous droits réservés
        </p>
      </div>
    </div>
  );

  // Page de confirmation dispensaire
  const RegisterDispensaryConfirmPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551192422-6ea7bd54a7a8?q=80&w=2070&auto=format&fit=crop')` }}
      />
      
      <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur rounded-xl shadow-xl p-8 text-center">
        <Link to="/">
          <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
        </Link>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-[#0f425d] mb-4">
          Demande Envoyée !
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Votre demande d&apos;inscription a été envoyée avec succès à notre équipe d&apos;administration. 
          Nous examinerons votre dossier dans les plus brefs délais et vous contacterons par email 
          pour vous informer de la suite.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#0f425d] mb-2">Prochaines étapes :</h3>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• Vérification de vos informations par notre équipe</li>
            <li>• Validation de votre dispensaire</li>
            <li>• Création de votre compte professionnel</li>
            <li>• Email de confirmation avec vos accès</li>
          </ul>
        </div>
        
        <button
          onClick={() => navigateTo('auth-selection')}
          className="w-full py-3 bg-[#0b9444] text-white font-semibold rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200"
        >
          Retour à la connexion
        </button>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          © KmrCare@2025. Tous droits réservés
        </p>
      </div>
    </div>
  );

  // Rendu principal basé sur la page actuelle
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth-selection':
        return <AuthSelectionPage />;
      case 'register-patient':
        return <RegisterPatientPage />;
      case 'register-dispensary':
        return <RegisterDispensaryPage />;
      case 'register-dispensary-confirm':
        return <RegisterDispensaryConfirmPage />;
      default:
        return <AuthSelectionPage />;
    }
  };

  return (
    <div className="font-poppins">
      <AnimatePresence mode="wait">
        <div>
          {renderCurrentPage()}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default Authentification;
