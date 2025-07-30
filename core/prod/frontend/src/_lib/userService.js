import { authAPI } from './api';

/**
 * Service pour la gestion des utilisateurs
 */
export const userService = {
  /**
   * Récupère tous les utilisateurs
   */
  getUsers: async () => {
    try {
      const response = await authAPI.getUsers();
      return Array.isArray(response) ? response : response?.results || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un utilisateur
   */
  getUserDetail: async (token) => {
    try {
      return await authAPI.getUserDetail(token);
    } catch (error) {
      console.error('Erreur lors de la récupération du détail utilisateur:', error);
      throw error;
    }
  },

  /**
   * Met à jour un utilisateur
   */
  updateUser: async (token, userData) => {
    try {
      return await authAPI.updateUser(token, userData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (token) => {
    try {
      return await authAPI.deleteUser(token);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  /**
   * Transforme les données utilisateur pour l'affichage
   */
  transformUserData: (user) => {
    return {
      id: user.token,
      token: user.token,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email,
      username: user.username,
      phone: user.phone || 'Non renseigné',
      role: getUserRole(user),
      status: user.is_active ? 'active' : 'inactive',
      isStaff: user.is_staff,
      isSuperuser: user.is_superuser,
      isDoctor: user.is_doctor,
      isOwner: user.is_owner,
      joinDate: user.date_joined || 'Non disponible',
      lastLogin: user.last_login || 'Jamais connecté',
      image: user.image
    };
  },

  /**
   * Filtre les utilisateurs selon les critères
   */
  filterUsers: (users, searchTerm, roleFilter) => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Logique de filtrage par rôle améliorée
      let matchesRole = false;
      
      if (roleFilter === 'all') {
        matchesRole = true;
      } else if (roleFilter === 'admin') {
        // Filtre admin : inclut tous les utilisateurs avec is_staff (admin et superuser)
        matchesRole = user.isStaff;
      } else if (roleFilter === 'superuser') {
        // Filtre superuser : seulement les superutilisateurs
        matchesRole = user.isSuperuser;
      } else if (roleFilter === 'doctor') {
        // Filtre doctor : tous les utilisateurs qui sont médecins
        matchesRole = user.isDoctor;
      } else if (roleFilter === 'owner') {
        // Filtre owner : tous les utilisateurs qui sont propriétaires
        matchesRole = user.isOwner;
      } else if (roleFilter === 'patient') {
        // Filtre patient : utilisateurs qui ne sont ni staff, ni doctor, ni owner
        matchesRole = !user.isStaff && !user.isDoctor && !user.isOwner;
      } else {
        // Filtre par rôle principal exact
        matchesRole = user.role === roleFilter;
      }
      
      return matchesSearch && matchesRole;
    });
  }
};

/**
 * Détermine le rôle d'un utilisateur basé sur ses permissions et relations
 */
function getUserRole(user) {
  if (user.is_superuser) {
    return 'superuser';
  }
  if (user.is_staff) {
    return 'admin';
  }
  if (user.is_owner) {
    return 'owner';
  }
  if (user.is_doctor) {
    return 'doctor';
  }
  // Par défaut, considérer comme patient si pas d'autres rôles
  return 'patient';
}

/**
 * Obtient le label d'affichage du rôle
 */
export const getRoleLabel = (role) => {
  switch (role) {
    case 'patient': return 'Patient';
    case 'doctor': return 'Médecin';
    case 'owner': return 'Propriétaire';
    case 'admin': return 'Administrateur';
    case 'superuser': return 'Super Admin';
    default: return role;
  }
};

/**
 * Obtient la couleur du statut
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Obtient le label du statut
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'inactive': return 'Inactif';
    case 'pending': return 'En attente';
    default: return status;
  }
};

export default userService;
