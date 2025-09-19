/* eslint-disable no-unused-vars */
import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const StatsCard = ({ icon, number, label, color, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = number / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev + increment >= number) {
            clearInterval(interval);
            return number;
          }
          return prev + increment;
        });
      }, 30);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className={`bg-white rounded-2xl shadow-lg p-6 text-center border-l-4 ${color} hover:shadow-2xl transition-all duration-300`}
    >
      <div className="text-4xl md:text-5xl mb-4">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {Math.floor(count).toLocaleString()}+
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
};

// Validation des PropTypes
StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  delay: PropTypes.number
};

const RealTimeStats = () => {
  const stats = [
    {
      icon: "🏥",
      number: 52,
      label: "Dispensaires Partenaires",
      color: "border-[#0b9444]",
      delay: 0
    },
    {
      icon: "👨‍⚕️",
      number: 180,
      label: "Professionnels de Santé",
      color: "border-[#0f425d]",
      delay: 1
    },
    {
      icon: "📅",
      number: 1250,
      label: "RDV ce Mois",
      color: "border-blue-500",
      delay: 2
    },
    {
      icon: "⭐",
      number: 95,
      label: "% de Satisfaction",
      color: "border-yellow-500",
      delay: 3
    }
  ];


  return (
    <div className="w-full py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="text-center mb-10 md:mb-16 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-caption font-bold text-[#0b9444] text-sm md:text-base tracking-wider uppercase mb-2">
            📊 STATISTIQUES EN TEMPS RÉEL
          </p>
          <h2 className="font-display-2 font-semibold text-[#0f425d] text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
            KmrCare en Chiffres
          </h2>          <p className="text-gray-600 text-base md:text-lg">
            Découvrez l&apos;impact de notre plateforme sur la santé à Douala
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              color={stat.color}
              delay={stat.delay}
            />
          ))}
        </div>


        {/* Horaires Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 bg-[#0b9444]/5 rounded-2xl p-6 border border-[#0b9444]/10 text-center"
        >
          <h4 className="text-lg font-bold text-[#0f425d] mb-4">
            🕒 Disponibilité des Services
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-primary font-bold">● OUVERT</span>
              <span className="text-gray-500">Consultations: 6h - 20h</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-500 font-bold">● URGENCES</span>
              <span className="text-gray-500">24h/7j - Tous dispensaires</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-secondary font-bold">● PLATEFORME</span>
              <span className="text-gray-500">24h/7j - Réservation en ligne</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RealTimeStats;
