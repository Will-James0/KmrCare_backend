/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
//* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../../components/doctors/DoctorForm.jsx';
import { 
  Home, 
  Users, 
  Calendar, 
  User, 
  LogOut, 
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  Activity,
  UserCheck,
  CalendarDays,
  Settings,
  Filter,
  Eye
} from 'lucide-react';
import { useAuth, useAuthActions, useAuthState } from '../../_store/auth.js';
import { useNotify } from '../../_store/notifications.js';
import { careAPI } from '../../_lib/api.js';
import * as doctorService from '../../_lib/doctorService.js';
import { appointmentAPI } from '../../_lib/api.js';
import EndAppointmentForm from '../../components/Modals/EndAppointmentForm.jsx';
// Composant formulaire pour les médecins


const HomeDoctor = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const { user, isLoading, getDispensaryToken, getDispensary } = useAuthState();
  const notify = useNotify();
  
  // États locaux
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Chargement des médecins depuis l'API
  const fetchDoctors = async () => {
    const dispensaryToken = getDispensaryToken();
    console.log('🔍 fetchDoctors - Token dispensaire récupéré:', dispensaryToken);
    
    if (!dispensaryToken) {
      console.warn('⚠️ Token du dispensaire non disponible');
      return;
    }
    
    setLoadingDoctors(true);
    try {
      const data = await doctorService.fetchDispensaryDoctors(); // Utiliser fetchDispensaryDoctors
      console.log('📋 Données médecins récupérées:', data);
      setDoctors(data);
      setIsDataLoaded(true);
    } catch (error) {
      notify.error('Erreur lors du chargement des médecins');
      console.error('Load doctors error:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Chargement initial des données - une seule fois comme dans Vue onMounted
  useEffect(() => {
    if (!isDataLoaded) {
      fetchDoctors();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Gestion des médecins
  const handleCreateDoctor = async (doctorData) => {
    const dispensaryToken = getDispensaryToken();
    if (!dispensaryToken) {
      notify.error('Token du dispensaire non disponible. Veuillez vous reconnecter.');
      return;
    }
    
    console.log("🔽 Création médecin avec:", doctorData);
    console.log("🔑 Token dispensaire:", dispensaryToken);

    try {
      await doctorService.createDoctor(dispensaryToken, doctorData);
      notify.success('Médecin ajouté avec succès');
      fetchDoctors(); // Recharger après création
      setShowModal(false);
    } catch (error) {
      console.error("❌ Erreur création médecin:", error);
      notify.error(error.message || 'Erreur lors de l\'ajout du médecin');
    }
  };


  const handleUpdateDoctor = async (doctorToken, updateData) => {
    try {
      await doctorService.updateDoctor(doctorToken, updateData);
      notify.success('Médecin modifié avec succès');
      fetchDoctors(); // Recharger après modification
      setShowModal(false);
    } catch (error) {
      notify.error(error.message || 'Erreur lors de la modification du médecin');
    }
  };

  const handleDeleteDoctor = async (doctorToken) => {
    try {
      await doctorService.removeDoctorFromService(doctorToken);
      fetchDoctors(); // Recharger après suppression
    } catch (error) {
      notify.error(error.message || 'Erreur lors de la suppression du médecin');
    }
  };

  // Données de démo pour les rendez-vous
  const [myAppointments] = useState([
    {
      id: 1,
      patientName: 'Jean Kouam',
      patientPhone: '+237 657 755 897',
      doctorName: 'Dr. Amina Bassong',
      dispensaryName: 'Dispensaire Central Douala',
      date: '2025-07-28',
      time: '09:00',
      reason: 'Consultation générale',
      status: 'Confirmé',
      notes: ''
    },
    {
      id: 2,
      patientName: 'Marie Ngono',
      patientPhone: '+237 657 755 898',
      doctorName: 'Dr. Paul Mboma',
      dispensaryName: 'Dispensaire Central Douala',
      date: '2025-07-28',
      time: '10:30',
      reason: 'Suivi pédiatrique',
      status: 'En attente',
      notes: ''
    },
    {
      id: 3,
      patientName: 'Claire Ateba',
      patientPhone: '+237 657 755 899',
      doctorName: 'Dr. Marie Ekotto',
      dispensaryName: 'Dispensaire Central Douala',
      date: '2025-07-29',
      time: '14:00',
      reason: 'Consultation gynécologique',
      status: 'Confirmé',
      notes: 'Première consultation'
    },
    {
      id: 4,
      patientName: 'Patrick Mvondo',
      patientPhone: '+237 657 755 890',
      doctorName: 'Dr. Jean Nkomo',
      dispensaryName: 'Dispensaire Omnisport',
      date: '2025-07-28',
      time: '15:30',
      reason: 'Blessure sportive',
      status: 'Confirmé',
      notes: 'Entorse cheville'
    }
  ]);

  // Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      notify.success('Déconnexion réussie');
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Gestion des modals
  const handleAddDoctor = () => {
    setCurrentItem(null);
    setModalType('doctor');
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    console.log('🔧 Édition médecin - Données reçues:', doctor);
    setCurrentItem(doctor);
    setModalType('doctor');
    setShowModal(true);
  };

  const handleDeleteDoctorConfirm = (doctor) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le Dr. ${doctor.first_name} ${doctor.last_name} ?`)) {
      handleDeleteDoctor(doctor.token);
    }
  };

  const handleViewAppointment = (appointment) => {
    setCurrentItem(appointment);
    setModalType('appointment');
    setShowModal(true);
  };

  // Filtrage des données
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const filteredAppointments = myAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calcul des statistiques
  const stats = [
    {
      title: 'Médecins Actifs',
      value: doctors.filter(d => d.status === 'Actif' || d.is_active).length,
      icon: UserCheck,
      color: 'bg-[#0f425d]',
      textColor: 'text-white'
    },
    {
      title: 'Total Médecins',
      value: doctors.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-white'
    }
  ];

  // Items de la sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'doctors', label: 'Mes Médecins', icon: Users },
    { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
    { id: 'history', label: 'Mon Historique', icon: Calendar },
    // { id: 'profile', label: 'Mon Profil', icon: User }
  ];

  // Composant Sidebar
  const Sidebar = () => (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="KmrCare" className="h-10 w-auto" />
          <div>
            <h2 className="font-bold text-[#0f425d]">KmrCare</h2>
            <p className="text-sm text-gray-500">Espace Docteur</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center text-white font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div>
            <p className="font-medium text-[#0f425d]">
              Dr. {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-gray-500">{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#0b9444] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  // Composant Dashboard
  const Dashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f425d] mb-2">
          Bienvenue, {user?.username} !
        </h1>
        <p className="text-gray-600">
          Gérez vos dispensaires, médecins et rendez-vous en un seul endroit
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0b9444]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0f425d]">{stat.title}</h3>
                <div className={`${stat.color} rounded-lg p-2`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f425d] mb-2">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#0b9444] to-[#0a7c3a] rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-3">💼 Gérer Dispensaire</h3>
          <p className="mb-4 text-sm opacity-90">
            Modifiez les informations de votre dispensaire
          </p>
          <button
            onClick={() => setActiveTab('dispensaries')}
            className="bg-white text-[#0b9444] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Accéder
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#0f425d] to-[#0d3a51] rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-3">👩‍⚕️ Gérer Médecins</h3>
          <p className="mb-4 text-sm opacity-90">
            Ajouter, modifier ou supprimer des médecins
          </p>
          <button
            onClick={() => setActiveTab('doctors')}
            className="bg-white text-[#0f425d] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Accéder
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-3">📅 Voir RDV</h3>
          <p className="mb-4 text-sm opacity-90">
            Consultez tous les rendez-vous
          </p>
          <button
            onClick={() => setActiveTab('appointments')}
            className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Accéder
          </button>
        </motion.div>
      </div>

      {/* Aperçu des prochains rendez-vous */}
      {/* <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#0f425d]">Prochains Rendez-vous</h3>
          <button
            onClick={() => setActiveTab('appointments')}
            className="text-[#0b9444] hover:text-[#0a7c3a] font-medium flex items-center gap-2"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {myAppointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-[#0f425d]">{appointment.patientName}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'Confirmé' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{appointment.doctorName} - {appointment.dispensaryName}</p>
                <p className="text-sm text-gray-500">{appointment.reason}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#0f425d]">{appointment.time}</p>
                <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );

  // Composant Gestion des Dispensaires
  // Composant Gestion des Médecins
  const DoctorsManagement = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0f425d] mb-2">
          Mes Médecins
        </h1>
        <p className="text-gray-600">
          Gérez les médecins de vos dispensaires
        </p>
      </div>

      {/* Barre d'outils */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un médecin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent text-black"
          />
        </div>
        <button
          onClick={handleAddDoctor}
          className="bg-[#0b9444] text-white px-6 py-3 rounded-lg hover:bg-[#0a7c3a] transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter Médecin
        </button>
      </div>

      {/* Liste des médecins */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => {
                console.log('👨‍⚕️ Affichage médecin:', doctor); // Debug des données
                return (
                <motion.tr
                  key={doctor.id || doctor.token}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#0f425d] rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {doctor.user.first_name?.[0] || 'N'}{doctor.user.last_name?.[0] || 'A'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.user.first_name || ''} {doctor.user.last_name || ''}
                        </div>
                        <div className="text-sm text-gray-500">{doctor.user.phone || doctor.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.speciality || doctor.specialization || 'Non spécifiée'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      doctor.role === 'CHIEF_DOCTOR' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {doctor.role === 'CHIEF_DOCTOR' ? 'Médecin Chef' : 'Médecin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="text-[#0b9444] hover:text-[#0a7c3a] font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteDoctorConfirm(doctor)}
                      className="text-red-600 hover:text-red-900 font-medium ml-2"
                    >
                      Supprimer
                    </button>
                  </td>
                </motion.tr>
              )}) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {loadingDoctors ? 'Chargement...' : 'Aucun médecin trouvé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // États pour les rendez-vous
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const [currentAppointmentToken, setCurrentAppointmentToken] = useState(null);
    const [observation, setObservation] = useState("");
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loadingEnd, setLoadingEnd] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
  
    // Charger les rendez-vous du patient
    const loadAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await appointmentAPI.dispensary.getAppointments();
        setAppointments(response || []);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        notify.error('Impossible de charger vos rendez-vous');
      } finally {
        setLoadingAppointments(false);
      }
    };
  
    const loadAppointmentsDetail = async (token) => {
      try {
        setShowAppointmentDetails(true);
        const response = await appointmentAPI.dispensary.getAppointmentDetail(token);
        setSelectedAppointment(response || null);
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        notify.error('Impossible de charger vos rendez-vous');
      } finally {
        setShowAppointmentDetails(false);
      }
    };

    const confirmAppointment = async (token) => {
      try {
        await appointmentAPI.dispensary.confirmAppointment(token);
        loadAppointments(); // Recharger la liste des rendez-vous
        notify.success("Rendez-vous confirmé");
      } catch (error) {
        console.error('Erreur lors de la confirmation du rendez-vous:', error);
        notify.error("Impossible de confirmer le rendez-vous");
      }
    };

    const rejectAppointment = async (token) => {
      try {
        await appointmentAPI.dispensary.rejectAppointment(token);
        loadAppointments(); // Recharger la liste des rendez-vous
        notify.success("Rendez-vous rejeté");
      } catch (error) {
        console.error('Erreur lors du rejet du rendez-vous:', error);
        notify.error("Impossible de rejeter le rendez-vous");
      }
    };

    const startAppointment = async (token) => {
      try {
        await appointmentAPI.dispensary.startAppointment(token);
        loadAppointments(); // Recharger la liste des rendez-vous
        notify.success("Rendez-vous démarré");
      } catch (error) {
        console.error('Erreur lors du démarrage du rendez-vous:', error);
        notify.error("Impossible de démarrer le rendez-vous");
      }
    };

    const openEndModal = (appointment) => {
      setSelectedAppointment(appointment);
      setShowEndModal(true);
    };

    const endAppointment = async ({ observation }) => {
      try {
        setLoadingEnd(true);
        await appointmentAPI.dispensary.endAppointment(selectedAppointment.token, { observation });
        notify.success("Rendez-vous terminé !");
        setShowEndModal(false);
        setSelectedAppointment(null);
        loadAppointments(); // recharge
      } catch (err) {
        console.error("Erreur :", err);
        notify.error("Échec lors de la confirmation du rendez-vous");
      } finally {
        setLoadingEnd(false);
      }
    };


    const cancelAppointment = async (token) => {
      try {
        await appointmentAPI.dispensary.cancelAppointment(token);
        loadAppointments(); // Recharger la liste des rendez-vous
        notify.success("Rendez-vous annulé avec succès");
      } catch {
        notify.error("Impossible d'annuler le rendez-vous");
      }
    }
  
  
    // Charger les rendez-vous quand l'onglet appointments est sélectionné
    useEffect(() => {
      if (activeTab === 'appointments') {
        loadAppointments();
      }
    }, [activeTab]);
  
    const [histories, setHistories] = useState([]);
    const [loadingHistories, setLoadingHistories] = useState(false);
  
    const loadHistories = async () => {
      try {
        setLoadingHistories(true);
        const response = await appointmentAPI.dispensary.getHistory();
        setHistories(response || []);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique des rendez-vous:', error);
        notify.error('Impossible de charger l\'historique des rendez-vous');
      } finally {
        setLoadingHistories(false);
      }
    }
  
    useEffect(() => {
      if (activeTab === 'history') {
        loadHistories();
      }
    }, [activeTab]);
  
    // Fonction pour formater le statut
    const getStatusDisplay = (status) => {
      const statusMap = {
        'pending': { text: 'En attente', color: 'text-yellow-600 bg-yellow-100' },
        'confirmed': { text: 'Confirmé', color: 'text-green-600 bg-green-100' },
        'cancelled': { text: 'Annulé', color: 'text-red-600 bg-red-100' },
        'completed': { text: 'Terminé', color: 'text-blue-600 bg-blue-100' },
        'started': { text: 'En cours', color: 'text-purple-600 bg-purple-100' }
      };
      
      return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-100' };
    };
  
    // Fonction pour formater la date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };
  
    const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
    // Fonction pour formater l'heure
    const formatTime = (timeString) => {
      return timeString.slice(0, 5); // Garde seulement HH:MM
    };

  // Composant Gestion des Rendez-vous
  const AppointmentsManagement = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0f425d] mb-2">
          Rendez-vous
        </h1>
        <p className="text-gray-600">
          Consultez tous les rendez-vous de vos dispensaires
        </p>
      </div>

      {/* Barre d'outils */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <button
            onClick={loadAppointments}
            className="px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {showEndModal && (
        <EndAppointmentForm
          appointment={selectedAppointment}
          onSubmit={endAppointment}
          onCancel={() => setShowEndModal(false)}
          loading={loadingEnd}
        />
      )}


      {/* Liste des rendez-vous */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispensaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
             {appointments.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-gray-500 text-center" colSpan="7">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-12 h-12 text-gray-300 mb-2" />
                      <span>Aucun rendez-vous trouvé</span>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => {
                const statusInfo = getStatusDisplay(appointment.status);
                return (
                <motion.tr
                  key={appointment.token || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleViewAppointment(appointment)}>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient.username || appointment.patient.last_name || appointment.patient.first_name }
                      </div>
                      <div className="text-sm text-gray-500">{appointment.patient.phone || appointment.patient.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.doctorName}
                    {appointment.reason || 'Non spécifié'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.dispensary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date ? formatDate(appointment.date) : '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.hour ? formatTime(appointment.hour) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {appointment.status === "PENDING" && (
                      <div>
                        <button
                        onClick={() => confirmAppointment(appointment.token)}
                        className="text-green-600 hover:text-green-900 font-medium mr-2"
                      >
                        ✅ Accepter
                      </button>
                      <button
                        onClick={() => rejectAppointment(appointment.token)}
                        className="text-red-600 hover:text-red-900 font-medium mr-2"
                      >
                        ❌ Rejeter
                      </button>
                      </div>
                      
                    )}
                    {appointment.status === "CONFIRMED" && (
                      <div>
                        <button
                        onClick={() => startAppointment(appointment.token)}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-2"
                      >
                        ▶️ Démarrer
                      </button>
                      <button
                        onClick={() => cancelAppointment(appointment.token)}
                        className="text-red-600 hover:text-red-900 font-medium mr-2"
                      >
                        ❌ Annuler
                      </button>
                      </div>
                    )}
                    {appointment.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => openEndModal(appointment)}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-2"
                      >
                        ⏹️ Terminer
                      </button>
                    )}
                  </td>
                </motion.tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Historique

  const HistoryAppointmentsTable = () => (
    <main className='p-4'>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0f425d] mb-2">Mon Historique</h2>
            <p className="text-gray-600">Consultez l'historique de vos rendez-vous médicaux</p>
          </div>
          <button
            onClick={loadHistories}
            className="px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {loadingHistories ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-[#0b9444] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Chargement...</span>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className='bg-gray-300 rounded-t-xl'>
              <th className="px-4 py-2 font-semibold text-black">Patient</th>
              <th className="px-4 py-2 font-semibold text-black">Date</th>
              <th className="px-4 py-2 font-semibold text-black">Heure</th>
              <th className="px-4 py-2 font-semibold text-black">Motif</th>
              <th className="px-4 py-2 font-semibold text-black">Terminé / Annulé</th>
              <th className="px-4 py-2 font-semibold text-black">Statut</th>
              <th className="px-4 py-2 font-semibold text-black">Observations</th>
              {/* <th className="px-4 py-2 font-semibold text-black">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {histories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-gray-900 text-center">
                  <span>Aucun historique trouvé</span>
                </td>
              </tr>
            ) : (
              histories.map((history, index) => {
                const statusInfo = getStatusDisplay(history.final_status);
                return (
                  <tr key={history.token || index} className="border-b hover:bg-gray-50 text-center">
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleViewAppointment(appointment)}>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {history.patient.username || history.patient.last_name || history.patient.first_name }
                      </div>
                      <div className="text-sm text-gray-500">{history.patient.phone || history.patient.email}</div>
                    </div>
                  </td>
                    <td className="px-4 py-3 text-gray-900">
                      {history.date ? formatDate(history.date) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {history.hour ? formatTime(history.hour) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {history.reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {history.completed_at ? formatDateTime(history.completed_at) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {history.observations || '-'}
                    </td>
                    {/* <td className="px-4 py-3 ">
                      <div className="flex gap-2">
                        <button className="text-[#0b9444] text-center hover:text-[#0a7c3a] text-sm font-medium">
                          Détails
                        </button>
                      </div>
                    </td> */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </main>
  );

  // Composant placeholder pour le profil
  const ProfileTab = () => (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-[#0f425d] mb-2">Mon Profil</h2>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>
    </div>
  );

  // Rendu du contenu principal
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'doctors':
        return <DoctorsManagement />;
      case 'appointments':
        return <AppointmentsManagement />;
      case 'history':
        return <HistoryAppointmentsTable />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0b9444] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal simple pour démonstration */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-[#0f425d] mb-4">
              {modalType === 'dispensary' ? 'Dispensaire' :
               modalType === 'doctor' ? 'Médecin' :
               modalType === 'appointment' ? 'Rendez-vous' : 'Détails'}
            </h2>
            
            <div className="space-y-4">
              {modalType === 'appointment' && currentItem && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient</label>
                    <p className="text-sm text-gray-900">{currentItem.patientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{currentItem.patientPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Médecin</label>
                    <p className="text-sm text-gray-900">{currentItem.doctorName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date et Heure</label>
                    <p className="text-sm text-gray-900">
                      {new Date(currentItem.date).toLocaleDateString('fr-FR')} à {currentItem.time}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motif</label>
                    <p className="text-sm text-gray-900">{currentItem.reason}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currentItem.status === 'Confirmé' ? 'bg-green-100 text-green-800' :
                      currentItem.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentItem.status}
                    </span>
                  </div>
                  {currentItem.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-sm text-gray-900">{currentItem.notes}</p>
                    </div>
                  )}
                </div>
              )}
              
              {modalType !== 'appointment' && modalType === 'doctor' && (
                <DoctorForm
                  doctor={currentItem}
                  onSubmit={currentItem ? 
                    (data) => handleUpdateDoctor(currentItem.token, data) : 
                    handleCreateDoctor
                  }
                  onCancel={() => setShowModal(false)}
                />
              )}
              
              {modalType !== 'appointment' && modalType !== 'doctor' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Formulaire à implémenter pour {modalType}
                  </p>
                </div>
              )}
            </div>
            
            {modalType === 'appointment' && (
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomeDoctor;
