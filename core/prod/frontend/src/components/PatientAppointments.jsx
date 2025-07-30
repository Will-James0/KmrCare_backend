import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  User,
  Hospital,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuthState } from '../_store/auth.js';
import { useNotify } from '../_store/notifications.js';
import { careAPI } from '../_lib/api.js';

const PatientAppointments = () => {
  const { user } = useAuthState();
  const notify = useNotify();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await careAPI.getPatientAppointments(user.id);
      setAppointments(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      notify.error('Impossible de charger vos rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les rendez-vous selon le filtre sélectionné
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return appointmentDate > now && appointment.status !== 'cancelled';
      case 'past':
        return appointmentDate < now && appointment.status !== 'cancelled';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Fonction pour obtenir le texte de statut
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-[#0b9444]" />
          <h2 className="text-xl font-bold text-[#0f425d]">Mes rendez-vous</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#0b9444] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Chargement de vos rendez-vous...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-[#0b9444]" />
          <h2 className="text-xl font-bold text-[#0f425d]">Mes rendez-vous</h2>
        </div>
        
        {/* Filtres */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'upcoming', label: 'À venir' },
            { key: 'past', label: 'Passés' },
            { key: 'cancelled', label: 'Annulés' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filter === key
                  ? 'bg-[#0b9444] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {filter === 'all' ? 'Aucun rendez-vous' : `Aucun rendez-vous ${
              filter === 'upcoming' ? 'à venir' :
              filter === 'past' ? 'passé' : 'annulé'
            }`}
          </h3>
          <p className="text-gray-500">
            {filter === 'upcoming' && 'Prenez rendez-vous dans le catalogue des dispensaires.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-[#0b9444]">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {formatDate(appointment.appointment_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                </div>
              </div>

              {/* Informations du dispensaire */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Hospital className="w-5 h-5 text-[#0b9444]" />
                  <div>
                    <p className="font-medium text-[#0f425d]">
                      {appointment.dispensary?.name || 'Dispensaire'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.dispensary?.quarter}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#0b9444]" />
                  <div>
                    <p className="font-medium text-[#0f425d]">
                      Dr. {appointment.doctor?.user?.first_name} {appointment.doctor?.user?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.doctor?.role?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motif de consultation */}
              {appointment.reason && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#0f425d] mb-1">Motif :</p>
                  <p className="text-sm text-gray-700">{appointment.reason}</p>
                </div>
              )}

              {/* Actions */}
              {appointment.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Annuler
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Modifier
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
