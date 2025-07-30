/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import PropTypes from 'prop-types';

const Medecins = () => {
  const [activeTab, setActiveTab] = useState('medecins');
  
  // État pour les médecins du dispensaire
  const [medecins, setMedecins] = useState([
    {
      id: 1,
      nom: 'Dr. Amina Bassong',
      email: 'a.bassong@dispensaire1.com',
      specialite: 'Médecine Générale',
      telephone: '+237 657 755 894',
      dateEmbauche: '2024-01-15'
    },
    {
      id: 2,
      nom: 'Dr. Paul Mboma',
      email: 'p.mboma@dispensaire1.com',
      specialite: 'Pédiatrie',
      telephone: '+237 657 755 895',
      dateEmbauche: '2024-03-10'
    },
    {
      id: 3,
      nom: 'Dr. Marie Ekotto',
      email: 'm.ekotto@dispensaire1.com',
      specialite: 'Gynécologie',
      telephone: '+237 657 755 896',
      dateEmbauche: '2023-11-20'
    }
  ]);

  // État pour les horaires de service
  const [horaires, setHoraires] = useState([
    {
      id: 1,
      jour: 'Lundi',
      heureOuverture: '08:00',
      heureFermeture: '17:00',
      pauseDebut: '12:00',
      pauseFin: '13:00',
    },
    {
      id: 2,
      jour: 'Mardi',
      heureOuverture: '08:00',
      heureFermeture: '17:00',
      pauseDebut: '12:00',
      pauseFin: '13:00',
    },
    {
      id: 3,
      jour: 'Mercredi',
      heureOuverture: '08:00',
      heureFermeture: '17:00',
      pauseDebut: '12:00',
      pauseFin: '13:00',
    },
    {
      id: 4,
      jour: 'Jeudi',
      heureOuverture: '08:00',
      heureFermeture: '17:00',
      pauseDebut: '12:00',
      pauseFin: '13:00',
    },
    {
      id: 5,
      jour: 'Vendredi',
      heureOuverture: '08:00',
      heureFermeture: '17:00',
      pauseDebut: '12:00',
      pauseFin: '13:00',
    },
    {
      id: 6,
      jour: 'Samedi',
      heureOuverture: '08:00',
      heureFermeture: '12:00',
      pauseDebut: '',
      pauseFin: '',
    },
    {
      id: 7,
      jour: 'Dimanche',
      heureOuverture: '',
      heureFermeture: '',
      pauseDebut: '',
      pauseFin: '',
    }
  ]);

  // État pour les rendez-vous
  const [rendezVous, setRendezVous] = useState([
    {
      id: 1,
      patient: 'Jean Kouam',
      telephonePatient: '+237 657 755 897',
      medecin: 'Dr. Amina Bassong',
      date: '2025-06-23',
      heure: '09:00',
      motif: 'Consultation générale',
      notes: ''
    },
    {
      id: 2,
      patient: 'Marie Ngono',
      telephonePatient: '+237 657 755 898',
      medecin: 'Dr. Paul Mboma',
      date: '2025-06-23',
      heure: '10:30',
      motif: 'Suivi pédiatrique',
      notes: ''
    },
    {
      id: 3,
      patient: 'Claire Ateba',
      telephonePatient: '+237 657 755 899',
      medecin: 'Dr. Marie Ekotto',
      date: '2025-06-24',
      heure: '14:00',
      motif: 'Consultation gynécologique',
      notes: 'Première consultation'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Informations du dispensaire (fictives pour la démo)
  const dispensaireInfo = {
    nom: 'Dispensaire Central Douala',
    adresse: '123 Avenue de la Liberté, Douala',
    telephone: '+237 657 755 800',
    email: 'contact@dispensaire-central.com'
  };

  // Fonctions pour gérer les médecins
  const handleAddMedecin = () => {
    setCurrentItem(null);
    setModalType('medecin');
    setShowModal(true);
  };

  const handleEditMedecin = (medecin) => {
    setCurrentItem(medecin);
    setModalType('medecin');
    setShowModal(true);
  };

  const handleDeleteMedecin = (medecinId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      setMedecins(medecins.filter(m => m.id !== medecinId));
    }
  };

  // Fonctions pour gérer les horaires
  const handleEditHoraire = (horaire) => {
    setCurrentItem(horaire);
    setModalType('horaire');
    setShowModal(true);
  };

  // Fonctions pour gérer les rendez-vous
  const handleEditRendezVous = (rdv) => {
    setCurrentItem(rdv);
    setModalType('rendezVous');
    setShowModal(true);
  };

  const handleDeleteRendezVous = (rdvId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      setRendezVous(rendezVous.filter(rdv => rdv.id !== rdvId));
    }
  };

  // Filtres
  const filteredMedecins = medecins.filter(medecin =>
    medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medecin.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRendezVous = rendezVous.filter(rdv =>
    rdv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rdv.medecin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rdv.motif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques
  const stats = [
    {
      title: 'Médecins Actifs',
      value: medecins.filter(m => m.status === 'Actif').length,
      icon: '👨‍⚕️',
      color: 'bg-[#37A936]'
    },
    {
      title: 'RDV Aujourd\'hui',
      value: rendezVous.filter(rdv => rdv.date === '2025-06-23').length,
      icon: '📅',
      color: 'bg-[#10425d]'
    },
    {
      title: 'RDV En Attente',
      value: rendezVous.filter(rdv => rdv.statut === 'En attente').length,
      icon: '⏳',
      color: 'bg-yellow-500'
    },
    {
      title: 'Total RDV',
      value: rendezVous.length,
      icon: '📊',
      color: 'bg-[#bfd2f8]'
    }
  ];

  // Utilitaires
  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'text-[#37A936] bg-green-100';
      case 'En congé': return 'text-orange-600 bg-orange-100';
      case 'Confirmé': return 'text-[#37A936] bg-green-100';
      case 'En attente': return 'text-yellow-600 bg-yellow-100';
      case 'Annulé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold flex gap-3 text-[#10425d] truncate" style={{
                fontFamily: 'var(--title-font-family)',
                fontSize: 'clamp(18px, 4vw, var(--title-font-size))',
                fontWeight: 'var(--title-font-weight)'
              }}>
                <img className="w-5 h-5" src="/assets/dashico.png" alt="dashico" />
                <span className="hidden sm:inline">Dashboard Médecin Chef - </span>{dispensaireInfo.nom}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden md:inline text-[#10425d] text-sm sm:text-base" style={{
                fontFamily: 'var(--body-font-family)',
                fontSize: 'var(--body-font-size)'
              }}>
                Dr. Jean Kouam
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#37A936] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                JK
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="-mb-px flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
            {[
              { id: 'medecins', label: 'Gestion Médecins', icon: '👨‍⚕️', shortLabel: 'Médecins' },
              { id: 'horaires', label: 'Horaires Service', icon: '🕐', shortLabel: 'Horaires' },
              { id: 'rendezVous', label: 'Rendez-vous', icon: '📅', shortLabel: 'RDV' },
              { id: 'stats', label: 'Statistiques', icon: '📊', shortLabel: 'Stats' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm w-full sm:w-auto text-center sm:text-left ${
                  activeTab === tab.id
                    ? 'border-[#37A936] text-[#37A936] bg-green-50 sm:bg-transparent'
                    : 'border-transparent text-gray-500 hover:text-[#10425d] hover:border-gray-300'
                }`}
                style={{
                  fontFamily: 'var(--button-text-font-family)',
                  fontSize: 'var(--button-text-font-size)',
                  fontWeight: 'var(--button-text-font-weight)'
                }}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className={`${stat.color} rounded-lg p-2 sm:p-3 mb-2 sm:mb-0 sm:mr-3 lg:mr-4`}>
                  <span className="text-lg sm:text-xl lg:text-2xl">{stat.icon}</span>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1" style={{
                    fontFamily: 'var(--small-font-family)',
                    fontSize: 'clamp(10px, 2.5vw, var(--small-font-size))'
                  }}>
                    {stat.title}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#10425d]" style={{
                    fontFamily: 'var(--display-2-font-family)',
                    fontSize: 'clamp(18px, 5vw, var(--display-2-font-size))'
                  }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gestion des Médecins */}
        {activeTab === 'medecins' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#10425d]" style={{
                  fontFamily: 'var(--title-font-family)',
                  fontSize: 'clamp(16px, 4vw, 20px)',
                  fontWeight: 'var(--title-font-weight)'
                }}>
                  Gestion des Médecins
                </h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher un médecin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-black rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  />
                  <button
                    onClick={handleAddMedecin}
                    className="btn bg-[#37A936] hover:bg-[#2d8f2c] text-white px-4 py-2 rounded-md font-medium flex items-center justify-center text-sm whitespace-nowrap"
                  >
                    <span className="mr-1 sm:mr-2">+</span>
                    <span className="hidden sm:inline">Ajouter </span>Médecin
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'nom', label: 'Nom', mobile: true },
                      { key: 'specialite', label: 'Spécialité', mobile: true },
                      { key: 'email', label: 'Email', mobile: false },
                      { key: 'telephone', label: 'Téléphone', mobile: false },
                      { key: 'actions', label: 'Actions', mobile: true }
                    ].map((header) => (
                      <th
                        key={header.key}
                        className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          !header.mobile ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedecins.map((medecin) => (
                    <motion.tr
                      key={medecin.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10425d] rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 text-xs sm:text-sm">
                            {medecin.nom.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {medecin.nom}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {medecin.specialite}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {medecin.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {medecin.telephone}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleEditMedecin(medecin)}
                            className="text-[#37A936] hover:text-[#2d8f2c] font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Modifier</span>
                            <span className="sm:hidden">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMedecin(medecin.id)}
                            className="text-red-600 hover:text-red-900 font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Supprimer</span>
                            <span className="sm:hidden">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gestion des Horaires */}
        {activeTab === 'horaires' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-[#10425d]">
                Horaires de Service
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Définissez les horaires d`ouverture du dispensaire pour les rendez-vous
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ouverture</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fermeture</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Pause</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {horaires.map((horaire) => (
                    <tr key={horaire.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {horaire.jour}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {horaire.actif ? horaire.heureOuverture || 'Non défini' : 'Fermé'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {horaire.actif ? horaire.heureFermeture || 'Non défini' : 'Fermé'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {horaire.actif && horaire.pauseDebut && horaire.pauseFin 
                          ? `${horaire.pauseDebut} - ${horaire.pauseFin}`
                          : 'Aucune'
                        }
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditHoraire(horaire)}
                          className="text-[#37A936] hover:text-[#2d8f2c] font-medium"
                        >
                          <span className="hidden sm:inline">Modifier</span>
                          <span className="sm:hidden">✏️</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gestion des Rendez-vous */}
        {activeTab === 'rendezVous' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-[#10425d]">
                  Gestion des Rendez-vous
                </h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher un rendez-vous..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-black rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  />
                  <select className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm">
                    <option value="">Tous les statuts</option>
                    <option value="Confirmé">Confirmé</option>
                    <option value="En attente">En attente</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'patient', label: 'Patient', mobile: true },
                      { key: 'medecin', label: 'Médecin', mobile: false },
                      { key: 'date', label: 'Date', mobile: true },
                      { key: 'heure', label: 'Heure', mobile: true },
                      { key: 'motif', label: 'Motif', mobile: false },
                      { key: 'statut', label: 'Statut', mobile: true },
                      { key: 'actions', label: 'Actions', mobile: true }
                    ].map((header) => (
                      <th
                        key={header.key}
                        className={`px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          !header.mobile ? 'hidden md:table-cell' : ''
                        }`}
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRendezVous.map((rdv) => (
                    <motion.tr
                      key={rdv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{rdv.patient}</div>
                          <div className="text-xs text-gray-500">{rdv.telephonePatient}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {rdv.medecin}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {new Date(rdv.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {rdv.heure}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        <div className="max-w-[150px] truncate">{rdv.motif}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rdv.statut)}`}>
                          {rdv.statut}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleEditRendezVous(rdv)}
                            className="text-[#37A936] hover:text-[#2d8f2c] font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Modifier</span>
                            <span className="sm:hidden">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRendezVous(rdv.id)}
                            className="text-red-600 hover:text-red-900 font-medium text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Annuler</span>
                            <span className="sm:hidden">❌</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section Statistiques */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#10425d] mb-4 sm:mb-6">
                Statistiques du Dispensaire
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="font-medium text-[#10425d] mb-2 text-sm sm:text-base">Répartition des Médecins</h3>
                  <div className="space-y-2">
                    {['Médecine Générale', 'Pédiatrie', 'Gynécologie'].map((specialite) => {
                      const count = medecins.filter(m => m.specialite === specialite).length;
                      const percentage = medecins.length > 0 ? ((count / medecins.length) * 100).toFixed(1) : '0';
                      return (
                        <div key={specialite} className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-600">{specialite}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-medium">{count}</span>
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-3 sm:p-4 border rounded-lg">
                  <h3 className="font-medium text-[#10425d] mb-2 text-sm sm:text-base">Rendez-vous par Statut</h3>
                  <div className="space-y-2">
                    {['Confirmé', 'En attente', 'Annulé'].map((statut) => {
                      const count = rendezVous.filter(rdv => rdv.statut === statut).length;
                      return (
                        <div key={statut} className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-600">{statut}</span>
                          <span className={`text-xs sm:text-sm font-medium ${
                            statut === 'Confirmé' ? 'text-[#37A936]' : 
                            statut === 'En attente' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="font-medium text-[#10425d] mb-4">Informations du Dispensaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du dispensaire</label>
                  <input
                    type="text"
                    value={dispensaireInfo.nom}
                    className="w-full px-3 py-2 border text-secondary border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={dispensaireInfo.telephone}
                    className="w-full px-3 py-2 border text-secondary border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={dispensaireInfo.adresse}
                    className="w-full px-3 py-2 border text-secondary border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal universel */}
      {showModal && (
        <UniversalModal
          type={modalType}
          item={currentItem}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (modalType === 'medecin') {
              if (currentItem) {
                setMedecins(medecins.map(m => m.id === currentItem.id ? { ...m, ...data } : m));
              } else {
                const newMedecin = {
                  id: Math.max(...medecins.map(m => m.id)) + 1,
                  ...data
                };
                setMedecins([...medecins, newMedecin]);
              }
            } else if (modalType === 'horaire') {
              setHoraires(horaires.map(h => h.id === currentItem.id ? { ...h, ...data } : h));
            } else if (modalType === 'rendezVous') {
              setRendezVous(rendezVous.map(rdv => rdv.id === currentItem.id ? { ...rdv, ...data } : rdv));
            }
            setShowModal(false);
          }}
          medecins={medecins}
        />
      )}
    </div>
  );
};

// Composant Modal universel
const UniversalModal = ({ type, item, isOpen, onClose, onSave, medecins }) => {
  const [formData, setFormData] = useState(() => {
    if (type === 'medecin') {
      return {
        nom: item?.nom || '',
        email: item?.email || '',
        specialite: item?.specialite || 'Médecine Générale',
        telephone: item?.telephone || '',
        dateEmbauche: item?.dateEmbauche || new Date().toISOString().split('T')[0]
      };
    } else if (type === 'horaire') {
      return {
        heureOuverture: item?.heureOuverture || '',
        heureFermeture: item?.heureFermeture || '',
        pauseDebut: item?.pauseDebut || '',
        pauseFin: item?.pauseFin || '',
      };
    } else if (type === 'rendezVous') {
      return {
        patient: item?.patient || '',
        telephonePatient: item?.telephonePatient || '',
        medecin: item?.medecin || '',
        date: item?.date || '',
        heure: item?.heure || '',
        motif: item?.motif || '',
        statut: item?.statut || 'En attente',
        notes: item?.notes || ''
      };
    }
    return {};
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (type) {
      case 'medecin': return item ? 'Modifier Médecin' : 'Ajouter Médecin';
      case 'horaire': return `Modifier Horaires - ${item?.jour}`;
      case 'rendezVous': return 'Modifier Rendez-vous';
      default: return 'Modal';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-[#10425d] mb-4">
          {getModalTitle()}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {type === 'medecin' && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <select
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  >
                    <option value="Médecine Générale">Médecine Générale</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Cardiologie">Cardiologie</option>
                    <option value="Dermatologie">Dermatologie</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date d`embauche</label>
                <input
                  type="date"
                  value={formData.dateEmbauche}
                  onChange={(e) => setFormData({ ...formData, dateEmbauche: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
            </>
          )}

          {type === 'horaire' && (
            <>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="actif" className="text-sm font-medium text-gray-700">
                  Jour actif (ouvert)
                </label>
              </div>
              
              {formData.actif && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Heure d`ouverture</label>
                      <input
                        type="time"
                        value={formData.heureOuverture}
                        onChange={(e) => setFormData({ ...formData, heureOuverture: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Heure de fermeture</label>
                      <input
                        type="time"
                        value={formData.heureFermeture}
                        onChange={(e) => setFormData({ ...formData, heureFermeture: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Début pause (optionnel)</label>
                      <input
                        type="time"
                        value={formData.pauseDebut}
                        onChange={(e) => setFormData({ ...formData, pauseDebut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fin pause (optionnel)</label>
                      <input
                        type="time"
                        value={formData.pauseFin}
                        onChange={(e) => setFormData({ ...formData, pauseFin: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {type === 'rendezVous' && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Patient</label>
                <input
                  type="text"
                  value={formData.patient}
                  onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Téléphone patient</label>
                <input
                  type="tel"
                  value={formData.telephonePatient}
                  onChange={(e) => setFormData({ ...formData, telephonePatient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Médecin</label>
                <select
                  value={formData.medecin}
                  onChange={(e) => setFormData({ ...formData, medecin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  required
                >
                  <option value="">Sélectionner un médecin</option>
                  {medecins.filter(m => m.status === 'Actif').map(medecin => (
                    <option key={medecin.id} value={medecin.nom}>{medecin.nom}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Motif de consultation</label>
                <textarea
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  rows="2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmé">Confirmé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#37A936] focus:border-[#37A936] text-sm"
                  rows="2"
                />
              </div>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 btn bg-[#37A936] hover:bg-[#2d8f2c] text-white px-4 py-2 rounded-md text-sm"
            >
              {item ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// PropTypes
UniversalModal.propTypes = {
  type: PropTypes.oneOf(['medecin', 'horaire', 'rendezVous']).isRequired,
  item: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  medecins: PropTypes.array
};

export default Medecins;
