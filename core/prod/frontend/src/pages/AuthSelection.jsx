/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const AuthSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('/assets/login.jpeg')` }}
      />
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div>
          <Link to="/" className="inline-block mb-8">
            <img src="/assets/logo.png" alt="KmrCare Logo" className="h-20 w-auto mx-auto" />
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f425d] mb-6 leading-tight">
            CONNEXION KmrCare
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Choisissez votre type de connexion
          </p>
        </div>

        <div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {/* Connexion Patient */}
          <motion.div 
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0b9444] mb-4">PATIENT</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Accédez à votre espace personnel pour prendre rendez-vous et gérer vos consultations
            </p>
            <button
              onClick={() => navigate('/login-patient')}
              className="w-full py-3 bg-[#0b9444] text-white font-semibold rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200"
            >
              Me connecter en tant que Patient
            </button>
          </motion.div>

          {/* Connexion Médecin/Dispensaire */}
          <motion.div 
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-[#0f425d] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 01-2.856 0L16 14.856l-.571.572a2 2 0 01-2.857 0L12 14.856l-.571.572a2 2 0 01-2.857 0L8 14.856l-.571.572a2 2 0 01-2.857 0L4 14.856l-.571.572A2 2 0 012 14.856v-5.712A2 2 0 014 7h16a2 2 0 012 2v5.712a2 2 0 01-.572 1.428z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0f425d] mb-4">MÉDECIN</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Espace professionnel pour gérer vos consultations et votre dispensaire
            </p>
            <button
              onClick={() => navigate('/login-doctor')}
              className="w-full py-3 bg-[#0f425d] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Me connecter en tant que Médecin
            </button>
          </motion.div>

          {/* Connexion Administrateur */}
          <motion.div 
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 border border-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#0b9444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0b9444] mb-4">ADMINISTRATEUR</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Accès sécurisé pour la gestion complète de la plateforme KmrCare
            </p>
            <button
              onClick={() => navigate('/login-admin')}
              className="w-full py-3 border border-[#0b9444] text-[#0b9444] font-semibold rounded-lg hover:bg-[#0b9444] hover:text-white transition-colors duration-200"
            >
              Accès Administrateur
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-gray-600 mb-4">
            Vous n&apos;avez pas encore de compte ?
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/register-patient"
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
            >
              Inscription Patient
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/register-dispensary"
              className="text-[#0f425d] hover:text-blue-800 font-medium transition-colors"
            >
              Inscription Dispensaire
            </Link>
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
};

export default AuthSelection;
