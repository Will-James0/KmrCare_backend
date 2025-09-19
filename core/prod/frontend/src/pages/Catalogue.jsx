/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";

// Base de données étendue des dispensaires de Douala
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
    arrondissement: "Douala 2ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Urgences", "Consultation", "Laboratoire", "Pharmacie"],
    horaires: "24h/24",
    rating: 4.7,
    telephone: "+237 690 456 789",
    specialites: ["Urgences", "Médecine générale", "Traumatologie"],
    description: "Service d'urgence disponible 24h/24"
  },
  {
    id: 5,
    nom: "Dispensaire Bepanda",
    quartier: "Bepanda",
    arrondissement: "Douala 3ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Pédiatrie", "Vaccination", "Prénatal"],
    horaires: "7h-19h",
    rating: 4.3,
    telephone: "+237 690 567 890",
    specialites: ["Pédiatrie", "Gynécologie", "Médecine générale"],
    description: "Dispensaire communautaire de proximité"
  },
  {
    id: 6,
    nom: "Dispensaire New Bell",
    quartier: "New Bell",
    arrondissement: "Douala 1er",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Dentaire", "Ophtalmologie", "Laboratoire"],
    horaires: "8h-18h",
    rating: 4.4,
    telephone: "+237 690 678 901",
    specialites: ["Ophtalmologie", "Dentaire", "Médecine générale"],
    description: "Spécialisé en soins dentaires et ophtalmologie"
  },
  {
    id: 7,
    nom: "Dispensaire Ndokotti",
    quartier: "Ndokotti",
    arrondissement: "Douala 4ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Laboratoire", "Vaccination", "Urgences"],
    horaires: "6h-22h",
    rating: 4.2,
    telephone: "+237 690 789 012",
    specialites: ["Médecine générale", "Laboratoire", "Vaccination"],
    description: "Service de laboratoire moderne et rapide"
  },
  {
    id: 8,
    nom: "Dispensaire Koumassi",
    quartier: "Koumassi",
    arrondissement: "Douala 3ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Cardiologie", "Neurologie", "Radiologie"],
    horaires: "7h-20h",
    rating: 4.6,
    telephone: "+237 690 890 123",
    specialites: ["Cardiologie", "Neurologie", "Radiologie"],
    description: "Centre spécialisé en maladies cardiovasculaires"
  },
  {
    id: 9,
    nom: "Dispensaire Japoma",
    quartier: "Japoma",
    arrondissement: "Douala 5ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Pédiatrie", "Prénatal", "Vaccination"],
    horaires: "8h-17h",
    rating: 4.1,
    telephone: "+237 690 901 234",
    specialites: ["Pédiatrie", "Gynécologie", "Médecine familiale"],
    description: "Dispensaire moderne dessert la zone de Japoma"
  },
  {
    id: 10,
    nom: "Dispensaire Deido",
    quartier: "Deido",
    arrondissement: "Douala 1er",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Urgences", "Laboratoire", "Pharmacie"],
    horaires: "6h-21h",
    rating: 4.5,
    telephone: "+237 691 012 345",
    specialites: ["Urgences", "Médecine générale", "Pharmacie"],
    description: "Dispensaire avec pharmacie intégrée"
  },
  {
    id: 11,
    nom: "Dispensaire Logbaba",
    quartier: "Logbaba",
    arrondissement: "Douala 5ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Cardiologie", "Diabétologie", "Laboratoire"],
    horaires: "7h-18h",
    rating: 4.4,
    telephone: "+237 691 123 456",
    specialites: ["Cardiologie", "Diabétologie", "Endocrinologie"],
    description: "Spécialisé dans le traitement du diabète"
  },
  {
    id: 12,
    nom: "Dispensaire PK8",
    quartier: "PK8",
    arrondissement: "Douala 4ème",
    image: "https://c.animaapp.com/mbfwxdap4GBqLX/img/blackdoctors-1.png",
    services: ["Consultation", "Dentaire", "Orthodontie", "Chirurgie"],
    horaires: "8h-19h",
    rating: 4.3,
    telephone: "+237 691 234 567",
    specialites: ["Dentaire", "Orthodontie", "Chirurgie dentaire"],
    description: "Centre dentaire moderne avec chirurgie"
  }
];

// Filtres disponibles
const arrondissements = ["Tous", "Douala 1er", "Douala 2ème", "Douala 3ème", "Douala 4ème", "Douala 5ème"];
const servicesFilters = ["Tous", "Consultation", "Urgences", "Laboratoire", "Prénatal", "Pédiatrie", "Cardiologie", "Dentaire", "Vaccination"];

