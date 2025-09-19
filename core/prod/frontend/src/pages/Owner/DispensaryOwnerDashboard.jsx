/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../_store/auth';
import { careAPI } from '../../_lib/api';

const DispensaryOwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dispensary, setDispensary] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDispensaryData();
  }, []);

  const loadDispensaryData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les dispensaires de l'utilisateur connecté
      const dispensariesResponse = await careAPI.getDispensaries();
      const dispensaries = Array.isArray(dispensariesResponse) 
        ? dispensariesResponse 
        : dispensariesResponse.results || [];
      
      // Trouver le dispensaire de l'utilisateur connecté (owner)
      const userDispensary = dispensaries.find(d => d.owner?.token === user?.token);
      
      if (userDispensary) {
        setDispensary(userDispensary);
        
        // Récupérer les médecins du dispensaire
        const doctorsResponse = await careAPI.getDoctors();
        const allDoctors = Array.isArray(doctorsResponse) 
          ? doctorsResponse 
          : doctorsResponse.results || [];
        
        // Filtrer les médecins de ce dispensaire
        const dispensaryDoctors = allDoctors.filter(d => d.dispensary?.token === userDispensary.token);
        setDoctors(dispensaryDoctors);
      } else {
        setError('Aucun dispensaire trouvé pour cet utilisateur');
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'dispensary', label: 'Mon Dispensaire', icon: '🏥' },
    { id: 'doctors', label: 'Médecins', icon: '👨‍⚕️' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Erreur</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={loadDispensaryData}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord - Propriétaire
              </h1>
              <p className="text-gray-600">
                Gérez votre dispensaire et vos équipes médicales
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt="Photo de profil" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '👤'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username || 'Propriétaire'
                  }
                </p>
                <p className="text-sm text-gray-600">Propriétaire</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab dispensary={dispensary} doctors={doctors} />}
            {activeTab === 'dispensary' && <DispensaryTab dispensary={dispensary} />}
            {activeTab === 'doctors' && <DoctorsTab doctors={doctors} dispensary={dispensary} />}
            {activeTab === 'appointments' && <AppointmentsTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Composant Vue d'ensemble
const OverviewTab = ({ dispensary, doctors }) => {
  const stats = {
    totalDoctors: doctors.length,
    todayAppointments: 12,
    weeklyAppointments: 67,
    monthlyRevenue: 450000
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Médecins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">RDV Aujourd&apos;hui</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">RDV Semaine</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weeklyAppointments}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus Mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue.toLocaleString()} FCFA</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Informations dispensaire */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Votre Dispensaire</h3>
        <div className="flex items-center space-x-4">
          {dispensary?.logo ? (
            <img 
              src={dispensary.logo} 
              alt="Logo" 
              className="h-16 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🏥</span>
            </div>
          )}
          <div>
            <h4 className="text-xl font-bold text-gray-900">{dispensary?.name}</h4>
            <p className="text-gray-600">{dispensary?.quarter}</p>
            <p className="text-gray-600">{dispensary?.phone}</p>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Nouveau rendez-vous confirmé</p>
              <p className="text-xs text-gray-500">Dr. Kouam - Il y a 15 minutes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">👨‍⚕️</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Consultation terminée</p>
              <p className="text-xs text-gray-500">Dr. Mballa - Il y a 1 heure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Dispensaire
const DispensaryTab = ({ dispensary }) => {
  if (!dispensary) return <div>Chargement...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Informations du Dispensaire</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du dispensaire</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.quarter}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Spécialités</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.specialities}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.localisation}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.phone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Horaire d&apos;ouverture</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.opening}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Horaire de fermeture</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispensary.ending}</p>
        </div>
      </div>
    </div>
  );
};

// Composant Médecins
const DoctorsTab = ({ doctors, dispensary }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Équipe Médicale</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
          + Ajouter un médecin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.token}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              {doctor.user.image ? (
                <img 
                  src={doctor.user.image} 
                  alt="Photo" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {doctor.user.first_name?.charAt(0) || '👨‍⚕️'}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900">
                  Dr. {doctor.user.first_name} {doctor.user.last_name}
                </h4>
                <p className="text-sm text-gray-600">{doctor.role.label}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {doctor.user.email}</p>
              <p><span className="font-medium">Username:</span> {doctor.user.username}</p>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors">
                Détails
              </button>
              <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors">
                Supprimer
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Composant Rendez-vous
const AppointmentsTab = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-6xl text-gray-400 mb-4">📅</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Rendez-vous</h3>
      <p className="text-gray-600 mb-4">
        Cette section permettra de gérer tous les rendez-vous de votre dispensaire.
      </p>
      <p className="text-sm text-gray-500">
        Fonctionnalité en développement - Bientôt disponible
      </p>
    </div>
  );
};

// Composant Paramètres
const SettingsTab = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres du Compte</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Informations Personnelles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input 
                type="text" 
                defaultValue={user?.first_name || ''} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input 
                type="text" 
                defaultValue={user?.last_name || ''} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input 
                type="tel" 
                defaultValue={user?.phone || ''} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default DispensaryOwnerDashboard;
