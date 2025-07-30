import { authAPI, careAPI } from './api';

/**
 * Service pour récupérer les statistiques du dashboard admin
 */
export const statsService = {
  /**
   * Récupère toutes les statistiques pour le dashboard admin
   */
  getDashboardStats: async () => {
    try {
      // Récupérer les données en parallèle
      const [
        dispensariesResponse,
        pendingRegistrationsResponse,
        doctorsResponse
      ] = await Promise.allSettled([
        careAPI.getDispensaries(),
        authAPI.getRequests(),
        careAPI.getDoctors()
      ]);

      // Traiter les dispensaires
      const dispensaries = dispensariesResponse.status === 'fulfilled' 
        ? (Array.isArray(dispensariesResponse.value) 
           ? dispensariesResponse.value 
           : dispensariesResponse.value?.results || [])
        : [];

      // Traiter les demandes d'inscription
      const pendingRegistrations = pendingRegistrationsResponse.status === 'fulfilled'
        ? (Array.isArray(pendingRegistrationsResponse.value) 
           ? pendingRegistrationsResponse.value 
           : [])
        : [];

      // Traiter les médecins
      const doctors = doctorsResponse.status === 'fulfilled'
        ? (Array.isArray(doctorsResponse.value) 
           ? doctorsResponse.value 
           : doctorsResponse.value?.results || [])
        : [];

      // Calculer les statistiques
      const stats = {
        // Données réelles disponibles
        totalDispensaries: dispensaries.length,
        pendingRegistrations: pendingRegistrations.length,
        totalDoctors: doctors.length,
        
        // Calculer le total d'utilisateurs basé sur les données réelles
        totalUsers: dispensaries.length + doctors.length + pendingRegistrations.length,
        
        // Données non disponibles - afficher 0 au lieu de valeurs fictives
        totalAppointments: 0, // API pas encore disponible
        pendingAppointments: 0, // API pas encore disponible
        activeUsers: dispensaries.length + doctors.length, // Utilisateurs confirmés seulement
        completedAppointments: 0, // API pas encore disponible
        newUsersToday: 0, // API pas encore disponible
        appointmentsToday: 0, // API pas encore disponible

        // Données détaillées
        dispensariesByQuarter: getDispensariesByQuarter(dispensaries),
        doctorsBySpecialty: getDoctorsBySpecialty(doctors),
        recentActivity: generateRecentActivity(dispensaries, pendingRegistrations)
      };

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      
      // Retourner des données par défaut en cas d'erreur
      return {
        totalUsers: 0,
        totalAppointments: 0,
        totalDispensaries: 0,
        pendingAppointments: 0,
        activeUsers: 0,
        completedAppointments: 0,
        newUsersToday: 0,
        appointmentsToday: 0,
        pendingRegistrations: 0,
        dispensariesByQuarter: {},
        doctorsBySpecialty: {},
        recentActivity: []
      };
    }
  },

  /**
   * Récupère les statistiques pour un propriétaire de dispensaire
   */
  getOwnerStats: async (userToken) => {
    try {
      const [dispensariesResponse, doctorsResponse] = await Promise.allSettled([
        careAPI.getDispensaries(),
        careAPI.getDoctors()
      ]);

      const dispensaries = dispensariesResponse.status === 'fulfilled' 
        ? (Array.isArray(dispensariesResponse.value) 
           ? dispensariesResponse.value 
           : dispensariesResponse.value?.results || [])
        : [];

      const doctors = doctorsResponse.status === 'fulfilled'
        ? (Array.isArray(doctorsResponse.value) 
           ? doctorsResponse.value 
           : doctorsResponse.value?.results || [])
        : [];

      // Trouver le dispensaire de l'utilisateur
      const userDispensary = dispensaries.find(d => d.owner?.token === userToken);
      
      if (!userDispensary) {
        throw new Error('Dispensaire non trouvé pour cet utilisateur');
      }

      // Filtrer les médecins du dispensaire
      const dispensaryDoctors = doctors.filter(d => d.dispensary?.token === userDispensary.token);

      return {
        dispensary: userDispensary,
        doctors: dispensaryDoctors,
        stats: {
          totalDoctors: dispensaryDoctors.length,
          todayAppointments: 12, // TODO: Implémenter quand l'API sera disponible
          weeklyAppointments: 67, // TODO: Implémenter quand l'API sera disponible
          monthlyRevenue: 450000 // TODO: Implémenter quand l'API sera disponible
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats propriétaire:', error);
      throw error;
    }
  }
};

/**
 * Groupe les dispensaires par quartier
 */
function getDispensariesByQuarter(dispensaries) {
  return dispensaries.reduce((acc, dispensary) => {
    const quarter = dispensary.quarter || 'Non spécifié';
    acc[quarter] = (acc[quarter] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Groupe les médecins par spécialité (basé sur les spécialités du dispensaire)
 */
function getDoctorsBySpecialty(doctors) {
  return doctors.reduce((acc, doctor) => {
    const specialty = doctor.role?.label || 'Médecin généraliste';
    acc[specialty] = (acc[specialty] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Génère une activité récente fictive basée sur les données réelles
 */
function generateRecentActivity(dispensaries, pendingRegistrations) {
  const activities = [];

  // Activités des demandes d'inscription
  if (pendingRegistrations.length > 0) {
    const recent = pendingRegistrations.slice(0, 3);
    recent.forEach((request, index) => {
      activities.push({
        id: `pending-${request.token}`,
        type: 'registration',
        icon: '📝',
        title: 'Nouvelle demande d\'inscription',
        description: `${request.dispensary_name} - ${request.first_name} ${request.last_name}`,
        time: `Il y a ${(index + 1) * 15} minutes`,
        color: 'blue'
      });
    });
  }

  // Activités des dispensaires
  if (dispensaries.length > 0) {
    const recent = dispensaries.slice(0, 2);
    recent.forEach((dispensary, index) => {
      activities.push({
        id: `dispensary-${dispensary.token}`,
        type: 'dispensary',
        icon: '🏥',
        title: 'Dispensaire actif',
        description: `${dispensary.name} - ${dispensary.quarter}`,
        time: `Il y a ${(index + 1) * 2} heures`,
        color: 'green'
      });
    });
  }

  // Trier par temps (fictif pour l'instant)
  return activities.sort((a, b) => {
    const timeA = parseInt(a.time.match(/\d+/)[0]);
    const timeB = parseInt(b.time.match(/\d+/)[0]);
    return timeA - timeB;
  }).slice(0, 5);
}

export default statsService;
