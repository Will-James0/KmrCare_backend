/* eslint-disable no-unused-vars */
import { careAPI } from './api.js';
import { useNotify } from '../_store/notifications.js';
import { useAuth } from '../_store/auth.js';
import { serverCare } from './server.js';

/**
 * Service de gestion des médecins via l'API care/doctor
 * Interface complète entre l'API backend et le frontend
 */

/**
 * Récupère le token du dispensaire depuis le store auth
 * @returns {string|null} Token du dispensaire
 */
function getDispensaryToken() {
  const authStore = useAuth.getState();
  return authStore.getDispensaryToken();
}

/**
 * Récupère tous les médecins avec filtres optionnels
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise<Array>} Liste des médecins
 */
export async function fetchDoctors(params = {}) {
  try {
    const response = await careAPI.getDoctors(params);
    return response.data || response.results || response;
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins:', error);
    throw new Error(
      error.response?.data?.message || 
      'Impossible de charger les médecins. Vérifiez votre connexion.'
    );
  }
}

/**
 * Récupère tous les médecins du dispensaire connecté
 * @param {Object} params - Paramètres de filtrage optionnels
 * @returns {Promise<Array>} Liste des médecins du dispensaire
 */
export async function fetchDispensaryDoctors(params = {}) {
  try {
    const dispensaryToken = getDispensaryToken();
    if (!dispensaryToken) {
      throw new Error('Token du dispensaire non disponible. Veuillez vous reconnecter.');
    }
    
    const response = await careAPI.getDoctors(params);
    return response.data || response.results || response;
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins du dispensaire:', error);
    throw new Error(
      error.response?.data?.message || 
      'Impossible de charger les médecins du dispensaire.'
    );
  }
}

/**
 * Récupère les détails d'un médecin par son token
 * @param {string} doctorToken - Token du médecin
 * @returns {Promise<Object>} Détails du médecin
 */
export async function fetchDoctorDetail(doctorToken) {
  try {
    const response = await careAPI.getDoctorDetail(doctorToken);
    return response.data || response;
  } catch (error) {
    console.error(`Erreur lors de la récupération du médecin ${doctorToken}:`, error);
    throw new Error(
      error.response?.data?.message || 
      'Impossible de charger les détails du médecin.'
    );
  }
}

/**
 * Crée un nouveau médecin dans un dispensaire
 * @param {string} dispensaryToken - Token du dispensaire
 * @param {Object} doctorData - Données du médecin
 * @returns {Promise<Object>} Médecin créé
 */
export async function createDoctor(dispensaryToken, doctorData) {
  try {
    console.log('🏥 CreateDoctor - Token dispensaire:', dispensaryToken);
    console.log('👨‍⚕️ CreateDoctor - Données médecin:', doctorData);
    
    // Validation basique côté frontend
    if (!doctorData.first_name || !doctorData.last_name) {
      throw new Error('Le prénom et le nom sont obligatoires.');
    }
    if (!doctorData.email) {
      throw new Error('L\'email est obligatoire.');
    }
    if (!doctorData.username) {
      throw new Error('Le nom d\'utilisateur est obligatoire.');
    }
    if (!doctorData.password) {
      throw new Error('Le mot de passe est obligatoire.');
    }
    if (!doctorData.role) {
      throw new Error('Le rôle est obligatoire.');
    }

    // Transformation des données pour correspondre au serializer backend
    const backendData = {
      first_name: doctorData.first_name,
      last_name: doctorData.last_name,
      email: doctorData.email,
      username: doctorData.username,
      password: doctorData.password,
      role: doctorData.role, // Envoyer le rôle tel quel
      specialization: doctorData.speciality || doctorData.specialization || '', // Mapping speciality -> specialization
      phone: doctorData.phone || '' // Ajouter le téléphone s'il existe
    };

    console.log('📤 CreateDoctor - Données envoyées au backend:', backendData);
    console.log('🎭 CreateDoctor - Rôle envoyé:', doctorData.role);
    console.log('⚕️ CreateDoctor - Spécialisation envoyée:', doctorData.speciality);
    console.log('🌐 CreateDoctor - Appel API avec token:', dispensaryToken);

    const response = await careAPI.createDoctor(dispensaryToken, backendData);
    console.log('✅ CreateDoctor - Réponse backend:', response);
    return response.data || response;
  } catch (error) {
    console.error('❌ CreateDoctor - Erreur complète:', error);
    console.error('❌ CreateDoctor - Response error:', error.response);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data) {
      // Gestion des erreurs de validation du backend
      const errorMessages = [];
      Object.keys(error.response.data).forEach(field => {
        if (Array.isArray(error.response.data[field])) {
          errorMessages.push(...error.response.data[field]);
        } else {
          errorMessages.push(error.response.data[field]);
        }
      });
      throw new Error(errorMessages.join(' '));
    }
    throw new Error('Impossible de créer le médecin. Vérifiez les données.');
  }
}

