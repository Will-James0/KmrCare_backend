/* eslint-disable no-unused-vars */
import { authAPI } from './api.js';
import { useNotify } from '../_store/notifications.js';

/**
 * Service d'authentification
 * Gère les opérations de connexion, inscription et profil utilisateur
 */

/**
 * Connexion d'un utilisateur patient
 * @param {Object} credentials - Identifiants de connexion
 * @param {string} credentials.email - Email ou nom d'utilisateur
 * @param {string} credentials.password - Mot de passe
 * @returns {Promise<Object>} Données utilisateur et tokens
 */
export async function loginUser(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis.');
    }

    const response = await authAPI.loginUser(credentials);
    
    return {
      user: {
        ...response.user,
        role: 'patient'
      },
      token: response.token
    };
  } catch (error) {
    console.error('Erreur lors de la connexion patient:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Identifiants invalides. Vérifiez votre email et mot de passe.');
    }
    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe incorrect.');
    }
    if (error.response?.status === 403) {
      throw new Error('Compte désactivé. Contactez l\'administrateur.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Erreur de connexion. Vérifiez votre connexion.');
  }
}

/**
 * Connexion d'un médecin ou propriétaire de dispensaire
 * @param {Object} credentials - Identifiants de connexion
 * @returns {Promise<Object>} Données utilisateur et tokens
 */
export async function loginDoctor(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis.');
    }

    const response = await authAPI.loginDoctor(credentials);
    
    // Déterminer le rôle selon la réponse du backend
    let role = 'doctor';
    if (response.user.is_owner) {
      role = 'dispensary_manager';
    }
    
    return {
      user: {
        ...response.user,
        role: role
      },
      token: response.token,
      dispensary: response.dispensary ? {
        name: response.dispensary.dispensary_name,
        logo: response.dispensary.dispensary_logo,
        token: response.dispensary.dispensary_token
      } : null
    };
  } catch (error) {
    console.error('Erreur lors de la connexion médecin:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Identifiants invalides. Vérifiez votre email et mot de passe.');
    }
    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe incorrect.');
    }
    if (error.response?.status === 403) {
      const message = error.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw new Error('Vous n\'êtes pas autorisé à vous connecter en tant que médecin.');
    }
    
    throw new Error('Erreur de connexion. Vérifiez votre connexion.');
  }
}

/**
 * Connexion d'un administrateur
 * @param {Object} credentials - Identifiants de connexion
 * @returns {Promise<Object>} Données utilisateur et tokens
 */
export async function loginAdmin(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email et mot de passe requis.');
    }

    const response = await authAPI.loginAdmin(credentials);
    
    return {
      user: {
        ...response.user,
        role: 'admin'
      },
      token: response.token
    };
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Identifiants invalides. Vérifiez votre email et mot de passe.');
    }
    if (error.response?.status === 401) {
      throw new Error('Email ou mot de passe incorrect.');
    }
    if (error.response?.status === 403) {
      const message = error.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw new Error('Vous n\'êtes pas autorisé à vous connecter en tant qu\'administrateur.');
    }
    
    throw new Error('Erreur de connexion. Vérifiez votre connexion.');
  }
}

/**
 * Inscription d'un nouvel utilisateur patient
 * @param {Object} userData - Données d'inscription
 * @returns {Promise<Object>} Données utilisateur créé
 */
export async function registerUser(userData) {
  try {
    // Validation côté frontend
    if (!userData.email || !userData.password) {
      throw new Error('Email et mot de passe requis.');
    }
    if (!userData.first_name || !userData.last_name) {
      throw new Error('Prénom et nom requis.');
    }
    if (userData.password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
    }
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }

    // Suppression du champ de confirmation avant envoi
    const { confirmPassword, acceptTerms, ...dataToSend } = userData;
    
    // Générer le username à partir de l'email si non fourni
    if (!dataToSend.username) {
      dataToSend.username = userData.email;
    }
    
    // Log de débogage pour vérifier les données envoyées
    console.log('🔍 DEBUG registerUser - Données envoyées au backend:', dataToSend);
    
    const response = await authAPI.registerUser(dataToSend);
    
    return {
      user: response.user || response,
      message: response.message || 'Inscription réussie !'
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.email) {
        throw new Error('Cet email est déjà utilisé.');
      }
      if (errorData.username) {
        throw new Error('Ce nom d\'utilisateur est déjà utilisé.');
      }
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Erreur lors de l\'inscription. Vérifiez vos données.');
  }
}

/**
 * Demande d'inscription d'un dispensaire
 * @param {Object} dispensaryData - Données de la demande
 * @returns {Promise<Object>} Confirmation de la demande
 */
