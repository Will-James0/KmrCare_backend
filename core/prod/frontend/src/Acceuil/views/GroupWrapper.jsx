/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import PropTypes from 'prop-types'; // Importer PropTypes
import { Link } from "react-router-dom";

// Helper component for list items with a dot
const ListItem = ({ children }) => (
  <li className="flex items-start mb-2">
    <span className="flex-shrink-0 w-3 h-3 mt-1.5 bg-[#0f425d] rounded-full mr-3"></span>
    <span className="text-sm md:text-base text-gray-700">{children}</span>
  </li>
);

// Ajouter la validation des props pour ListItem
ListItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export const GroupWrapper = () => {
  return (
    <div className="w-full py-12 md:py-20 lg:py-24" id="services">
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-16 px-4">
        <div className="font-caption font-bold text-[#0b9444] text-sm md:text-base tracking-wider uppercase mb-2">
          DES SOINS DE CONFIANCE
        </div>
        <h2 className="font-display-2 font-semibold text-secondary text-2xl sm:text-3xl md:text-4xl leading-tight">
          Nos services
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 p-4 sm:p-6 md:p-8 bg-gray-100 rounded-lg shadow-lg">
        {/* Left Column: Services List */}
        <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity:1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="lg:w-1/4 xl:w-1/5 w-full bg-white rounded-md shadow flex flex-col border border-gray-200">          {/* Service Item 1 - Urgences */}
          <div className="p-4 md:p-5 text-center bg-gradient-to-r from-primary to-green-500 rounded-t-md">
            <div className="text-3xl mb-2">🚨</div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-body font-medium text-white text-sm md:text-base"
            >
              Urgences 24h/7j
            </motion.div>
          </div>
          {/* Service Item 2 - Prénatal */}
          <div className="p-4 md:p-5 text-center bg-gradient-to-r from-blue-100 to-blue-200 border-t border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">🤱</span>
              <img
                className="w-6 h-6 ml-1"
                alt="Prénatal"
                src="/assets/prenatal.svg"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-body font-medium text-blue-800 text-sm md:text-base"
            >
              Suivi Prénatal
            </motion.div>
          </div>
          {/* Service Item 3 - Consultation */}
          <div className="p-4 md:p-5 text-center bg-gradient-to-r from-primary to-green-500 border-t border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">🩺</span>
              <img
                className="w-6 h-6 ml-1"
                alt="Consultation"
                src="/assets/consultation.svg"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-body font-medium text-white text-sm md:text-base"
            >
              Consultation Générale
            </motion.div>
          </div>          {/* Service Item 4 - Vaccination */}
          <div className="p-4 md:p-5 text-center bg-gradient-to-r from-blue-100 to-blue-200 border-t border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl">💉</span>
              <img
                className="w-6 h-8 ml-1"
                alt="Vaccination"
                src="/assets/vaccin.svg"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-body font-medium text-blue-800 text-sm md:text-base"
            >
              Vaccination
            </motion.div>
          </div>
          {/* View All Button */}
          <Link
          className="mt-auto"
          to="/services">
             <motion.div
            whileHover={{ y: -2, backgroundColor: "#0a2f3d" }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#0f425d] text-white text-center py-3 px-4 rounded-b-md cursor-pointer font-button-text font-medium text-sm md:text-base transition-all duration-300"
            >
              📋 Voir Tous les Services
            </motion.div>
          </Link>
        </motion.div>

        {/* Center Column: Text Content */}
        <motion.div
        initial={{ y: -100, opacity: 0 }}
        whileInView={{ y: 0, opacity:1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="lg:w-1/2 xl:flex-grow w-full p-4 md:p-6 bg-white rounded-md shadow">
          <h3 className="font-title font-semibold text-xl md:text-2xl text-gray-800 mb-4 md:mb-6">
            Le patient avant tout.
          </h3>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6 md:mb-8">
            <ListItem>Recherche Facile</ListItem>
            <ListItem>Rappels Automatiques</ListItem>
            <ListItem>Consultation</ListItem>
            <ListItem>Gestion de Vos Rendez-vous</ListItem>
            <ListItem>Réservation Instantanée</ListItem>
            <ListItem>Accès 24/7</ListItem>
          </ul>

          <div className="space-y-4 text-sm md:text-base text-gray-600 leading-relaxed">
            <p>
              Notre plateforme de télémédecine révolutionne l&apos;accès aux soins de santé en offrant 
              une gamme complète de services médicaux accessibles 24h/24 et 7j/7. Des urgences 
              médicales aux consultations de routine, nous mettons la technologie au service de 
              votre bien-être avec des professionnels qualifiés.
            </p>
            <p>
              Grâce à notre système de réservation et nos rappels automatiques, 
              prenez en main votre santé en toute simplicité. Une expérience personnalisée 
              qui place le patient au cœur de nos préoccupations.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Images (visible on md screens and up) */}
        <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity:1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="lg:w-1/4 xl:w-1/3 w-full md:flex flex-col gap-6">
          <div className="relative bg-gray-200 rounded-md shadow">
            <img
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
              src="/assets/rectangle-1.png"
              alt="Service Image 1"
            />
            <div className="absolute bottom-0 left-0 w-full h-2.5 flex">
              <div className="w-1/3 h-full bg-[#0f425d]"></div>
              <div className="w-1/3 h-full bg-[#0b9444]"></div>
              <div className="w-1/3 h-full bg-[#bed2f7]"></div>
            </div>
          </div>
          <div className="relative bg-gray-200 rounded-md shadow">
            <img
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
              src="/assets/rectangle-2.png"
              alt="Service Image 2"
            />
            <div className="absolute bottom-0 left-0 w-full h-2.5 flex">
              <div className="w-1/3 h-full bg-[#0f425d]"></div>
              <div className="w-1/3 h-full bg-[#0b9444]"></div>
              <div className="w-1/3 h-full bg-[#bed2f7]"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