/**
 * Crée un nouveau médecin dans le dispensaire connecté
 * @param {Object} doctorData - Données du médecin
 * @returns {Promise<Object>} Médecin créé
 */
export async function createDispensaryDoctor(doctorData) {
  try {
    const dispensaryToken = getDispensaryToken();
    if (!dispensaryToken) {
      throw new Error('Token du dispensaire non disponible. Veuillez vous reconnecter.');
    }
    
    return await createDoctor(dispensaryToken, doctorData);
  } catch (error) {
    console.error('Erreur lors de la création du médecin dans le dispensaire:', error);
    throw error; // Relancer l'erreur pour qu'elle soit gérée par createDoctor
  }
}

/**
 * Met à jour un médecin existant
 * @param {string} doctorToken - Token du médecin
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Médecin mis à jour
 */
export async function updateDoctor(doctorToken, updateData) {
  try {
    // Transformation des données pour correspondre au serializer backend
    const backendData = {
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      email: updateData.email,
      username: updateData.username,
      role: updateData.role,
      specialization: updateData.speciality || updateData.specialization || '' // Mapping speciality -> specialization
    };

    // Inclure le mot de passe seulement s'il est fourni
    if (updateData.password && updateData.password.trim() !== '') {
      backendData.password = updateData.password;
    }

    // Pour l'instant, on utilise la même méthode que la création
    // car l'API ne semble pas avoir d'endpoint de mise à jour spécifique
    const response = await careAPI.createDoctor(doctorToken, backendData);
    return response.data || response;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du médecin ${doctorToken}:`, error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data) {
      // Gestion des erreurs de validation du backend
      const errorMessages = [];
      Object.keys(error.response.data).forEach(field => {
        if (Array.isArray(error.response.data[field])) {
          errorMessages.push(...error.response.data[field]);
        } else {
          errorMessages.push(error.response.data[field]);
        }
      });
      throw new Error(errorMessages.join(' '));
    }
    throw new Error('Impossible de mettre à jour le médecin.');
  }
}

/**
 * Supprime un médecin
 * @param {string} doctorToken - Token du médecin
 * @returns {Promise<boolean>} Succès de la suppression
 */
export async function deleteDoctor(doctorToken) {
  try {
    await careAPI.deleteDoctor(doctorToken);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du médecin ${doctorToken}:`, error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Impossible de supprimer le médecin.');
  }
}

/**
 * Recherche des médecins avec filtres
 * @param {Object} filters - Filtres de recherche
 * @returns {Promise<Array>} Médecins filtrés
 */
export async function searchDoctors(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.specialization) {
      params.append('specialization', filters.specialization);
    }
    if (filters.dispensary) {
      params.append('dispensary', filters.dispensary);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }

    const response = await careAPI.getDoctors(params.toString());
    return response.data || response.results || response;
  } catch (error) {
    console.error('Erreur lors de la recherche de médecins:', error);
    throw new Error('Impossible d\'effectuer la recherche.');
  }
}

/**
 * Récupère les médecins d'un dispensaire spécifique
 * @param {number|string} dispensaryId - ID du dispensaire
 * @returns {Promise<Array>} Médecins du dispensaire
 */
export async function fetchDoctorsByDispensary(dispensaryId) {
  try {
    const filters = { dispensary: dispensaryId };
    return await searchDoctors(filters);
  } catch (error) {
    console.error(`Erreur lors de la récupération des médecins du dispensaire ${dispensaryId}:`, error);
    throw new Error('Impossible de charger les médecins de ce dispensaire.');
  }
}

