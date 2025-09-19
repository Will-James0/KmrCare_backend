import { motion } from "motion/react";
import React, { useState } from "react";
import PropTypes from 'prop-types';

const testimonials = [
  {
    id: 1,
    nom: "Marie Ngono",
    age: 32,
    quartier: "Akwa",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b6ac?w=150&h=150&fit=crop&crop=face",
    commentaire: "KmrCare a révolutionné ma façon de prendre rendez-vous ! Plus besoin de faire la queue. Je recommande vivement cette plateforme.",
    service: "Consultation Prénatale",
    rating: 5,
    date: "Décembre 2024"
  },
  {
    id: 2,
    nom: "Jean-Claude Mbida",
    age: 45,
    quartier: "Bonanjo",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    commentaire: "Simple, rapide et efficace. J'ai pu prendre un RDV pour ma fille en 2 minutes. Le personnel du dispensaire était déjà informé.",
    service: "Vaccination",
    rating: 5,
    date: "Janvier 2025"
  },
  {
    id: 3,
    nom: "Fatou Kameni",
    age: 28,
    quartier: "Makepe",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    commentaire: "Interface très intuitive. La géolocalisation m'a aidée à trouver le dispensaire le plus proche. Parfait pour les urgences mineures !",
    service: "Urgence Mineure",
    rating: 4,
    date: "Janvier 2025"
  }
];

const TestimonialCard = ({ testimonial, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        y: 0,
        scale: isActive ? 1 : 0.95
      }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 ${
        isActive ? 'ring-2 ring-[#0b9444]' : ''
      }`}
    >
      {/* Header avec photo et infos */}
      <div className="flex items-center mb-4">
        <img
          src={testimonial.photo}
          alt={testimonial.nom}
          className="w-16 h-16 rounded-full object-cover border-4 border-[#0b9444]/20"
        />
        <div className="ml-4 flex-1">
          <h4 className="font-bold text-[#0f425d] text-lg">{testimonial.nom}</h4>
          <p className="text-sm text-gray-600">{testimonial.age} ans • {testimonial.quartier}</p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-2">{testimonial.date}</span>
          </div>
        </div>
      </div>

      {/* Service utilisé */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0b9444]/10 text-[#0b9444] border border-[#0b9444]/20">
          💊 {testimonial.service}
        </span>
      </div>      {/* Commentaire */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 text-4xl text-[#0b9444]/20">
          &quot;
        </div>
        <p className="text-gray-700 italic leading-relaxed pl-6">
          {testimonial.commentaire}
        </p>
        <div className="absolute -bottom-2 -right-2 text-4xl text-[#0b9444]/20 rotate-180">
          &quot;
        </div>
      </div>
    </motion.div>
  );
};

// Validation des PropTypes
TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    quartier: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    commentaire: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-12 md:py-20 bg-gradient-to-br from-green-50/30 to-blue-50/30">
      {/* Header */}
      <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-caption font-bold text-[#0b9444] text-sm md:text-base tracking-wider uppercase mb-2">
            💬 TÉMOIGNAGES PATIENTS
          </p>
          <h2 className="font-display-2 font-semibold text-[#0f425d] text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
            Ce Que Disent Nos Patients
          </h2>          <p className="text-gray-600 text-base md:text-lg">
            Découvrez l&apos;expérience de ceux qui nous font confiance pour leur santé
          </p>
        </motion.div>
      </div>

      {/* Testimonials Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-[#0b9444] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Voir témoignage ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 bg-[#0b9444]/5 rounded-2xl p-8 border border-[#0b9444]/10"
        >
          <h3 className="text-xl font-bold text-[#0f425d] mb-4">
            🌟 Rejoignez des milliers de patients satisfaits !
          </h3>
          <p className="text-gray-600 mb-6">
            Prenez votre premier rendez-vous et découvrez la différence KmrCare
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#0b9444] to-[#0a7c3a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            📅 Prendre Mon Premier RDV
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
