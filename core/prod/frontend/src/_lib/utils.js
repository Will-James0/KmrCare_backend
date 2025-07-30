/**
 * Utilitaires pour la validation et transformation des données
 */

/**
 * Valider les données d'un utilisateur
 */
export const validateUserData = (userData) => {
  const errors = {};

  if (!userData.first_name?.trim()) {
    errors.first_name = 'Le prénom est requis';
  }

  if (!userData.last_name?.trim()) {
    errors.last_name = 'Le nom est requis';
  }

  if (!userData.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (userData.password && userData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  }

  if (!userData.phone?.trim()) {
    errors.phone = 'Le téléphone est requis';
  } else if (!/^\+?[\d\s-()]+$/.test(userData.phone)) {
    errors.phone = 'Le format du téléphone n\'est pas valide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valider les données d'un dispensaire
 */
export const validateDispensaryData = (dispensaryData) => {
  const errors = {};

  if (!dispensaryData.name?.trim()) {
    errors.name = 'Le nom du dispensaire est requis';
  }

  if (!dispensaryData.address?.trim()) {
    errors.address = 'L\'adresse est requise';
  }

  if (!dispensaryData.phone?.trim()) {
    errors.phone = 'Le téléphone est requis';
  } else if (!/^\+?[\d\s-()]+$/.test(dispensaryData.phone)) {
    errors.phone = 'Le format du téléphone n\'est pas valide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valider les données d'un médecin
 */
export const validateDoctorData = (doctorData) => {
  const errors = {};

  if (!doctorData.first_name?.trim()) {
    errors.first_name = 'Le prénom est requis';
  }

  if (!doctorData.last_name?.trim()) {
    errors.last_name = 'Le nom est requis';
  }

  if (!doctorData.speciality?.trim()) {
    errors.speciality = 'La spécialité est requise';
  }

  if (!doctorData.phone?.trim()) {
    errors.phone = 'Le téléphone est requis';
  } else if (!/^\+?[\d\s-()]+$/.test(doctorData.phone)) {
    errors.phone = 'Le format du téléphone n\'est pas valide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valider les données d'un rendez-vous
 */
export const validateAppointmentData = (appointmentData) => {
  const errors = {};

  if (!appointmentData.doctor_id) {
    errors.doctor_id = 'Le médecin est requis';
  }

  if (!appointmentData.appointment_date) {
    errors.appointment_date = 'La date est requise';
  } else {
    const appointmentDate = new Date(appointmentData.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      errors.appointment_date = 'La date ne peut pas être dans le passé';
    }
  }

  if (!appointmentData.appointment_time) {
    errors.appointment_time = 'L\'heure est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Transformer les données utilisateur pour l'affichage
 */
export const transformUserForDisplay = (user) => {
  if (!user) return null;

  return {
    ...user,
    fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    avatar: user.image || user.profile_picture || null,
    displayRole: getRoleDisplayName(user.role)
  };
};

/**
 * Obtenir le nom d'affichage d'un rôle
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrateur',
    owner: 'Propriétaire de dispensaire',
    dispensary_owner: 'Propriétaire de dispensaire',
    doctor: 'Médecin',
    patient: 'Patient',
    user: 'Utilisateur'
  };

  return roleNames[role] || 'Utilisateur';
};

/**
 * Transformer les données de dispensaire pour l'affichage
 */
export const transformDispensaryForDisplay = (dispensary) => {
  if (!dispensary) return null;

  return {
    ...dispensary,
    fullAddress: dispensary.address ? 
      `${dispensary.address}${dispensary.city ? `, ${dispensary.city}` : ''}` : 
      'Adresse non spécifiée',
    ownerName: dispensary.owner ? 
      `${dispensary.owner.first_name || ''} ${dispensary.owner.last_name || ''}`.trim() : 
      'Propriétaire non spécifié'
  };
};

/**
 * Transformer les données de médecin pour l'affichage
 */
export const transformDoctorForDisplay = (doctor) => {
  if (!doctor) return null;

  return {
    ...doctor,
    fullName: `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim(),
    displaySpeciality: doctor.speciality || 'Généraliste',
    dispensaryName: doctor.dispensary?.name || 'Non assigné'
  };
};

/**
 * Transformer les données de rendez-vous pour l'affichage
 */
export const transformAppointmentForDisplay = (appointment) => {
  if (!appointment) return null;

  return {
    ...appointment,
    doctorName: appointment.doctor ? 
      `Dr. ${appointment.doctor.first_name || ''} ${appointment.doctor.last_name || ''}`.trim() : 
      'Médecin non spécifié',
    patientName: appointment.patient ? 
      `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`.trim() : 
      'Patient non spécifié',
    dispensaryName: appointment.dispensary?.name || 'Dispensaire non spécifié',
    statusDisplay: getAppointmentStatusDisplay(appointment.status),
    formattedDate: appointment.appointment_date ? 
      new Date(appointment.appointment_date).toLocaleDateString('fr-FR') : 
      'Date non spécifiée',
    formattedTime: appointment.appointment_time || 'Heure non spécifiée'
  };
};

/**
 * Obtenir l'affichage du statut d'un rendez-vous
 */
export const getAppointmentStatusDisplay = (status) => {
  const statusNames = {
    scheduled: 'Programmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
    pending: 'En attente',
    confirmed: 'Confirmé'
  };

  return statusNames[status] || 'Statut inconnu';
};

/**
 * Formater une date pour l'affichage
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'Date non spécifiée';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  try {
    return new Date(date).toLocaleDateString('fr-FR', defaultOptions);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date invalide';
  }
};

/**
 * Formater une heure pour l'affichage
 */
export const formatTime = (time) => {
  if (!time) return 'Heure non spécifiée';

  try {
    // Si c'est déjà une heure formatée (HH:MM)
    if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    // Si c'est un objet Date
    if (time instanceof Date) {
      return time.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    // Essayer de parser comme date
    return new Date(time).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error('Erreur lors du formatage de l\'heure:', error);
    return 'Heure invalide';
  }
};

/**
 * Générer une couleur basée sur le statut
 */
export const getStatusColor = (status) => {
  const colors = {
    completed: 'text-green-600 bg-green-50',
    scheduled: 'text-blue-600 bg-blue-50',
    pending: 'text-yellow-600 bg-yellow-50',
    cancelled: 'text-red-600 bg-red-50',
    confirmed: 'text-green-600 bg-green-50',
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50'
  };

  return colors[status] || 'text-gray-600 bg-gray-50';
};

export default {
  validateUserData,
  validateDispensaryData,
  validateDoctorData,
  validateAppointmentData,
  transformUserForDisplay,
  transformDispensaryForDisplay,
  transformDoctorForDisplay,
  transformAppointmentForDisplay,
  getRoleDisplayName,
  getAppointmentStatusDisplay,
  formatDate,
  formatTime,
  getStatusColor
};