/**
 * Met à jour le statut d'un médecin (actif/inactif)
 * @param {number|string} id - ID du médecin
 * @param {string} status - Nouveau statut
 * @returns {Promise<Object>} Médecin mis à jour
 */
export async function updateDoctorStatus(id, status) {
  try {
    return await updateDoctor(id, { status });
  } catch (error) {
    throw new Error('Impossible de modifier le statut du médecin.');
  }
}

/**
 * Assigne un médecin à un dispensaire
 * @param {number|string} doctorId - ID du médecin
 * @param {number|string} dispensaryId - ID du dispensaire
 * @returns {Promise<Object>} Médecin mis à jour
 */
export async function assignDoctorToDispensary(doctorId, dispensaryId) {
  try {
    return await updateDoctor(doctorId, { dispensary: dispensaryId });
  } catch (error) {
    throw new Error('Impossible d\'assigner le médecin au dispensaire.');
  }
}

/**
 * Exporte les médecins en format CSV
 * @param {Array} doctors - Liste des médecins à exporter
 * @returns {Blob} Fichier CSV
 */
export async function exportDoctors(doctors) {
  try {
    const headers = [
      'ID',
      'Prénom',
      'Nom',
      'Email',
      'Téléphone',
      'Spécialisation',
      'Dispensaire',
      'Statut',
      'Expérience (années)',
      'Date d\'embauche',
      'Dernière connexion'
    ];

    const rows = doctors.map(d => [
      d.id,
      d.first_name || d.firstName || '',
      d.last_name || d.lastName || '',
      d.email,
      d.phone || d.contact_phone || '',
      d.specialization || d.specialty || '',
      d.dispensary_name || d.dispensary?.name || '',
      d.status,
      d.experience_years || d.experience || '',
      d.hire_date || d.hireDate || '',
      d.last_login || d.lastLogin || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw new Error('Impossible d\'exporter les données.');
  }
}

/**
 * Fonction standalone pour supprimer un médecin
 * @param {string} doctorToken - Token du médecin à supprimer
 * @returns {Promise<boolean>} - Succès de la suppression
 */
export async function removeDoctorFromService(doctorToken) {
  try {
    await deleteDoctor(doctorToken);
    return true;
  } catch (error) {
    throw new Error('Impossible de supprimer le médecin.');
  }
}

/**
 * Hook personnalisé pour la gestion des médecins avec API
 */
export function useDoctorAPI() {
  const notify = useNotify();

  return {
    // Opérations CRUD
    async loadDoctors() {
      try {
        const doctors = await fetchDoctors();
        return doctors;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async loadDoctor(doctorToken) {
      try {
        const doctor = await fetchDoctorDetail(doctorToken);
        return doctor;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async saveDoctor(dispensaryToken, data, isUpdate = false) {
      try {
        let result;
        if (isUpdate && data.token) {
          result = await updateDoctor(data.token, data);
          notify.success('Médecin mis à jour avec succès');
        } else {
          result = await createDoctor(dispensaryToken, data);
          notify.success('Médecin créé avec succès');
        }
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async searchDoctors(filters) {
      try {
        const results = await searchDoctors(filters);
        return results;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async loadDoctorsByDispensary(dispensaryId) {
      try {
        const doctors = await fetchDoctorsByDispensary(dispensaryId);
        return doctors;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async updateStatus(id, status) {
      try {
        const result = await updateDoctorStatus(id, status);
        notify.success('Statut mis à jour avec succès');
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async assignToDispensary(doctorId, dispensaryId) {
      try {
        const result = await assignDoctorToDispensary(doctorId, dispensaryId);
        notify.success('Médecin assigné avec succès');
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async exportDoctors(doctors) {
      try {
        const file = await exportDoctors(doctors);
        
        // Téléchargement automatique
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medecins_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        notify.success('Export réalisé avec succès');
        return true;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    }
  };
}

export default {
  fetchDoctors,
  fetchDispensaryDoctors,
  fetchDoctorDetail,
  createDoctor,
  createDispensaryDoctor,
  updateDoctor,
  deleteDoctor,
  removeDoctorFromService,
  searchDoctors,
  fetchDoctorsByDispensary,
  updateDoctorStatus,
  assignDoctorToDispensary,
  exportDoctors,
  useDoctorAPI
};
