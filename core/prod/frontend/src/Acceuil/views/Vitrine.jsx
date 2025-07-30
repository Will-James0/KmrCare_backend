/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React from "react";

const dispensaires = [
  {
    id: 1,
    nom: "Dispensaire Central Akwa",
    quartier: "Akwa",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Urgences", "Laboratoire"],
    horaires: "7h-18h",
    rating: 4.8,
  },
  {
    id: 2,
    nom: "Dispensaire Bonanjo",
    quartier: "Bonanjo",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Prénatal", "Pédiatrie", "Vaccination"],
    horaires: "6h-20h",
    rating: 4.6,
  },
  {
    id: 3,
    nom: "Dispensaire Makepe",
    quartier: "Makepe",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Cardiologie", "Dentaire"],
    horaires: "8h-17h",
    rating: 4.5,
  }
];

const DispensaireCard = ({ dispensaire }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ 
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10
        }
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Image du dispensaire */}
      <div className="relative w-full h-48 md:h-56">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${dispensaire.image})` }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating dans l'image */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm font-semibold text-gray-800">{dispensaire.rating}</span>
        </div>
      </div>

      {/* Contenu de la card */}
      <div className="p-6">
        {/* Nom et localisation */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#0f425d] mb-1">
            🏥 {dispensaire.nom}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            📍 Quartier {dispensaire.quartier}
          </p>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">SERVICES DISPONIBLES</p>
          <div className="flex flex-wrap gap-1">
            {dispensaire.services.map((service, index) => (
              <span 
                key={index}
                className="service-badge"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Horaires */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 flex items-center">
            🕒 Horaires: <span className="font-semibold ml-1">{dispensaire.horaires}</span>
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-[#0b9444] text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#0a7c3a] transition-colors duration-200"
          >
            📅 Prendre RDV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-[#0f425d] text-[#0f425d] rounded-lg font-semibold text-sm hover:bg-[#0f425d] hover:text-white transition-colors duration-200"
          >
            ℹ️
          </motion.button>
        </div>
      </div>

      {/* Barre de couleur en bas */}
      <div className="h-3 flex">
        <div className="flex-1 bg-[#0f425d]" />
        <div className="flex-1 bg-[#0b9444]" />
        <div className="flex-1 bg-[#a5c2f7]" />
      </div>
    </motion.div>
  );
};

const Vitrine = () => {
  return (
    <div className="w-full py-12 md:py-20 bg-gradient-to-br from-blue-50/50 to-green-50/50" id="disp">
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-caption font-bold text-[#0b9444] text-sm md:text-base tracking-wider uppercase mb-2">
            🏥 NOS DISPENSAIRES PARTENAIRES
          </p>
          <h2 className="font-display-2 font-semibold text-[#0f425d] text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
            Trouvez le Dispensaire le Plus Proche
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Plus de 50 dispensaires à Douala vous attendent. Choisissez celui qui vous convient le mieux.
          </p>
        </motion.div>
      </div>

      {/* Dispensaires Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dispensaires.map((dispensaire) => (
            <DispensaireCard key={dispensaire.id} dispensaire={dispensaire} />
          ))}
        </div>        {/* Bouton voir plus */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link to="/catalogue">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#0f425d] to-[#0b9444] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🗺️ Voir Tous les Dispensaires
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Vitrine;