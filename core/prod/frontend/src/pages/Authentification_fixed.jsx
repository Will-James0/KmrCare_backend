/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth, useAuthActions, useAuthState } from "../_store/auth.js";
import { useNotify } from "../_store";

const Authentification = () => {
  // Navigation React Router
  const navigate = useNavigate();
  
  // Store d'authentification
  const { login, register, logout } = useAuthActions();
  const { isLoading, isAuthenticated } = useAuthState();
  const notify = useNotify();
  
  // États pour la gestion des pages et formulaires
  const [currentPage, setCurrentPage] = useState('login');
  const [pageHistory, setPageHistory] = useState(['login']);
  const [formData, setFormData] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin'); // ou page appropriée selon le rôle
    }
  }, [isAuthenticated, navigate]);

  // Données du carrousel médical
  const carouselData = [
    {
      img: '/ico.png',
      text: 'KmrCare relie les patients aux meilleurs professionnels de santé du Cameroun, facilitant l\'accès aux soins où que vous soyez.',
      bgColor: '#0f425d'
    }
  ];

  // Navigation entre les pages
  const navigateTo = (pageId, pushToHistory = true) => {
    setCurrentPage(pageId);
    if (pushToHistory) {
      if (pageId === 'landing') {
        setPageHistory(['landing']);
      } else if (pageId !== pageHistory[pageHistory.length - 1]) {
        setPageHistory(prev => [...prev, pageId]);
      }
    }
  };
  
  //Retour page precedente
  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const prevPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(prevPage);
    }
  };

  // Gestion simple des formulaires (frontend uniquement)
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Alias pour la compatibilité
  const updateFormData = handleInputChange;

  // Gestion de la soumission des formulaires avec API backend
  const handleSubmit = async (formType, role = null) => {
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

          // Vérification des conditions d'utilisation
          if (!formData.acceptTerms) {
            notify.error('Vous devez accepter les conditions d\'utilisation pour vous inscrire');
            return;
          }
          
          // Inscription via l'API comme patient
          await register({
            first_name: formData.first_name,
            last_name: formData.last_name,
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

          // Vérification des conditions d'utilisation, politique de confidentialité et certification
          if (!formData.acceptTerms) {
            notify.error('Vous devez accepter les conditions d\'utilisation');
            return;
          }

          if (!formData.acceptPrivacy) {
            notify.error('Vous devez accepter la politique de confidentialité');
            return;
          }

          if (!formData.acceptCertification) {
            notify.error('Vous devez certifier l\'exactitude des informations');
            return;
          }
          
          // Envoi de la demande d'inscription dispensaire à l'administrateur
          await register({
            // Informations du responsable
            first_name: formData.manager_first_name,
            last_name: formData.manager_last_name,
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
            
            // Statut en attente de validation
            role: 'dispensary_manager',
            status: 'pending', // En attente de validation admin
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

  // Page de connexion
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex justify-center items-center p-4 relative">
      <BackButton />
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto mb-6" />
          </Link>
          <h2 className="text-2xl font-bold text-[#0f425d]">Se Connecter</h2>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
          <div>
            <label htmlFor="login-email" className="block mb-2 text-sm font-medium text-[#0f425d]">
              Email
            </label>
            <input
              type="email"
              id="login-email"
              value={formData.email || ''}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
              placeholder="Votre adresse email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block mb-2 text-sm font-medium text-[#0f425d]">
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={formData.showPassword ? 'text' : 'password'}
                id="login-password"
                value={formData.password || ''}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Entrez votre mot de passe"
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

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigateTo('forgot-password-email')}
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium text-sm transition-colors cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div className="flex col-2 gap-4">
            <button
              type="button"
              onClick={() => handleSubmit('login-patient')}
              disabled={isLoading}
              className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0b9444] hover:bg-[#0a7c47] text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Connexion Patient'
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('login-doctor')}
              disabled={isLoading}
              className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-secondary hover:bg-blue-800 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Connexion Médecin'
              )}
            </button>
          </div>

          <p className="text-center text-gray-600">
            Vous n&apos;avez pas de compte ?{' '}
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors cursor-pointer"
            >
              Inscrivez-vous
            </button>
          </p>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          © KmrCare@2025. Tous droits réservés
        </p>
      </div>
    </div>
  );

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

        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-8">
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
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone*</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  required
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

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="patient-cgu" 
                  checked={formData.acceptTerms || false}
                  onChange={(e) => updateFormData('acceptTerms', e.target.checked)}
                  required 
                  className="mt-1" 
                  disabled={isLoading}
                />
                <label htmlFor="patient-cgu" className="text-sm text-gray-700">
                  J&apos;ai lu et j&apos;accepte les{' '}
                  <button type="button" className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors">
                    Conditions générales de KmrCare
                  </button>
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit('register-patient')}
            disabled={isLoading || !formData.acceptTerms}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading || !formData.acceptTerms
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
              onClick={() => navigateTo('login')}
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

        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-8">
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
                <input
                  type="text"
                  value={formData.manager_last_name || ''}
                  onChange={(e) => updateFormData('manager_last_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Nom du responsable"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Prénoms*</label>
                <input
                  type="text"
                  value={formData.manager_first_name || ''}
                  onChange={(e) => updateFormData('manager_first_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Prénoms du responsable"
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
                  placeholder="email.professionnel@exemple.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Numéro de téléphone*</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  required
                  disabled={isLoading}
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
                <input
                  type="text"
                  value={formData.dispensary_name || ''}
                  onChange={(e) => updateFormData('dispensary_name', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Nom officiel du dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Type de dispensaire*</label>
                <input
                  type="text"
                  value={formData.dispensary_type || ''}
                  onChange={(e) => updateFormData('dispensary_type', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Ex: Centre de santé, Clinique..."
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Quartier*</label>
                <input
                  type="text"
                  value={formData.quartier || ''}
                  onChange={(e) => updateFormData('quartier', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Quartier où se trouve le dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Adresse Complète*</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="Adresse complète du dispensaire"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Téléphone du Dispensaire*</label>
                <input
                  type="tel"
                  value={formData.dispensary_phone || ''}
                  onChange={(e) => updateFormData('dispensary_phone', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="+237 6XX XXX XXX"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Email du Dispensaire*</label>
                <input
                  type="email"
                  value={formData.dispensary_email || ''}
                  onChange={(e) => updateFormData('dispensary_email', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  placeholder="contact@dispensaire.com"
                  required
                  disabled={isLoading}
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
                  value={formData.opening_hours || ''}
                  onChange={(e) => updateFormData('opening_hours', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:border-[#4356614d] transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Horaires de Fermeture*</label>
                <input
                  type="time"
                  value={formData.closing_hours || ''}
                  onChange={(e) => updateFormData('closing_hours', e.target.value)}
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
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Services/Consultations Offerts</label>
                <select 
                  value={formData.services || ''}
                  onChange={(e) => updateFormData('services', e.target.value)}
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
                  required
                  disabled={isLoading}
                >
                  <option value="">Sélectionnez un service</option>
                  <option value="Consultation Générale">Consultation Générale</option>
                  <option value="Pédiatrie">Pédiatrie</option>
                  <option value="Gynécologie">Gynécologie</option>
                  <option value="Dermatologie">Dermatologie</option>
                  <option value="Cardiologie">Cardiologie</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#0f425d]">Description (optionnel)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 text-[#0f425d] border rounded-lg focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
                  placeholder="Description des services offerts..."
                  disabled={isLoading}
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
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="disp-cgu" 
                  checked={formData.acceptTerms || false}
                  onChange={(e) => updateFormData('acceptTerms', e.target.checked)}
                  required 
                  className="mt-1" 
                  disabled={isLoading}
                />
                <label htmlFor="disp-cgu" className="text-sm text-gray-700">
                  J&apos;ai lu et j&apos;accepte les{' '}
                  <button type="button" className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors">
                    Conditions générales de KmrCare
                  </button>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="disp-privacy" 
                  checked={formData.acceptPrivacy || false}
                  onChange={(e) => updateFormData('acceptPrivacy', e.target.checked)}
                  required 
                  className="mt-1" 
                  disabled={isLoading}
                />
                <label htmlFor="disp-privacy" className="text-sm text-gray-700">
                  J&apos;accepte la{' '}
                  <button type="button" className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors">
                    Politique de confidentialité
                  </button>
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit('register-dispensary')}
            disabled={isLoading || !formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptCertification}
            className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-[1.01] text-lg ${
              isLoading || !formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptCertification
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
              onClick={() => navigateTo('login')}
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
          onClick={() => navigateTo('login')}
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
      case 'login':
        return <LoginPage />;
      case 'register-patient':
        return <RegisterPatientPage />;
      case 'register-dispensary':
        return <RegisterDispensaryPage />;
      case 'register-dispensary-confirm':
        return <RegisterDispensaryConfirmPage />;
      default:
        return <LandingPage />;
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
