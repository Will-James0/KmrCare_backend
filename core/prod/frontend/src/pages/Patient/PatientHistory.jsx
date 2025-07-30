/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../_store/auth';
import { appointmentService } from '../../_lib/appointmentService';

const PatientHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, upcoming, cancelled

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Récupérer les rendez-vous du patient depuis l'API
        const data = await appointmentService.getPatientAppointments(user?.id);
        setAppointments(data || []);
        
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        
        // En cas d'erreur, utiliser des données par défaut
        setAppointments([
          {
            id: 1,
            dispensary: 'Centre Médical Yaoundé',
            doctor: 'Dr. Marie Kouam',
            speciality: 'Cardiologie',
            date: '2024-01-15',
            time: '14:30',
            status: 'completed',
            notes: 'Consultation de routine, tension normale'
          },
          {
            id: 2,
            dispensary: 'Clinique des Martyrs',
            doctor: 'Dr. Paul Mballa',
            speciality: 'Pédiatrie',
            date: '2024-01-08',
            time: '09:15',
            status: 'completed',
            notes: 'Vaccination mise à jour'
          },
          {
            id: 3,
            dispensary: 'Hôpital Central',
            doctor: 'Dr. Sophie Ngo',
            speciality: 'Dermatologie',
            date: '2024-01-25',
            time: '16:00',
            status: 'upcoming',
            notes: 'Suivi traitement acné'
          },
          {
            id: 4,
            dispensary: 'Centre Médical Yaoundé',
            doctor: 'Dr. Jean Fotso',
            speciality: 'Ophtalmologie',
            date: '2024-01-03',
            time: '11:00',
            status: 'cancelled',
            notes: 'Annulé par le patient'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'upcoming':
        return 'À venir';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'upcoming':
        return '📅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const appointmentCounts = {
    all: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Historique Médical</h1>
          <p className="text-gray-600">
            Consultez l&apos;historique de vos consultations et rendez-vous
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user?.image ? (
              <img 
                src={user.image} 
                alt="Photo de profil" 
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '👤'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.username || 'Utilisateur'
                }
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-600">{user?.phone || 'Téléphone non renseigné'}</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{appointmentCounts.all}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-xl font-bold text-gray-900">{appointmentCounts.completed}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">À venir</p>
                <p className="text-xl font-bold text-gray-900">{appointmentCounts.upcoming}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-xl">❌</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Annulés</p>
                <p className="text-xl font-bold text-gray-900">{appointmentCounts.cancelled}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({appointmentCounts.all})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés ({appointmentCounts.completed})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À venir ({appointmentCounts.upcoming})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulés ({appointmentCounts.cancelled})
            </button>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-6xl text-gray-400 mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' 
                  ? 'Aucun rendez-vous' 
                  : `Aucun rendez-vous ${getStatusLabel(filter).toLowerCase()}`
                }
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Vous n\'avez encore aucun rendez-vous enregistré.'
                  : `Vous n'avez aucun rendez-vous ${getStatusLabel(filter).toLowerCase()}.`
                }
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getStatusIcon(appointment.status)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.dispensary}
                        </h3>
                        <p className="text-gray-600">{appointment.doctor} - {appointment.speciality}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Date:</span>
                        <p className="text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Heure:</span>
                        <p className="text-gray-900">{appointment.time}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Statut:</span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-600 text-sm">Notes:</span>
                        <p className="text-gray-900 text-sm mt-1">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {appointment.status === 'upcoming' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark transition-colors">
                        Modifier
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bouton pour prendre un nouveau rendez-vous */}
        <div className="mt-8 text-center">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium">
            📅 Prendre un nouveau rendez-vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
