/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

// Base de données des dispensaires (importée du Catalogue)
const dispensairesData = [
  {
    id: 1,
    nom: "Dispensaire Central Akwa",
    quartier: "Akwa",
    arrondissement: "Douala 1er",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Urgences", "Laboratoire", "Radiologie"],
    horaires: "7h-18h",
    rating: 4.8,
    telephone: "+237 690 123 456",
    specialites: ["Médecine générale", "Cardiologie", "Dermatologie"],
    description: "Dispensaire moderne avec équipements de dernière génération"
  },
  {
    id: 2,
    nom: "Dispensaire Bonanjo",
    quartier: "Bonanjo",
    arrondissement: "Douala 1er",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Prénatal", "Pédiatrie", "Vaccination", "Consultation"],
    horaires: "6h-20h",
    rating: 4.6,
    telephone: "+237 690 234 567",
    specialites: ["Gynécologie", "Pédiatrie", "Vaccination"],
    description: "Spécialisé dans les soins mère-enfant"
  },
  {
    id: 3,
    nom: "Dispensaire Makepe",
    quartier: "Makepe",
    arrondissement: "Douala 4ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Cardiologie", "Dentaire", "Laboratoire"],
    horaires: "8h-17h",
    rating: 4.5,
    telephone: "+237 690 345 678",
    specialites: ["Cardiologie", "Dentaire", "Médecine générale"],
    description: "Centre médical polyvalent de quartier"
  },
  {
    id: 4,
    nom: "Dispensaire Bonaberi",
    quartier: "Bonaberi",
    arrondissement: "Douala 3ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Vaccination", "Laboratoire"],
    horaires: "7h-16h",
    rating: 4.3,
    telephone: "+237 690 456 789",
    specialites: ["Médecine générale", "Vaccination"],
    description: "Dispensaire communautaire accessible"
  },
  {
    id: 5,
    nom: "Dispensaire Deido",
    quartier: "Deido",
    arrondissement: "Douala 1er",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Urgences", "Dermatologie"],
    horaires: "24h/24",
    rating: 4.7,
    telephone: "+237 690 567 890",
    specialites: ["Urgences", "Dermatologie", "Médecine générale"],
    description: "Service d'urgence 24h/24"
  }
];

