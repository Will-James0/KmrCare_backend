/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const RegisterDoctorConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state?.registrationData;

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/assets/login.jpeg')` }}
      />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-16 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-[#0f425d] mb-2">
            INSCRIPTION RÉUSSIE !
          </h1>
          <p className="text-gray-700">
            Votre demande d&apos;inscription a été soumise avec succès
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur rounded-xl p-8 shadow-lg"
        >
          {/* Icône de succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Message de confirmation */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Demande en cours de traitement
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nous avons bien reçu votre demande d&apos;inscription pour votre dispensaire. 
              Notre équipe va examiner votre dossier et vous contacter sous 48h.
            </p>
            
            {registrationData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Informations soumises :</h3>
                <div className="text-left text-sm text-blue-700 space-y-1">
                  <p><span className="font-medium">Dispensaire :</span> {registrationData.dispensaryName}</p>
                  <p><span className="font-medium">Responsable :</span> {registrationData.managerFirstName} {registrationData.managerLastName}</p>
                  <p><span className="font-medium">Email :</span> {registrationData.email}</p>
                  <p><span className="font-medium">Téléphone :</span> {registrationData.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Étapes suivantes */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-800 text-center mb-4">
              Prochaines étapes :
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Vérification des documents</h4>
                  <p className="text-sm text-gray-600">
                    Notre équipe vérifie les informations et documents fournis
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Contact de validation</h4>
                  <p className="text-sm text-gray-600">
                    Nous vous contactons pour finaliser votre profil
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Activation du compte</h4>
                  <p className="text-sm text-gray-600">
                    Votre dispensaire est activé sur la plateforme KmrCare
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-gray-800 mb-2">
              Besoin d&apos;aide ?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Notre équipe support est disponible pour vous accompagner :
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-blue-600">📧 support@kmrcare.com</p>
              <p className="text-blue-600">📞 +237 XXX XXX XXX</p>
              <p className="text-gray-600">Horaires : Lun-Ven 8h-18h</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Retourner à l&apos;accueil
            </motion.button>
            
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login-doctor')}
                className="flex-1 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/register-selection')}
                className="flex-1 py-2 text-gray-600 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Nouvelle inscription
              </button>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="text-gray-600 text-center mt-8 text-sm"
        >
          © KmrCare@2025. Tous droits réservés
        </motion.p>
      </div>
    </div>
  );
};

export default RegisterDoctorConfirm;
