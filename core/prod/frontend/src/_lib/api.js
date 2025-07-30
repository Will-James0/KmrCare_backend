/**
 * Configuration et services API pour l'intégration backend Django
 * Point d'entrée pour toutes les communications avec l'API
 */

// Configuration de base de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://will1285.pythonanywhere.com',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  
  // Endpoints principaux
  ENDPOINTS: {
    // Authentification
    AUTH: {
      LOGIN_USER: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/login/user/`,
      LOGIN_DOCTOR: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/login/doctor/`,
      LOGIN_ADMIN: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/login/admin/`,
      REGISTER_USER: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/register/user/`,
      REGISTER_OWNER: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/register/owner/`,
      REGISTER_ADMIN: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/register/admin/`,
      PROFILE: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/profile`,
      REQUESTS: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/request/list/`,
      APPROVE_REQUEST: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/request/approve`,
      REJECT_REQUEST: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/request/reject`,
      // Gestion des utilisateurs
      USERS_LIST: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/user/list/`,
      USER_DETAIL: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/user/details`,
      USER_UPDATE: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/user/update`,
      USER_DELETE: `${import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth'}/user/delete`
    },
    
    // Soins et dispensaires
    CARE: {
      DISPENSARIES: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/dispensary/list/`,
      DISPENSARY_DETAIL: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/dispensary/details`,
      DISPENSARY_UPDATE: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/dispensary/update`,
      DISPENSARY_DELETE: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/dispensary/delete`,
      DOCTORS: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/doctor/list/`,
      DOCTOR_CREATE: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/doctor/create`,
      DOCTOR_DETAIL: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/doctor/details`,
      DOCTOR_DELETE: `${import.meta.env.VITE_API_CARE_ENDPOINT || '/care'}/doctor/delete`
    },
    
    // API pour les rendez-vous
    API: {
      // Admin endpoints
      ADMIN: {
        APPOINTMENTS: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/admin/appointment/list/`,
        APPOINTMENT_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/admin/appointment/details`,
        HISTORY_LIST: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/admin/history/list/`,
        HISTORY_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/admin/history/details`
      },
      
      // Dispensary endpoints
      DISPENSARY: {
        APPOINTMENTS: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/list/`,
        APPOINTMENT_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/details`,
        APPOINTMENT_CONFIRM: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/confirm`,
        APPOINTMENT_REJECT: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/reject`,
        APPOINTMENT_CANCEL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/cancel`,
        APPOINTMENT_START: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/start`,
        APPOINTMENT_END: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/appointment/end`,
        HISTORY_LIST: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/history/list/`,
        HISTORY_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/dispensary/history/details`
      },
      
      // Patient endpoints
      PATIENT: {
        APPOINTMENTS: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/appointment/list/`,
        APPOINTMENT_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/appointment/details`,
        APPOINTMENT_MAKE: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/appointment/make/`,
        APPOINTMENT_UPDATE: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/appointment/update`,
        APPOINTMENT_CANCEL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/appointment/cancel`,
        HISTORY_LIST: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/history/list/`,
        HISTORY_DETAIL: `${import.meta.env.VITE_API_ENDPOINT || '/api'}/patient/history/details`
      }
    }
  }
};

// Configuration des headers par défaut
const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Ajouter le token d'authentification si disponible
  const token = getAuthToken();
  if (token) {
    const headerName = import.meta.env.VITE_JWT_HEADER_NAME || 'Authorization';
    const prefix = import.meta.env.VITE_JWT_PREFIX || 'Bearer';
    headers[headerName] = `${prefix} ${token}`;
  }
  
  return headers;
};

// Récupération du token d'authentification
const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('kmrcare_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token?.key;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
  }
  return null;
};

