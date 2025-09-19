/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-duplicate-case */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Hospital, 
  User, 
  LogOut, 
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  ChevronRight,
  History
} from 'lucide-react';
import { useAuth, useAuthActions, useAuthState } from '../_store/auth.js';
import { useNotify } from '../_store/notifications.js';
import { appointmentAPI, careAPI } from '../_lib/api.js';
import PatientAppointments from '../components/PatientAppointments.jsx';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();
  const { user, isLoading } = useAuthState();
  const notify = useNotify();
  
  // États locaux
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dispensaries, setDispensaries] = useState([]);
  const [loadingDispensaries, setLoadingDispensaries] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDispensary, setSelectedDispensary] = useState(null);

  // Chargement des dispensaires
  useEffect(() => {
    if (activeTab === 'catalogue') {
      loadDispensaries();
    }
  }, [activeTab]);

  const loadDispensaries = async () => {
    try {
      setLoadingDispensaries(true);
      const response = await careAPI.getDispensaries();
      setDispensaries(response || []);
    } catch (error) {
      console.error('Erreur lors du chargement des dispensaires:', error);
      notify.error('Impossible de charger les dispensaires');
    } finally {
      setLoadingDispensaries(false);
    }
  };

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

  // Navigation vers la réservation
  const handleSelectDispensary = (dispensary) => {
    setSelectedDispensary(dispensary);
    // Naviguer vers la page de réservation avec l'ID du dispensaire
    navigate(`/patient/reservation/${dispensary.token}`, {
      state: { dispensary }
    });
  };

  // Filtrage des dispensaires
  const filteredDispensaries = dispensaries.filter(dispensary =>
    dispensary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispensary.quarter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispensary.specialities?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Items de la sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'catalogue', label: 'Catalogue Dispensaires', icon: Hospital },
    { id: 'appointments', label: 'Mes Rendez-vous', icon: Calendar },
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
            <p className="text-sm text-gray-500">Espace Patient</p>
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
              {user?.first_name} {user?.last_name}
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
          Gérez vos rendez-vous médicaux en toute simplicité
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Carte Prochains RDV */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0b9444]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0f425d]">Prochains Rendez-vous</h3>
            <Calendar className="w-6 h-6 text-[#0b9444]" />
          </div>
          <p className="text-2xl font-bold text-[#0f425d] mb-2">0</p>
        </div>

        {/* Carte Dispensaires Favoris */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0f425d]">Nombre de Rendez-vous</h3>
            <Star className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-[#0f425d] mb-2">0</p>
        </div>

        {/* Carte Action Rapide */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0f425d]">Action Rapide</h3>
            <Hospital className="w-6 h-6 text-orange-500" />
          </div>
          <button
            onClick={() => setActiveTab('catalogue')}
            className="w-full py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors"
          >
            Prendre RDV
          </button>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-[#0f425d] to-[#0b9444] rounded-xl p-6 text-white mb-8">
        <h3 className="text-xl font-bold mb-3">🚀 Conseils Santé</h3>
        <p className="mb-4">
          N'oubliez pas de prendre vos médicaments selon les prescriptions et de maintenir un mode de vie sain.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>• Consultez régulièrement votre médecin</div>
          <div>• Maintenez une alimentation équilibrée</div>
          <div>• Pratiquez une activité physique</div>
          <div>• Dormez suffisamment (7-8h/nuit)</div>
        </div>
      </div>
    </div>
  );

  // Composant Catalogue des Dispensaires
  const DispensaryCatalogue = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0f425d] mb-2">
          Catalogue des Dispensaires
        </h1>
        <p className="text-gray-600">
          Trouvez le dispensaire le plus proche de chez vous
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, quartier ou spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
          />
        </div>
      </div>

      {/* Chargement */}
      {loadingDispensaries && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0b9444] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Chargement des dispensaires...</span>
          </div>
        </div>
      )}

      {/* Liste des dispensaires */}
      {!loadingDispensaries && (
        <div className="grid gap-6">
          {filteredDispensaries.length === 0 ? (
            <div className="text-center py-12">
              <Hospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Aucun dispensaire trouvé' : 'Aucun dispensaire disponible'}
              </p>
            </div>
          ) : (
            filteredDispensaries.map((dispensary) => (
              <DispensaryCard
                key={dispensary.token}
                dispensary={dispensary}
                onSelect={() => handleSelectDispensary(dispensary)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );

  // Composant Carte Dispensaire
  const DispensaryCard = ({ dispensary, onSelect }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#0f425d] mb-2">
              {dispensary.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{dispensary.quarter}</span>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              {dispensary.specialities}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-black">4.5</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0b9444]" />
            <span className='text-[#0b9444]'>
              {dispensary.opening} - {dispensary.ending}
            </span>
          </div>
          {dispensary.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0b9444]" />
              <span className='text-[#0b9444]'>{dispensary.phone}</span>
            </div>
          )}
          {dispensary.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0b9444]" />
              <span className='text-[#0b9444]'>{dispensary.email}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <button 
            className="w-full py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Prendre rendez-vous
          </button>
        </div>
      </div>
    </motion.div>
  );

  // États pour les rendez-vous
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Charger les rendez-vous du patient
  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await appointmentAPI.patient.getAppointments();
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
      const response = await appointmentAPI.patient.getAppointmentDetail(token);
      setSelectedAppointment(response || null);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      notify.error('Impossible de charger vos rendez-vous');
    } finally {
      setShowAppointmentDetails(false);
    }
  };


  const cancelAppointment = async (token) => {
    try {
      await appointmentAPI.patient.cancelAppointment(token);
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
      const response = await appointmentAPI.patient.getHistory();
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

  // Composant tableau des rendez-vous
  const AppointmentsTable = () => (
    <main className='p-4'>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0f425d] mb-2">Mes Rendez-vous</h2>
            <p className="text-gray-600">Consultez et gérez vos rendez-vous médicaux</p>
          </div>
          <button
            onClick={loadAppointments}
            className="px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {loadingAppointments ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0b9444] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Chargement des rendez-vous...</span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-300 rounded-t-xl">
                <th className="px-4 py-3 text-black font-semibold">Dispensaire</th>
                <th className="px-4 py-3 text-black font-semibold">Date</th>
                <th className="px-4 py-3 text-black font-semibold">Heure</th>
                <th className="px-4 py-3 text-black font-semibold">Motif</th>
                <th className="px-4 py-3 text-black font-semibold">Statut</th>
                <th className="px-4 py-3 text-black font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
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
                    <tr key={appointment.token || index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">
                        {appointment.dispensary || 'Non spécifié'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {appointment.date ? formatDate(appointment.date) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {appointment.hour ? formatTime(appointment.hour) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {appointment.reason || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {/* {appointment.status === 'PENDING' && ( */}
                            <button onClick={() => cancelAppointment(appointment.token)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Annuler
                            </button>
                          {/* )} */}
                          {/* <button className="text-[#0b9444] hover:text-[#0a7c3a] text-sm font-medium">
                            Détails
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );

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
              <th className="px-4 py-2 font-semibold text-black">Dispensaire</th>
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
                    <td className="px-4 py-3 text-gray-900">
                      {history.dispensary || 'Non spécifié'}
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

  // Composant placeholder pour profil
  const ProfileTab = ({ title, description }) => (
    <main className='p-4'>
      <div className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-[#0f425d] mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </main>
  );

  // Rendu du contenu principal
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'catalogue':
        return <DispensaryCatalogue />;
      case 'appointments':
        return <AppointmentsTable />;
      case 'history':
        return <HistoryAppointmentsTable />;
      case 'profile':
        return (
          <ProfileTab
            title="Mon Profil"
            description="Gérez vos informations personnelles"
          />
        );
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
    </div>
  );
};

export default PatientDashboard;