const Reservations = () => {
  // États pour l'affichage uniquement (frontend pur)
  const [selectedDispensaire, setSelectedDispensaire] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Remettre la scrollbar en haut lors du montage du composant
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Créneaux horaires disponibles
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  // Obtenir les services du dispensaire sélectionné
  const getServicesForDispensaire = () => {
    if (!selectedDispensaire) return [];
    const dispensaire = dispensairesData.find(d => d.id === parseInt(selectedDispensaire));
    return dispensaire ? dispensaire.services : [];
  };

  // Validation simple pour l'étape actuelle (frontend uniquement)
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return selectedDispensaire && selectedService;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return true; // Simplifié pour le frontend
      default:
        return false;
    }
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };



  // Composant Étape 1: Sélection du dispensaire et service
  const Step1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-sky-50/50"
    >
      <div>
        <h3 className="text-xl font-semibold text-[#0f425d] mb-4">
          1. Choisissez votre dispensaire
        </h3>
        <select
          value={selectedDispensaire}
          onChange={(e) => {
            setSelectedDispensaire(e.target.value);
            setSelectedService(""); // Reset service when dispensaire changes
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-[#159eec]"
        >
          <option value="">Sélectionnez un dispensaire</option>
          {dispensairesData.map(dispensaire => (
            <option key={dispensaire.id} value={dispensaire.id}>
              {dispensaire.nom} - {dispensaire.quartier}
            </option>
          ))}
        </select>
      </div>

      {selectedDispensaire && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-[#0f425d] mb-4">
            2. Choisissez le service souhaité
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getServicesForDispensaire().map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedService === service
                    ? "border-[#0b9444] bg-[#0b9444] text-white"
                    : "border-gray-300 hover:border-[#159eec] hover:bg-blue-50 text-secondary"
                }`}
              >
                <div className="font-medium">{service}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Composant Étape 2: Sélection de la date et heure
  const Step2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-sky-50/50"
    >
      <div>
        <h3 className="text-xl font-semibold text-[#0f425d] mb-4">
          3. Choisissez la date
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-[#159eec]"
        />
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-[#0f425d] mb-4">
            4. Choisissez l&apos;heure
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                  selectedTime === time
                    ? "border-[#0b9444] bg-[#0b9444] text-white"
                    : "border-gray-300 hover:border-[#159eec] hover:bg-blue-50 text-secondary"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Composant Étape 3: Informations du patient
  const Step3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-sky-50/50"
    >
      <h3 className="text-xl font-semibold text-[#0f425d] mb-4">
        5. Vos informations personnelles
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0f425d] mb-2">
            Nom *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
            placeholder="Votre nom"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0f425d] mb-2">
            Prénom *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
            placeholder="Votre prénom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0f425d] mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
            placeholder="+237 6XX XXX XXX"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#0f425d] mb-2">
            Email *
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
            placeholder="votre.email@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0f425d] mb-2">
          Âge
        </label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
          placeholder="Votre âge"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0f425d] mb-2">
          Motif
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors text-secondary"
          placeholder="Décrivez brièvement le motif de votre consultation..."
        />
      </div>
    </motion.div>
  );

  // Page de confirmation
  const ConfirmationPage = () => {
    const dispensaire = dispensairesData.find(d => d.id === parseInt(selectedDispensaire));
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 bg-sky-50/50"
      >
        <div className="w-20 h-20 bg-[#0b9444] rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-[#0b9444]">
          Rendez-vous confirmé !
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
          <h3 className="font-semibold text-[#0f425d] mb-4">Détails de votre rendez-vous :</h3>
          <p><span className="font-medium">Dispensaire :</span> {dispensaire?.nom}</p>
          <p><span className="font-medium">Service :</span> {selectedService}</p>
          <p><span className="font-medium">Date :</span> {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
          <p><span className="font-medium">Heure :</span> {selectedTime}</p>
          <p><span className="font-medium">Patient :</span> [Nom du patient]</p>
          <p><span className="font-medium">Téléphone :</span> [Numéro de téléphone]</p>
        </div>
        
        <p className="text-gray-600">
          Un Email de confirmation a été envoyé
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/catalogue"
            className="px-6 py-3 bg-[#159eec] text-white rounded-lg hover:bg-[#1389d0] transition-colors duration-200"
          >
            Retour au catalogue
          </Link>
          <button
            onClick={() => {
              setShowConfirmation(false);
              setCurrentStep(1);
              setSelectedDispensaire("");
              setSelectedService("");
              setSelectedDate("");
              setSelectedTime("");
            }}
            className="px-6 py-3 border-2 border-[#0f425d] text-[#0f425d] rounded-lg hover:bg-[#0f425d] hover:text-white transition-colors duration-200"
          >
            Nouveau rendez-vous
          </button>
        </div>
      </motion.div>
    );
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-green-50/50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  alt="Logo KmrCare"
                  src="/assets/logo.png"
                  className="h-8 sm:h-10 w-auto"
                />
                <span className="text-lg sm:text-xl font-bold text-[#0f425d] hidden sm:block">KmrCare</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <ConfirmationPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-green-50/50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                alt="Logo KmrCare"
                src="/assets/logo.png"
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-lg sm:text-xl font-bold text-[#0f425d] hidden sm:block">KmrCare</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/catalogue"
                className="text-[#0f425d] hover:text-[#fff] hover:bg-secondary hover:rounded-xl p-3 font-medium transition-colors duration-200"
              >
                📋 Catalogue
              </Link>
              <Link
                to="/"
                className="text-[#0f425d] hover:text-[#0b9444] font-medium transition-colors duration-200"
              >
                🏠 Accueil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f425d] mb-4">
            Prendre Rendez-vous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Réservez facilement votre consultation dans l&apos;un de nos dispensaires partenaires à Douala
          </p>
        </motion.div>

        {/* Indicateur d'étapes */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                    currentStep >= step
                      ? "bg-[#0b9444] text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors duration-300 ${
                      currentStep > step ? "bg-[#0b9444]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1 key="step1" />}
            {currentStep === 2 && <Step2 key="step2" />}
            {currentStep === 3 && <Step3 key="step3" />}
          </AnimatePresence>

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
              disabled={currentStep === 1}
            >
              Précédent
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  validateStep(currentStep)
                    ? "bg-[#0b9444] text-white hover:bg-[#0a7c3a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!validateStep(currentStep)}
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmation(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  validateStep(3)
                    ? "bg-[#0b9444] text-white hover:bg-[#0a7c3a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!validateStep(3)}
              >
                Confirmer le rendez-vous
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reservations;
