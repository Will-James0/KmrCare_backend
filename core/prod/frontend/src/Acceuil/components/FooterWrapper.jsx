/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";

export const FooterWrapper = ({
  className,
  text = "© 2025 KmrCare name All Rights Reserved by MIGUELITO DevCode & Team 91",
}) => {
  return (
    <div className={`bg-[#0b9444] text-white p-8 md:p-12 ${className}`} id="contact">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">        {/* Section Logo et Description */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-4xl font-yeseva-one text-[#0f425d] mb-2">
            🏥 KMRCARE
          </h2>
          <p className="font-body-2 text-sm mb-4">
            Votre santé, simplifiée à Douala. Vous servir 24h/7j.
          </p>
          <div className="flex space-x-2 text-2xl">
            <span>📱</span>
            <span>💻</span>
            <span>🌐</span>
          </div>
        </div>

        {/* Section Services Rapides */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold font-work-sans mb-4 flex items-center">
            ⚡ Accès Rapide
          </h3>
          <ul className="space-y-2 font-body text-sm">
            <li><a href="#accueil" className="hover:underline flex items-center">🏠 Accueil</a></li>
            <li><a href="#disp" className="hover:underline flex items-center">🏥 Trouver un Dispensaire</a></li>
            <li><a href="#disp" className="hover:underline flex items-center">📅 Prendre RDV</a></li>
            <li><a href="#" className="hover:underline flex items-center">👤 Mon Compte</a></li>
            <li><a href="#" className="hover:underline flex items-center">❓ FAQ</a></li>
          </ul>
        </div>

        {/* Section Contact Us */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-semibold font-work-sans mb-4 flex items-center">
            📞 Nous Contacter
          </h3>
          <ul className="space-y-2 font-body text-sm">
            <li className="flex items-center">📞 <span className="ml-2">Urgences: (237) 657-755-890</span></li>
            <li className="flex items-center">📧 <span className="ml-2">support@kmrcare.com</span></li>
            <li className="flex items-center">📍 <span className="ml-2">Akwa, Douala - Cameroun</span></li>
            <li className="flex items-center">🕒 <span className="ml-2">Support 24h/7j</span></li>
          </ul>
        </div>        {/* Section Newsletter et Urgences */}
        <div>
          <h3 className="text-lg font-semibold font-work-sans mb-4 flex items-center">
            🚨 Alertes Santé
          </h3>
          <p className="text-sm mb-4">
            Recevez nos alertes santé et conseils médicaux directement par email.
          </p>
          <div className="flex mb-4">
            <input
              id="newsletter-email"
              name="newsletter-email"
              type="email"
              className="outline-none p-3 w-full bg-[#fcfefe] text-[#0f425d] font-semibold rounded-l-md text-sm placeholder-gray-500"
              placeholder="votre@email.com"
              autoComplete="email"
              required
            />
            <motion.button
            whileHover={{ x: -6 }}
            whileTap={{ scale: 1.5 }}
              type="button"
              className="bg-white p-3 rounded-r-md transition-all duration-200"
            >
              <img
                className="w-6 h-6"
                alt="Submit"
                src="/assets/send.svg"
              />
            </motion.button>
          </div>
          
          {/* Numéros d'urgence */}
          <div className="bg-red-500/20 p-3 rounded-lg border border-red-300">
            <h4 className="font-bold text-sm mb-2 flex items-center">
              🚑 Urgences Médicales
            </h4>
            <p className="text-xs">
              <strong>SAMU:</strong> 115 | <strong>Pompiers:</strong> 118
            </p>
          </div>
        </div>
      </div>

      {/* Séparateur et Copyright */}
      <div className="container mx-auto mt-8 pt-8 border-t border-white/50 flex flex-col md:flex-row justify-between items-center">
        <p className="font-work-sans text-base text-center md:text-left mb-4 md:mb-0">
          {text}
        </p>
        <div className="flex space-x-4">
          <motion.a
            href="#"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img
              className="w-6 h-6"
              alt="Facebook"
              src="/assets/facebook.svg"
            />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img
              className="w-6 h-6"
              alt="WhatsApp"
              src="/assets/whatsApp.svg"
            />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img
              className="w-6 h-6"
              alt="Instagram"
              src="/assets/instagram.svg"
            />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img
              className="w-6 h-6"
              alt="LinkedIn"
              src="/assets/linkedIn.svg"
            />
          </motion.a>
        </div>
      </div>
    </div>
  );
};