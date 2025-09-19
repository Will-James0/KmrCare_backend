import { careAPI } from './api';

/**
 * Service pour la gestion des rendez-vous
 */
export const appointmentService = {
  /**
   * Récupérer tous les rendez-vous d'un patient
   */
  getPatientAppointments: async (patientId) => {
    try {
      const appointments = await careAPI.getPatientAppointments(patientId);
      
      // Transformer les données si nécessaire
      return appointments.map(appointment => ({
        id: appointment.id,
        dispensary: appointment.dispensary?.name || 'Non spécifié',
        doctor: appointment.doctor ? `Dr. ${appointment.doctor.first_name} ${appointment.doctor.last_name}` : 'Non spécifié',
        speciality: appointment.doctor?.speciality || 'Générale',
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        status: appointment.status || 'scheduled',
        notes: appointment.notes || ''
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      throw error;
    }
  },

  /**
   * Récupérer les rendez-vous d'un dispensaire
   */
  getDispensaryAppointments: async (dispensaryId) => {
    try {
      const appointments = await careAPI.getDispensaryAppointments(dispensaryId);
      return appointments || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous du dispensaire:', error);
      throw error;
    }
  },

  /**
   * Créer un nouveau rendez-vous
   */
  createAppointment: async (appointmentData) => {
    try {
      const appointment = await careAPI.createAppointment(appointmentData);
      return appointment;
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un rendez-vous
   */
  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      const appointment = await careAPI.updateAppointment(appointmentId, appointmentData);
      return appointment;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      throw error;
    }
  },

  /**
   * Annuler un rendez-vous
   */
  cancelAppointment: async (appointmentId) => {
    try {
      const result = await careAPI.updateAppointment(appointmentId, { status: 'cancelled' });
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques des rendez-vous
   */
  getAppointmentStats: async (filter = {}) => {
    try {
      const stats = await careAPI.getAppointmentStats(filter);
      return {
        total: stats.total || 0,
        completed: stats.completed || 0,
        pending: stats.pending || 0,
        cancelled: stats.cancelled || 0,
        today: stats.today || 0,
        thisWeek: stats.thisWeek || 0,
        thisMonth: stats.thisMonth || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        total: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      };
    }
  }
};

export default appointmentService;