export async function registerDispensaryRequest(dispensaryData) {
  try {
    // Validation des champs requis
    if (!dispensaryData.email || !dispensaryData.password) {
      throw new Error('Email et mot de passe requis.');
    }
    if (!dispensaryData.first_name || !dispensaryData.last_name) {
      throw new Error('Prénom et nom du responsable requis.');
    }
    if (!dispensaryData.dispensary_name) {
      throw new Error('Nom du dispensaire requis.');
    }
    if (!dispensaryData.dispensary_quarter) {
      throw new Error('Quartier du dispensaire requis.');
    }
    if (!dispensaryData.dispensary_localisation) {
      throw new Error('Adresse du dispensaire requise.');
    }

    // Préparation des données selon le format attendu par le backend
    const { 
      confirmPassword, 
      acceptTerms, 
      acceptPrivacy, 
      acceptCertification,
      registration_type,
      ...otherData 
    } = dispensaryData;

    // Temporairement, on ignore le logo pour diagnostiquer le problème
    // Si un logo est présent, utiliser FormData pour gérer le fichier
    let dataToSend;
    
    // Pour le moment, on envoie toujours en JSON pour diagnostiquer
    dataToSend = {
      username: dispensaryData.username || dispensaryData.email,
      first_name: dispensaryData.first_name,
      last_name: dispensaryData.last_name,
      email: dispensaryData.email,
      password: dispensaryData.password,
      phone: dispensaryData.phone || '',
      dispensary_name: dispensaryData.dispensary_name,
      dispensary_specialities: dispensaryData.dispensary_specialities || '',
      dispensary_quarter: dispensaryData.dispensary_quarter || '',
      dispensary_localisation: dispensaryData.dispensary_localisation || '',
      dispensary_phone: dispensaryData.dispensary_phone || dispensaryData.phone || '',
      dispensary_email: dispensaryData.dispensary_email || dispensaryData.email || '',
      dispensary_opening: dispensaryData.dispensary_opening || '08:00',
      dispensary_ending: dispensaryData.dispensary_ending || '18:00'
    };
    
    // Log de débogage pour vérifier les données envoyées
    console.log('🔍 DEBUG registerDispensaryRequest - Données envoyées au backend:', dataToSend);
    
    const response = await authAPI.registerOwner(dataToSend);
    
    return {
      message: response.message || 'Demande envoyée avec succès !'
    };
  } catch (error) {
    console.error('Erreur lors de la demande d\'inscription dispensaire:', error);
    
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.email) {
        throw new Error('Cet email est déjà utilisé.');
      }
      if (errorData.username) {
        throw new Error('Ce nom d\'utilisateur est déjà utilisé.');
      }
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Erreur lors de l\'envoi de la demande. Vérifiez vos données.');
  }
}

/**
 * Déconnexion de l'utilisateur
 * @returns {Promise<boolean>} Succès de la déconnexion
 */
export async function logoutUser() {
  try {
    await authAPI.logout();
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // On continue la déconnexion côté client même si l'API échoue
    return true;
  }
}

/**
 * Récupération du profil utilisateur actuel
 * @returns {Promise<Object>} Profil utilisateur
 */
export async function fetchUserProfile() {
  try {
    const response = await authAPI.getProfile();
    return response.data || response;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    
    throw new Error('Impossible de charger le profil utilisateur.');
  }
}

/**
 * Mise à jour du profil utilisateur
 * @param {Object} profileData - Nouvelles données du profil
 * @returns {Promise<Object>} Profil mis à jour
 */
export async function updateUserProfile(profileData) {
  try {
    const response = await authAPI.updateProfile(profileData);
    return response.data || response;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Impossible de mettre à jour le profil.');
  }
}

/**
 * Changement de mot de passe
 * @param {Object} passwordData - Données de changement de mot de passe
 * @param {string} passwordData.currentPassword - Mot de passe actuel
 * @param {string} passwordData.newPassword - Nouveau mot de passe
 * @param {string} passwordData.confirmPassword - Confirmation du nouveau mot de passe
 * @returns {Promise<boolean>} Succès du changement
 */
export async function changePassword(passwordData) {
  try {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      throw new Error('Mot de passe actuel et nouveau mot de passe requis.');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }
    if (passwordData.newPassword.length < 8) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
    }

    await authAPI.changePassword({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    
    if (error.response?.status === 400) {
      throw new Error('Mot de passe actuel incorrect.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Impossible de changer le mot de passe.');
  }
}

/**
 * Réinitialisation de mot de passe (demande)
 * @param {string} email - Email pour la réinitialisation
 * @returns {Promise<boolean>} Succès de l'envoi
 */
export async function requestPasswordReset(email) {
  try {
    if (!email) {
      throw new Error('Email requis.');
    }

    await authAPI.requestPasswordReset({ email });
    return true;
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Aucun compte associé à cet email.');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Impossible d\'envoyer l\'email de réinitialisation.');
  }
}

/**
 * Vérification du statut de l'utilisateur connecté
 * @returns {Promise<Object>} Statut et informations utilisateur
 */
export async function checkAuthStatus() {
  try {
    const response = await authAPI.getProfile();
    return {
      isAuthenticated: true,
      user: response.data || response
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

/**
 * Hook personnalisé pour l'authentification avec API
 */
export function useAuthAPI() {
  const notify = useNotify();

  return {
    // Opérations d'authentification
    async login(credentials) {
      try {
        const result = await loginUser(credentials);
        notify.success('Connexion réussie !');
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async register(userData) {
      try {
        const result = await registerUser(userData);
        notify.success('Inscription réussie !');
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async logout() {
      try {
        await logoutUser();
        notify.success('Déconnexion réussie');
        return true;
      } catch (error) {
        // On continue même en cas d'erreur
        notify.success('Déconnexion réussie');
        return true;
      }
    },

    // Opérations de profil
    async loadProfile() {
      try {
        const profile = await fetchUserProfile();
        return profile;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async saveProfile(profileData) {
      try {
        const result = await updateUserProfile(profileData);
        notify.success('Profil mis à jour avec succès');
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async changePassword(passwordData) {
      try {
        await changePassword(passwordData);
        notify.success('Mot de passe modifié avec succès');
        return true;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async resetPassword(email) {
      try {
        await requestPasswordReset(email);
        notify.success('Email de réinitialisation envoyé');
        return true;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async checkStatus() {
      try {
        const status = await checkAuthStatus();
        return status;
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        return { isAuthenticated: false, user: null };
      }
    }
  };
}

export default {
  loginUser,
  registerUser,
  logoutUser,
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  requestPasswordReset,
  checkAuthStatus,
  useAuthAPI
};
