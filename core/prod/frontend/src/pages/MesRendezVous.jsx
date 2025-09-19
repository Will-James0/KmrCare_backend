/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const MesRendezVous = () => {
  // États pour la gestion des rendez-vous
  const [rendezVous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);

  // Données fictives des rendez-vous
  useEffect(() => {
    // Simulation d'un chargement
    setTimeout(() => {
      setRendezVous([
        {
          id: 1,
          dispensaire: "Dispensaire Central Akwa",
          service: "Consultation générale",
          date: "2025-07-25",
          heure: "09:30",
          statut: "confirme",
          medecin: "Dr. Amina Bassong",
          motif: "Contrôle de routine",
          adresse: "Akwa, Douala 1er"
        },
        {
          id: 2,
          dispensaire: "Dispensaire Bonanjo",
          service: "Cardiologie",
          date: "2025-07-28",
          heure: "14:00",
          statut: "en_attente",
          medecin: "Dr. Paul Mboma",
          motif: "Suivi cardiologique",
          adresse: "Bonanjo, Douala 1er"
        },
        {
          id: 3,
          dispensaire: "Dispensaire Makepe",
          service: "Dentaire",
          date: "2025-08-02",
          heure: "10:00",
          statut: "confirme",
          medecin: "Dr. Marie Ekotto",
          motif: "Détartrage",
          adresse: "Makepe, Douala 4ème"
        },
        {
          id: 4,
          dispensaire: "Dispensaire Central Akwa",
          service: "Laboratoire",
          date: "2025-07-20",
          heure: "08:00",
          statut: "termine",
          medecin: "Dr. Jean Nkomo",
          motif: "Analyses sanguines",
          adresse: "Akwa, Douala 1er"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les rendez-vous selon le statut
  const rendezVousFiltres = rendezVous.filter(rdv => {
    if (selectedFilter === 'tous') return true;
    return rdv.statut === selectedFilter;
  });

  // Fonctions de gestion des rendez-vous
  const annulerRendezVous = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      setRendezVous(prev => prev.filter(rdv => rdv.id !== id));
    }
  };

  const modifierRendezVous = (rdv) => {
    setSelectedRdv(rdv);
    setShowModifyModal(true);
  };

  const confirmerModification = () => {
    // Logique de modification (ici simplifiée)
    setShowModifyModal(false);
    setSelectedRdv(null);
    alert('Rendez-vous modifié avec succès !');
  };

  // Obtenir la couleur selon le statut
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'confirme':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir le libellé du statut
  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'confirme':
        return 'Confirmé';
      case 'en_attente':
        return 'En attente';
      case 'termine':
        return 'Terminé';
      case 'annule':
        return 'Annulé';
      default:
        return statut;
    }
  };

  // Vérifier si la date est passée
  const isDatePassee = (date) => {
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-green-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f425d]"></div>
          <p className="mt-4 text-[#0f425d] font-medium">Chargement de vos rendez-vous...</p>
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
                className="text-[#0f425d] hover:text-[#0b9444] font-medium transition-colors duration-200"
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f425d] mb-4">
            Mes Rendez-vous
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gérez vos consultations et prenez de nouveaux rendez-vous facilement
          </p>
        </motion.div>

        {/* Actions principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'tous', label: 'Tous', count: rendezVous.length },
                { key: 'confirme', label: 'Confirmés', count: rendezVous.filter(r => r.statut === 'confirme').length },
                { key: 'en_attente', label: 'En attente', count: rendezVous.filter(r => r.statut === 'en_attente').length },
                { key: 'termine', label: 'Terminés', count: rendezVous.filter(r => r.statut === 'termine').length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedFilter === filter.key
                      ? 'bg-[#0f425d] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
            <Link
              to="/catalogue"
              className="bg-[#0b9444] text-white px-6 py-3 rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200 font-medium"
            >
              ➕ Nouveau Rendez-vous
            </Link>
          </div>
        </motion.div>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          <AnimatePresence>
            {rendezVousFiltres.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="text-6xl text-gray-400 mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedFilter === 'tous' ? 'Aucun rendez-vous' : `Aucun rendez-vous ${getStatutLabel(selectedFilter).toLowerCase()}`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedFilter === 'tous' 
                    ? 'Vous n\'avez pas encore de rendez-vous planifiés.'
                    : `Vous n'avez pas de rendez-vous ${getStatutLabel(selectedFilter).toLowerCase()}.`
                  }
                </p>
                <Link
                  to="/catalogue"
                  className="inline-block bg-[#0b9444] text-white px-6 py-3 rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200 font-medium"
                >
                  Prendre un rendez-vous
                </Link>
              </motion.div>
            ) : (
              rendezVousFiltres.map((rdv) => (
                <motion.div
                  key={rdv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Informations principales */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#0f425d] mb-1">
                              {rdv.dispensaire}
                            </h3>
                            <p className="text-gray-600">{rdv.adresse}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(rdv.statut)}`}>
                            {getStatutLabel(rdv.statut)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">📅</span>
                            <div>
                              <p className="font-medium text-gray-900">Date</p>
                              <p className="text-gray-600">{new Date(rdv.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">🕒</span>
                            <div>
                              <p className="font-medium text-gray-900">Heure</p>
                              <p className="text-gray-600">{rdv.heure}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-600">⚕️</span>
                            <div>
                              <p className="font-medium text-gray-900">Service</p>
                              <p className="text-gray-600">{rdv.service}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-orange-600">👨‍⚕️</span>
                            <div>
                              <p className="font-medium text-gray-900">Médecin</p>
                              <p className="text-gray-600">{rdv.medecin}</p>
                            </div>
                          </div>
                        </div>

                        {rdv.motif && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-1">Motif</p>
                            <p className="text-sm text-gray-600">{rdv.motif}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        {rdv.statut !== 'termine' && !isDatePassee(rdv.date) && (
                          <>
                            <button
                              onClick={() => modifierRendezVous(rdv)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => annulerRendezVous(rdv.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                              ❌ Annuler
                            </button>
                          </>
                        )}
                        <Link
                          to={`/catalogue`}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-center"
                        >
                          📋 Voir dispensaire
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de modification */}
      <AnimatePresence>
        {showModifyModal && selectedRdv && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#0f425d] mb-4">
                Modifier le rendez-vous
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedRdv.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f425d] focus:border-[#0f425d]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle heure
                  </label>
                  <select
                    defaultValue={selectedRdv.heure}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f425d] focus:border-[#0f425d]"
                  >
                    <option value="08:00">08:00</option>
                    <option value="08:30">08:30</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModifyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmerModification}
                  className="flex-1 px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors duration-200"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MesRendezVous;
