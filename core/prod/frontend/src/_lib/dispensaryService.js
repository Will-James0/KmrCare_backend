import { careAPI } from './api.js';
import { useNotify } from '../_store/notifications.js';

/**
 * Service de gestion des dispensaires
 * Interface entre l'API backend et le frontend
 */

/**
 * Récupère tous les dispensaires
 * @returns {Promise<Array>} Liste des dispensaires
 */
export async function fetchDispensaries() {
  try {
    const response = await careAPI.getDispensaries();
    return response.data || response.results || response;
  } catch (error) {
    console.error('Erreur lors de la récupération des dispensaires:', error);
    throw new Error('Impossible de charger les dispensaires. Vérifiez votre connexion.');
  }
}

/**
 * Récupère un dispensaire par son ID
 * @param {number|string} id - ID du dispensaire
 * @returns {Promise<Object>} Dispensaire trouvé
 */
export async function fetchDispensaryById(id) {
  try {
    const response = await careAPI.getDispensary(id);
    return response.data || response;
  } catch (error) {
    console.error(`Erreur lors de la récupération du dispensaire ${id}:`, error);
    throw new Error('Impossible de charger les détails du dispensaire.');
  }
}

/**
 * Crée un nouveau dispensaire
 * @param {Object} dispensaryData - Données du dispensaire
 * @returns {Promise<Object>} Dispensaire créé
 */
export async function createDispensary(dispensaryData) {
  try {
    // Validation basique côté frontend
    if (!dispensaryData.name || !dispensaryData.address) {
      throw new Error('Le nom et l\'adresse sont obligatoires.');
    }

    const response = await careAPI.createDispensary(dispensaryData);
    return response.data || response;
  } catch (error) {
    console.error('Erreur lors de la création du dispensaire:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Impossible de créer le dispensaire. Vérifiez les données.');
  }
}

/**
 * Met à jour un dispensaire existant
 * @param {number|string} id - ID du dispensaire
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Dispensaire mis à jour
 */
export async function updateDispensary(id, updateData) {
  try {
    const response = await careAPI.updateDispensary(id, updateData);
    return response.data || response;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du dispensaire ${id}:`, error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Impossible de mettre à jour le dispensaire.');
  }
}

/**
 * Supprime un dispensaire
 * @param {number|string} id - ID du dispensaire
 * @returns {Promise<boolean>} Succès de la suppression
 */
export async function deleteDispensary(id) {
  try {
    await careAPI.deleteDispensary(id);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du dispensaire ${id}:`, error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Impossible de supprimer le dispensaire.');
  }
}

/**
 * Recherche des dispensaires avec filtres
 * @param {Object} filters - Filtres de recherche
 * @returns {Promise<Array>} Dispensaires filtrés
 */
export async function searchDispensaries(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.arrondissement) {
      params.append('arrondissement', filters.arrondissement);
    }
    if (filters.manager) {
      params.append('manager', filters.manager);
    }

    const response = await careAPI.getDispensaries(params.toString());
    return response.data || response.results || response;
  } catch (error) {
    console.error('Erreur lors de la recherche de dispensaires:', error);
    throw new Error('Impossible d\'effectuer la recherche.');
  }
}

/**
 * Exporte les dispensaires en format CSV/Excel
 * @param {Array} dispensaries - Liste des dispensaires à exporter
 * @param {string} format - Format d'export ('csv' ou 'excel')
 * @returns {Promise<Blob>} Fichier d'export
 */
export async function exportDispensaries(dispensaries, format = 'csv') {
  try {
    if (format === 'csv') {
      return exportToCSV(dispensaries);
    }
    // Pour l'export Excel, on peut utiliser une bibliothèque comme xlsx
    throw new Error('Format d\'export non supporté pour le moment.');
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw new Error('Impossible d\'exporter les données.');
  }
}

/**
 * Convertit les données en format CSV
 * @param {Array} dispensaries - Liste des dispensaires
 * @returns {Blob} Fichier CSV
 */
function exportToCSV(dispensaries) {
  const headers = [
    'ID',
    'Nom',
    'Adresse',
    'Responsable',
    'Téléphone',
    'Email',
    'Statut',
    'Capacité',
    'Patients actuels',
    'Services',
    'Date de création'
  ];

  const rows = dispensaries.map(d => [
    d.id,
    d.name,
    d.address,
    d.manager || d.responsible_name || '',
    d.phone || d.contact_phone || '',
    d.email || d.contact_email || '',
    d.status,
    d.capacity || '',
    d.currentPatients || d.current_patients || '',
    Array.isArray(d.services) ? d.services.join(', ') : (d.services || ''),
    d.createdAt || d.created_at || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Hook personnalisé pour la gestion des dispensaires avec API
 * Combine les opérations CRUD avec la gestion d'état locale
 */
export function useDispensaryAPI() {
  const notify = useNotify();

  return {
    // Opérations CRUD
    async loadDispensaries() {
      try {
        const dispensaries = await fetchDispensaries();
        return dispensaries;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async loadDispensary(id) {
      try {
        const dispensary = await fetchDispensaryById(id);
        return dispensary;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async saveDispensary(data, isUpdate = false) {
      try {
        let result;
        if (isUpdate && data.id) {
          result = await updateDispensary(data.id, data);
          notify.success('Dispensaire mis à jour avec succès');
        } else {
          result = await createDispensary(data);
          notify.success('Dispensaire créé avec succès');
        }
        return result;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async deleteDispensary(id) {
      try {
        await deleteDispensary(id);
        notify.success('Dispensaire supprimé avec succès');
        return true;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async searchDispensaries(filters) {
      try {
        const results = await searchDispensaries(filters);
        return results;
      } catch (error) {
        notify.error(error.message);
        throw error;
      }
    },

    async exportDispensaries(dispensaries, format) {
      try {
        const file = await exportDispensaries(dispensaries, format);
        
        // Téléchargement automatique
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dispensaires_${new Date().toISOString().split('T')[0]}.${format}`;
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
  fetchDispensaries,
  fetchDispensaryById,
  createDispensary,
  updateDispensary,
  deleteDispensary,
  searchDispensaries,
  exportDispensaries,
  useDispensaryAPI
};
