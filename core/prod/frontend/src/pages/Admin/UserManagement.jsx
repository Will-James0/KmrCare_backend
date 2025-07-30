/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { userService, getRoleLabel, getStatusColor, getStatusLabel } from "../../_lib/userService";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Chargement des utilisateurs depuis l'API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rawUsers = await userService.getUsers();
      const transformedUsers = rawUsers.map(user => userService.transformUserData(user));
      setUsers(transformedUsers);
      
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la suppression d'un utilisateur
  const handleDeleteUser = async (userToken) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(userToken);
      await loadUsers(); // Recharger la liste
      // TODO: Ajouter notification de succès
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Gestion de l'activation/désactivation
  const handleToggleUserStatus = async (user) => {
    try {
      const updatedData = {
        ...user,
        is_active: !user.status === 'active'
      };
      
      await userService.updateUser(user.token, updatedData);
      await loadUsers(); // Recharger la liste
      // TODO: Ajouter notification de succès
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = userService.filterUsers(users, searchTerm, filterRole);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const UserCard = ({ user, onDelete, onToggleStatus }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-[#159eec] rounded-full flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
            <p className="text-xs text-gray-400">{user.phone}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {getStatusLabel(user.status)}
          </span>
          
          {/* Tous les badges de rôles et permissions */}
          <div className="flex flex-col items-end space-y-1">
            {/* Rôle principal basé sur la hiérarchie */}
            {user.isSuperuser && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Super Admin
              </span>
            )}
            {user.isStaff && !user.isSuperuser && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Administrateur
              </span>
            )}
            
            {/* Rôles métier */}
            {user.isOwner && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                Propriétaire
              </span>
            )}
            {user.isDoctor && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Médecin
              </span>
            )}
            
            {/* Patient si aucun autre rôle */}
            {!user.isSuperuser && !user.isStaff && !user.isOwner && !user.isDoctor && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Patient
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Inscription:</span>
          <p className="font-medium">
            {user.joinDate !== 'Non disponible' 
              ? new Date(user.joinDate).toLocaleDateString('fr-FR')
              : user.joinDate
            }
          </p>
        </div>
        <div>
          <span className="text-gray-500">Dernière connexion:</span>
          <p className="font-medium">
            {user.lastLogin !== 'Jamais connecté' 
              ? new Date(user.lastLogin).toLocaleDateString('fr-FR')
              : user.lastLogin
            }
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={() => onToggleStatus(user)}
          className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
            user.status === 'active'
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {user.status === 'active' ? 'Désactiver' : 'Activer'}
        </button>
        <button 
          onClick={() => onDelete(user.token)}
          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          disabled={user.isSuperuser}
          title={user.isSuperuser ? 'Impossible de supprimer un super admin' : 'Supprimer cet utilisateur'}
        >
          {user.isSuperuser ? 'Protégé' : 'Supprimer'}
        </button>
      </div>
    </motion.div>
  );

  // Validation des props pour UserCard
  UserCard.propTypes = {
    user: PropTypes.shape({
      token: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      joinDate: PropTypes.string.isRequired,
      lastLogin: PropTypes.string.isRequired,
      image: PropTypes.string,
      isStaff: PropTypes.bool,
      isSuperuser: PropTypes.bool,
      isDoctor: PropTypes.bool,
      isOwner: PropTypes.bool,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleStatus: PropTypes.func.isRequired,
  };

  // Gestion du loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
            <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#159eec] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
            <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadUsers}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme ({users.length} utilisateurs)</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={loadUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={loading}
          >
            🔄 Actualiser
          </button>
          <button className="px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors font-medium">
            + Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom, email ou nom d'utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-secondary rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-secondary rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
            >
              <option value="all">Tous les rôles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Médecins</option>
              <option value="owner">Propriétaires</option>
              <option value="admin">Administrateurs</option>
              <option value="superuser">Super Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentUsers.map((user) => (
            <UserCard 
              key={user.token} 
              user={user} 
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleUserStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl text-gray-400 mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-600">
            {searchTerm || filterRole !== 'all' 
              ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
              : 'Aucun utilisateur n\'est encore enregistré dans le système.'
            }
          </p>
          {(searchTerm || filterRole !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterRole("all");
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 bg-[#159eec] text-white rounded-lg hover:bg-[#1384c7] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-[#159eec] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
