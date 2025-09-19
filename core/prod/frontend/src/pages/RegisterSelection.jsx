/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f425d] mb-6 leading-tight">
            REJOIGNEZ KmrCare
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Choisissez votre type d&apos;inscription
          </p>
        </div>

        <motion.div
          initial={{ y: -5, opacity: 0}}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {/* Inscription Patient */}
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
              Vous recherchez des soins de qualité ? Créez votre compte patient pour accéder facilement aux services de santé.
            </p>
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0b9444] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Prise de rendez-vous en ligne
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0b9444] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Historique de vos consultations
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0b9444] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accès aux meilleurs dispensaires
              </div>
            </div>
            <button
              onClick={() => navigate('/register-patient')}
              className="w-full py-3 bg-[#0b9444] text-white font-semibold rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200"
            >
              S&apos;inscrire comme Patient
            </button>
          </motion.div>

          {/* Inscription Dispensaire */}
          <motion.div 
            className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-[#0f425d] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0f425d] mb-4">DISPENSAIRE</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Propriétaire d&apos;un dispensaire ? Rejoignez notre réseau pour moderniser vos services et atteindre plus de patients.
            </p>
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0f425d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Gestion des rendez-vous en ligne
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0f425d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Visibilité accrue de votre dispensaire
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-[#0f425d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Outils de gestion moderne
              </div>
            </div>
            <button
              onClick={() => navigate('/register-doctor')}
              className="w-full py-3 bg-[#0f425d] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Inscrire mon Dispensaire
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-gray-600 mb-4">
            Vous avez déjà un compte ?
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/login-patient"
              className="text-[#0b9444] hover:text-[#0a7c3a] font-medium transition-colors"
            >
              Connexion Patient
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/login-doctor"
              className="text-[#0f425d] hover:text-blue-800 font-medium transition-colors"
            >
              Connexion Dispensaire
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/auth"
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Toutes les Connexions
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

export default RegisterSelection;