// Vérification de la validité du token
const isTokenValid = () => {
  try {
    const authData = localStorage.getItem('kmrcare_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      const expiration = parsed.token?.token_exp;
      if (expiration) {
        return Date.now() < expiration;
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
  }
  return false;
};

// Classe principale pour les requêtes API
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      timeout: this.timeout,
      ...options
    };

    // Définir les headers seulement si ce n'est pas FormData
    if (!(config.body instanceof FormData)) {
      // Ne pas inclure l'auth token si skipAuth est true
      if (config.skipAuth) {
        config.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        };
      } else {
        config.headers = {
          ...getDefaultHeaders(),
          ...options.headers
        };
      }
    } else {
      // Pour FormData, on garde seulement les headers d'auth sans Content-Type (sauf si skipAuth)
      config.headers = {};
      if (!config.skipAuth) {
        const token = getAuthToken();
        if (token) {
          const headerName = import.meta.env.VITE_JWT_HEADER_NAME || 'Authorization';
          const prefix = import.meta.env.VITE_JWT_PREFIX || 'Bearer';
          config.headers[headerName] = `${prefix} ${token}`;
        }
      }
    }

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Vérifier si la réponse est ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Essayer de parser en JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log(`✅ API Response: ${config.method} ${url}`, data);
      return data;
      
    } catch (error) {
      console.error(`❌ API Error: ${config.method} ${url}`, error);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La requête a pris trop de temps');
      }
      
      if (error.message.includes('401')) {
        // Token expiré ou invalide
        this.clearAuth();
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      
      throw error;
    }
  }

  // Méthodes HTTP spécifiques
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    const config = {
      method: 'POST'
    };
    
    // Si c'est FormData, ne pas stringify et laisser le navigateur définir le Content-Type
    if (data instanceof FormData) {
      config.body = data;
      // Ne pas définir Content-Type, le navigateur le fera avec boundary
    } else {
      config.body = JSON.stringify(data);
    }
    
    // Passer les options à la méthode request
    return this.request(endpoint, { ...config, ...options });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async uploadFile(endpoint, formData) {
    const headers = getDefaultHeaders();
    delete headers['Content-Type']; // Laisser le navigateur définir le Content-Type pour FormData
    
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData
    });
  }

  // Gestion de l'authentification
  setAuthToken(tokenData) {
    try {
      localStorage.setItem('kmrcare_auth', JSON.stringify(tokenData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  }

  clearAuth() {
    try {
      localStorage.removeItem('kmrcare_auth');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }

  isAuthenticated() {
    return getAuthToken() && isTokenValid();
  }

  getCurrentUser() {
    try {
      const authData = localStorage.getItem('kmrcare_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
    return null;
  }
}

// Instance singleton du service API
const apiService = new ApiService();

// Services spécialisés pour chaque domaine
export const authAPI = {
  // Connexion utilisateur
  loginUser: async (credentials) => {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN_USER, {
      username: credentials.email,
      password: credentials.password
    }, { skipAuth: true }); // Skip authentication for login
    if (response.token) {
      apiService.setAuthToken(response);
    }
    return response;
  },

  // Connexion médecin
  loginDoctor: async (credentials) => {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN_DOCTOR, {
      username: credentials.email,
      password: credentials.password
    }, { skipAuth: true }); // Skip authentication for login
    if (response.token) {
      apiService.setAuthToken(response);
    }
    return response;
  },

  // Connexion admin
  loginAdmin: async (credentials) => {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN, {
      username: credentials.email,
      password: credentials.password
    }, { skipAuth: true }); // Skip authentication for login
    if (response.token) {
      apiService.setAuthToken(response);
    }
    return response;
  },

  // Inscription utilisateur
  registerUser: async (userData) => {
    // S'assurer que le username est présent
    const dataToSend = {
      ...userData,
      username: userData.username || userData.email
    };
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER_USER, dataToSend);
  },

  // Inscription propriétaire de dispensaire
  registerOwner: async (ownerData) => {
    // S'assurer que le username est présent
    const dataToSend = {
      ...ownerData,
      username: ownerData.username || ownerData.email
    };
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER_OWNER, dataToSend);
  },

  // Déconnexion
  logout: () => {
    apiService.clearAuth();
  },

  // Profil utilisateur
  getProfile: async (token) => {
    return apiService.get(`${API_CONFIG.ENDPOINTS.AUTH.PROFILE}/${token}/`);
  },

  updateProfile: async (token, data) => {
    return apiService.put(`${API_CONFIG.ENDPOINTS.AUTH.PROFILE}/update/${token}/`, data);
  },

  // Demandes d'inscription
  getRequests: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.REQUESTS);
  },

  // Approuver une demande
  approveRequest: async (token) => {
    return apiService.post(`${API_CONFIG.ENDPOINTS.AUTH.APPROVE_REQUEST}/${token}/`);
  },

  // Rejeter une demande
  rejectRequest: async (token) => {
    return apiService.post(`${API_CONFIG.ENDPOINTS.AUTH.REJECT_REQUEST}/${token}/`);
  },

  // Gestion des utilisateurs (Admin only)
  getUsers: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.USERS_LIST);
  },

  getUserDetail: async (token) => {
    return apiService.get(`${API_CONFIG.ENDPOINTS.AUTH.USER_DETAIL}/${token}/`);
  },

  updateUser: async (token, userData) => {
    return apiService.put(`${API_CONFIG.ENDPOINTS.AUTH.USER_UPDATE}/${token}/`, userData);
  },

  deleteUser: async (token) => {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.AUTH.USER_DELETE}/${token}/`);
  }
};

export const careAPI = {
  // Dispensaires
  getDispensaries: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.CARE.DISPENSARIES, params);
  },

  getDispensaryDetail: async (token) => {
    return apiService.get(`${API_CONFIG.ENDPOINTS.CARE.DISPENSARY_DETAIL}/${token}/`);
  },

  updateDispensary: async (token, data) => {
    return apiService.put(`${API_CONFIG.ENDPOINTS.CARE.DISPENSARY_UPDATE}/${token}/`, data);
  },

  deleteDispensary: async (token) => {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.CARE.DISPENSARY_DELETE}/${token}/`);
  },

  // Médecins
  getDoctors: async (params = {}) => {
    return apiService.get(API_CONFIG.ENDPOINTS.CARE.DOCTORS, params);
  },

  // Intégration avec l'API des rendez-vous modernisée
  createAppointment: async (appointmentData) => {
    return appointmentAPI.patient.makeAppointment(appointmentData);
  },

  getPatientAppointments: async () => {
    return appointmentAPI.patient.getAppointments();
  },

  createDoctor: async (token, doctorData) => {
    return apiService.post(`${API_CONFIG.ENDPOINTS.CARE.DOCTOR_CREATE}/${token}/`, doctorData);
  },

  getDoctorDetail: async (token) => {
    return apiService.get(`${API_CONFIG.ENDPOINTS.CARE.DOCTOR_DETAIL}/${token}/`);
  },

  deleteDoctor: async (token) => {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.CARE.DOCTOR_DELETE}/${token}/`);
  },

  // Statistiques pour les propriétaires de dispensaires
  getOwnerStats: async (ownerId) => {
    return apiService.get(`/care/stats/owner/${ownerId}/`);
  },
};

// API pour les rendez-vous
export const appointmentAPI = {
  // Admin API
  admin: {
    // Obtenir la liste des rendez-vous (Admin)
    getAppointments: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.ADMIN.APPOINTMENTS, params);
    },

    // Obtenir les détails d'un rendez-vous (Admin)
    getAppointmentDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.ADMIN.APPOINTMENT_DETAIL}/${token}/`);
    },

    // Obtenir l'historique des rendez-vous (Admin)
    getHistory: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.ADMIN.HISTORY_LIST, params);
    },

    // Obtenir les détails de l'historique (Admin)
    getHistoryDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.ADMIN.HISTORY_DETAIL}/${token}/`);
    }
  },

  // Dispensary API
  dispensary: {
    // Obtenir la liste des rendez-vous (Dispensaire)
    getAppointments: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENTS, params);
    },

    // Obtenir les détails d'un rendez-vous (Dispensaire)
    getAppointmentDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_DETAIL}/${token}/`);
    },

    // Confirmer un rendez-vous
    confirmAppointment: async (token) => {
      return apiService.post(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_CONFIRM}/${token}/`);
    },

    // Rejeter un rendez-vous
    rejectAppointment: async (token) => {
      return apiService.post(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_REJECT}/${token}/`);
    },

    // Annuler un rendez-vous (Dispensaire)
    cancelAppointment: async (token) => {
      return apiService.post(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_CANCEL}/${token}/`);
    },

    // Démarrer un rendez-vous
    startAppointment: async (token) => {
      return apiService.post(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_START}/${token}/`);
    },

    // Terminer un rendez-vous
    endAppointment: async (token, data = {}) => {
      return apiService.post(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.APPOINTMENT_END}/${token}/`, data);
    },

    // Obtenir l'historique des rendez-vous (Dispensaire)
    getHistory: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.DISPENSARY.HISTORY_LIST, params);
    },

    // Obtenir les détails de l'historique (Dispensaire)
    getHistoryDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.DISPENSARY.HISTORY_DETAIL}/${token}/`);
    }
  },

  // Patient API
  patient: {
    // Obtenir la liste des rendez-vous (Patient)
    getAppointments: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.PATIENT.APPOINTMENTS, params);
    },

    // Obtenir les détails d'un rendez-vous (Patient)
    getAppointmentDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.PATIENT.APPOINTMENT_DETAIL}/${token}/`);
    },

    // Prendre un rendez-vous
    makeAppointment: async (appointmentData) => {
      // Mapper les champs pour correspondre à l'API backend
      const mappedData = {
        dispensary_token: appointmentData.dispensary || appointmentData.dispensary_token,
        date: appointmentData.appointment_date || appointmentData.date,
        hour: appointmentData.appointment_time || appointmentData.hour,
        reason: appointmentData.reason,
        file: appointmentData.file || null
      };
      
      console.log('🔄 Mapping appointment data:', {
        original: appointmentData,
        mapped: mappedData
      });
      
      return apiService.post(API_CONFIG.ENDPOINTS.API.PATIENT.APPOINTMENT_MAKE, mappedData);
    },

    // Mettre à jour un rendez-vous (Patient)
    updateAppointment: async (token, data) => {
      return apiService.put(`${API_CONFIG.ENDPOINTS.API.PATIENT.APPOINTMENT_UPDATE}/${token}/`, data);
    },

    // Annuler un rendez-vous (Patient)
    cancelAppointment: async (token) => {
      return apiService.put(`${API_CONFIG.ENDPOINTS.API.PATIENT.APPOINTMENT_CANCEL}/${token}/`);
    },

    // Obtenir l'historique des rendez-vous (Patient)
    getHistory: async (params = {}) => {
      return apiService.get(API_CONFIG.ENDPOINTS.API.PATIENT.HISTORY_LIST, params);
    },

    // Obtenir les détails de l'historique (Patient)
    getHistoryDetail: async (token) => {
      return apiService.get(`${API_CONFIG.ENDPOINTS.API.PATIENT.HISTORY_DETAIL}/${token}/`);
    }
  },

  // Méthodes de compatibilité (pour maintenir la rétrocompatibilité)
  // Créer un nouveau rendez-vous (utilise patient.makeAppointment)
  createAppointment: async (appointmentData) => {
    return appointmentAPI.patient.makeAppointment(appointmentData);
  },

  // Obtenir la liste des rendez-vous (par défaut patient)
  getAppointments: async (params = {}) => {
    return appointmentAPI.patient.getAppointments(params);
  },

  // Obtenir les détails d'un rendez-vous (par défaut patient)
  getAppointmentDetail: async (token) => {
    return appointmentAPI.patient.getAppointmentDetail(token);
  },

  // Mettre à jour un rendez-vous (par défaut patient)
  updateAppointment: async (token, data) => {
    return appointmentAPI.patient.updateAppointment(token, data);
  },

  // Annuler un rendez-vous (par défaut patient)
  cancelAppointment: async (token, reason = '') => {
    return appointmentAPI.patient.cancelAppointment(token, reason);
  },

  // Obtenir les rendez-vous d'un patient (compatibilité)
  getPatientAppointments: async (patientId) => {
    return appointmentAPI.patient.getAppointments({ patient: patientId });
  },

  // Obtenir les rendez-vous d'un médecin (utilise dispensary)
  getDoctorAppointments: async (doctorId) => {
    return appointmentAPI.dispensary.getAppointments({ doctor: doctorId });
  },

  // Obtenir les rendez-vous d'un dispensaire
  getDispensaryAppointments: async (dispensaryToken) => {
    return appointmentAPI.dispensary.getAppointments({ dispensary: dispensaryToken });
  }
};

// Utilitaires pour les erreurs API
export const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
  console.error('API Error:', error);
  
  if (error.message.includes('Session expirée')) {
    return {
      type: 'auth_error',
      message: 'Votre session a expiré. Veuillez vous reconnecter.',
      shouldRedirect: true
    };
  }
  
  if (error.message.includes('Timeout')) {
    return {
      type: 'timeout_error',
      message: 'La requête a pris trop de temps. Vérifiez votre connexion.',
      shouldRetry: true
    };
  }
  
  if (error.message.includes('400')) {
    return {
      type: 'validation_error',
      message: 'Données invalides. Vérifiez vos informations.',
      shouldRetry: false
    };
  }
  
  if (error.message.includes('500')) {
    return {
      type: 'server_error',
      message: 'Erreur du serveur. Veuillez réessayer plus tard.',
      shouldRetry: true
    };
  }
  
  return {
    type: 'unknown_error',
    message: defaultMessage,
    shouldRetry: false
  };
};

// Export du service principal
export default apiService;

// Export des utilitaires
export { getAuthToken, isTokenValid };