const DispensaireCard = ({ dispensaire, onOpen }) => {
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
        
        {/* Rating et arrondissement */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-semibold text-gray-800">{dispensaire.rating}</span>
          </div>
          <div className="bg-[#0b9444]/90 text-white rounded-full px-3 py-1">
            <span className="text-xs font-semibold">{dispensaire.arrondissement}</span>
          </div>
        </div>
      </div>

      {/* Contenu de la card */}
      <div className="p-6">
        {/* Nom et localisation */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#0f425d] mb-1">
            🏥 {dispensaire.nom}
          </h3>
          <p className="text-sm text-gray-600 flex items-center mb-1">
            📍 Quartier {dispensaire.quartier}
          </p>
          <p className="text-xs text-gray-500">
            {dispensaire.description}
          </p>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">SERVICES DISPONIBLES</p>
          <div className="flex flex-wrap gap-1">
            {dispensaire.services.slice(0, 3).map((service, index) => (
              <span 
                key={index}
                className="service-badge"
              >
                {service}
              </span>
            ))}
            {dispensaire.services.length > 3 && (
              <span className="text-xs text-gray-500">
                +{dispensaire.services.length - 3} autres
              </span>
            )}
          </div>
        </div>

        {/* Spécialités */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">SPÉCIALITÉS</p>
          <div className="flex flex-wrap gap-1">
            {dispensaire.specialites.slice(0, 2).map((specialite, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0f425d]/10 text-[#0f425d] border border-[#0f425d]/20"
              >
                {specialite}
              </span>
            ))}
          </div>
        </div>

        {/* Horaires et contact */}
        <div className="mb-4 space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            🕒 <span className="font-semibold ml-1">{dispensaire.horaires}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            📞 <span className="font-semibold ml-1">{dispensaire.telephone}</span>
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2">
          <Link to="/reservations" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#0b9444] text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#0a7c3a] transition-colors duration-200"
            >
              📅 Prendre RDV
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="px-4 py-2 border border-[#0f425d] text-[#0f425d] rounded-lg font-semibold text-sm hover:bg-[#0f425d] hover:text-white transition-colors duration-200"
          >
            ℹ️
          </motion.button>
        </div>
      </div>

      {/* Barre de couleur en bas */}
      <div className="mt-auto h-3 flex">
        <div className="flex-1 bg-[#0f425d]" />
        <div className="flex-1 bg-[#0b9444]" />
        <div className="flex-1 bg-[#a5c2f7]" />
      </div>
    </motion.div>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
      active 
        ? 'bg-[#0b9444] text-white shadow-lg' 
        : 'bg-white border border-gray-300 text-gray-700 hover:border-[#0b9444] hover:text-[#0b9444]'
    }`}
  >
    {children}
  </motion.button>
);

const StatsCard = ({ icon, number, label }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 shadow-lg text-center"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-[#0f425d] mb-1">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </motion.div>
);

const DispensaireModal = ({ dispensaire, isOpen, onClose }) => {
  if (!isOpen || !dispensaire) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header du modal */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${dispensaire.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            ✕
          </button>
          
          {/* Titre et rating */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              🏥 {dispensaire.nom}
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-semibold text-gray-800">{dispensaire.rating}</span>
              </div>
              <div className="bg-[#0b9444]/90 text-white rounded-full px-3 py-1">
                <span className="text-sm font-semibold">{dispensaire.arrondissement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 space-y-6">
          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f425d] mb-3">📍 Localisation</h3>
            <p className="text-gray-700">Quartier {dispensaire.quartier}, {dispensaire.arrondissement}</p>
            <p className="text-gray-600 text-sm mt-1">{dispensaire.description}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f425d] mb-3">🏥 Services Disponibles</h3>
            <div className="flex flex-wrap gap-2">
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

          {/* Spécialités */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f425d] mb-3">👨‍⚕️ Spécialités Médicales</h3>
            <div className="flex flex-wrap gap-2">
              {dispensaire.specialites.map((specialite, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-[#0f425d]/10 text-[#0f425d] border border-[#0f425d]/20"
                >
                  {specialite}
                </span>
              ))}
            </div>
          </div>

          {/* Horaires et contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#0f425d] mb-3">🕒 Horaires</h3>
              <p className="text-gray-700 text-lg font-medium">{dispensaire.horaires}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#0f425d] mb-3">📞 Contact</h3>
              <p className="text-gray-700 text-lg font-medium">{dispensaire.telephone}</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-[#0b9444] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#0a7c3a] transition-colors duration-200"
            >
              📅 Prendre Rendez-vous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 border-2 border-[#0f425d] text-[#0f425d] py-3 px-6 rounded-xl font-semibold hover:bg-[#0f425d] hover:text-white transition-colors duration-200"
            >
              📞 Appeler maintenant
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Catalogue = () => {
  const [selectedArrondissement, setSelectedArrondissement] = useState("Tous");
  const [selectedService, setSelectedService] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispensaire, setSelectedDispensaire] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Remettre la scrollbar en haut lors du montage du composant
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filtrage des dispensaires
  const filteredDispensaires = useMemo(() => {
    return dispensairesData.filter(dispensaire => {
      const matchArrondissement = selectedArrondissement === "Tous" || dispensaire.arrondissement === selectedArrondissement;
      const matchService = selectedService === "Tous" || dispensaire.services.includes(selectedService);
      const matchSearch = searchTerm === "" || 
        dispensaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispensaire.quartier.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchArrondissement && matchService && matchSearch;
    });
  }, [selectedArrondissement, selectedService, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-green-50/50">      {/* Navbar simple pour la navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">            <Link to="/" className="flex items-center space-x-2">
              <img
                alt="Logo KmrCare"
                src="/assets/logo.png"
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-lg sm:text-xl font-bold text-[#0f425d] hidden sm:block">KmrCare</span>
            </Link>
              <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-[#0f425d] hover:text-white hover:bg-[#0f425d] rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <span>←</span>
                <span className="hidden sm:inline">🏠 Retour à l&apos;accueil</span>
                <span className="sm:hidden">🏠</span>
              </Link>
              <span className="text-[#0b9444] font-semibold text-sm sm:text-base">
                <span className="hidden sm:inline">🏥 Catalogue des Dispensaires</span>
                <span className="sm:hidden">🏥 Catalogue</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0f425d] to-[#0b9444] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              🏥 Catalogue des Dispensaires
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Découvrez tous les dispensaires partenaires de KmrCare à Douala. 
              Trouvez facilement le centre médical le plus proche de chez vous.
            </p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <StatsCard icon="🏥" number="12+" label="Dispensaires" />
              <StatsCard icon="👨‍⚕️" number="50+" label="Médecins" />
              <StatsCard icon="🏙️" number="5" label="Arrondissements" />
              <StatsCard icon="⭐" number="4.4" label="Note moyenne" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de recherche et filtres */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Rechercher un dispensaire ou un quartier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 rounded-xl  text-secondary border-gray-300 focus:ring-2 focus:ring-[#0b9444] focus:border-transparent outline-none"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Filtres par arrondissement */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#0f425d] mb-3">Filtrer par arrondissement</h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {arrondissements.map((arrondissement) => (
                <FilterButton
                  key={arrondissement}
                  active={selectedArrondissement === arrondissement}
                  onClick={() => setSelectedArrondissement(arrondissement)}
                >
                  {arrondissement}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Filtres par service */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0f425d] mb-3">Filtrer par service</h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {servicesFilters.map((service) => (
                <FilterButton
                  key={service}
                  active={selectedService === service}
                  onClick={() => setSelectedService(service)}
                >
                  {service}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Résultats de la recherche */}
          <div className="text-center text-gray-600">
            <span className="font-semibold text-[#0b9444]">{filteredDispensaires.length}</span> dispensaire(s) trouvé(s)
          </div>
        </motion.div>

        {/* Grille des dispensaires */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredDispensaires.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredDispensaires.map((dispensaire) => (
                <DispensaireCard 
                  key={dispensaire.id} 
                  dispensaire={dispensaire} 
                  onOpen={() => {
                    setSelectedDispensaire(dispensaire);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#0f425d] mb-2">
                Aucun dispensaire trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
            </div>
          )}
        </motion.div>

        {/* Section d'aide */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center">            <h3 className="text-2xl font-bold text-[#0f425d] mb-4">
              💡 Besoin d&apos;aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Notre équipe est là pour vous aider à trouver le dispensaire qui correspond le mieux à vos besoins. 
              Contactez-nous pour des conseils personnalisés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#0b9444] text-white rounded-xl font-semibold hover:bg-[#0a7c3a] transition-colors"
              >
                📞 Nous contacter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-[#0f425d] text-[#0f425d] rounded-xl font-semibold hover:bg-[#0f425d] hover:text-white transition-colors"
              >
                📧 Envoyer un message
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal pour les détails du dispensaire sélectionné */}
      <DispensaireModal
        dispensaire={selectedDispensaire}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Catalogue;
