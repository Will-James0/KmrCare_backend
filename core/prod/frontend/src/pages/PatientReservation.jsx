/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Hospital,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth, useAuthState } from '../_store/auth.js';
import { useNotify } from '../_store/notifications.js';
import { careAPI } from '../_lib/api.js';

const PatientReservation = () => {
  const navigate = useNavigate();
  const { dispensaryToken } = useParams();
  const location = useLocation();
  const { user } = useAuthState();
  const notify = useNotify();

  // États
  const [dispensary, setDispensary] = useState(location.state?.dispensary || null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Chargement des données du dispensaire si pas dans state
  useEffect(() => {
    if (!dispensary && dispensaryToken) {
      loadDispensaryDetails();
    }
  }, [dispensaryToken, dispensary]);

  // Chargement des médecins
  useEffect(() => {
    if (dispensary) {
      loadDoctors();
    }
  }, [dispensary]);

  const loadDispensaryDetails = async () => {
    try {
      const response = await careAPI.getDispensaryDetail(dispensaryToken);
      setDispensary(response);
    } catch (error) {
      console.error('Erreur lors du chargement du dispensaire:', error);
      notify.error('Impossible de charger les informations du dispensaire');
      navigate('/patient');
    }
  };

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await careAPI.getDoctors({ dispensary: dispensary.token });
      setDoctors(response || []);
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
      notify.error('Impossible de charger la liste des médecins');
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Génération des créneaux horaires disponibles
  const generateTimeSlots = () => {
    const slots = [];
    if (!dispensary?.opening || !dispensary?.ending) return slots;

    const start = parseInt(dispensary.opening.split(':')[0]);
    const end = parseInt(dispensary.ending.split(':')[0]);

    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour + 0.5 < end) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // Génération des dates disponibles (7 prochains jours)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      });
    }
    return dates;
  };

  // Soumission de la réservation
  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !appointmentReason.trim()) {
      notify.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitting(true);
      
      const appointmentData = {
        dispensary_token: dispensary.token,
        date: selectedDate,
        hour: selectedTime,
        reason: appointmentReason.trim()
      };

      console.log('🏥 Appointment data to send:', appointmentData);

      await careAPI.createAppointment(appointmentData);
      
      notify.success('Rendez-vous programmé avec succès !');
      navigate('/patient', { 
        state: { 
          message: 'Votre rendez-vous a été programmé. Vous recevrez une confirmation par email.' 
        }
      });
      
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      notify.error('Erreur lors de la programmation du rendez-vous');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = generateTimeSlots();
  const availableDates = generateAvailableDates();

  if (!dispensary) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/patient')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#0b9444] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0f425d]">
                Prendre rendez-vous
              </h1>
              <p className="text-gray-600">
                {dispensary.name} - {dispensary.quarter}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations du dispensaire */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hospital className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#0f425d] mb-2">
                  {dispensary.name}
                </h2>
                <p className="text-gray-600">{dispensary.specialities}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#0b9444]" />
                  <div>
                    <p className="font-medium">{dispensary.quarter}</p>
                    <p className="text-sm text-gray-600">{dispensary.localisation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#0b9444]" />
                  <div>
                    <p className="font-medium">Horaires d'ouverture</p>
                    <p className="text-sm text-gray-600">
                      {dispensary.opening} - {dispensary.ending}
                    </p>
                  </div>
                </div>

                {dispensary.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#0b9444]" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-gray-600">{dispensary.phone}</p>
                    </div>
                  </div>
                )}

                {dispensary.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#0b9444]" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{dispensary.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-[#0f425d] mb-6">
                Programmation du rendez-vous
              </h3>

              <form onSubmit={handleSubmitReservation} className="space-y-6">

                {/* Sélection de la date */}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
                  required
                  min={new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]}
                />


                {/* Sélection de l'heure */}
                <div>
                  <label className="block text-sm font-medium text-[#0f425d] mb-3">
                    Sélectionner un créneau horaire*
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <label
                        key={time}
                        className={`flex items-center text-black justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTime === time
                            ? 'border-[#0b9444] bg-green-50 text-[#0b9444]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={time}
                          checked={selectedTime === time}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="sr-only"
                        />
                        <span className="font-medium">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motif de consultation */}
                <div>
                  <label className="block text-sm font-medium text-[#0f425d] mb-3">
                    Motif de la consultation*
                  </label>
                  <textarea
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    rows="4"
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                    required
                  />
                </div>
                {/* Pièce jointe (facultatif) */}
                <div>
                  <label className="block text-sm font-medium text-[#0f425d] mb-3">
                    Pièce jointe (facultatif)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#0b9444] hover:bg-[#0a7c3a] text-white'
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Programmation en cours...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Confirmer le rendez-vous
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReservation;
