/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useUI, useNotify, useDispensaires, usePreferences } from "../../_store";
import { useListManagement } from "../../hooks/useComposedStores";
import { useDispensaryAPI } from "../../_lib/dispensaryService";

const DispensariesManagementImproved = () => {
  // Utilisation des nouveaux stores
  const { 
    dispensaires, 
    loaded: dispensairesLoaded,
    setDispensaires,
    addDispensaire,
    updateDispensaire,
    removeDispensaire,
    search: searchDispensaires
  } = useDispensaires();

  const notify = useNotify();
  const { isLoading, setLoading } = useUI();
  const { showModal, hideModal, isModalOpen } = useUI();
  
  // API service pour les dispensaires
  const dispensaryAPI = useDispensaryAPI();
  
  // Gestion des listes avec les nouveaux hooks
  const {
    filters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    compactMode,
    showGridLines
  } = useListManagement('dispensaires');

  // Chargement initial des données
  useEffect(() => {
    loadDispensaries();
  }, []);

  const loadDispensaries = async () => {
    if (dispensairesLoaded) return;

    setLoading('dispensaires', true);
    
    try {
      const data = await dispensaryAPI.loadDispensaries();
      setDispensaires(data);
    } catch (error) {
      // L'erreur est déjà gérée dans le service API
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading('dispensaires', false);
    }
  };

  // Fonction pour créer un nouveau dispensaire
  const handleCreateDispensary = async (dispensaryData) => {
    try {
      setLoading('create_dispensary', true);
      const newDispensary = await dispensaryAPI.saveDispensary(dispensaryData, false);
      addDispensaire(newDispensary);
      hideModal();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading('create_dispensary', false);
    }
  };

  // Fonction pour mettre à jour un dispensaire
  const handleUpdateDispensary = async (id, updateData) => {
    try {
      setLoading('update_dispensary', true);
      const updatedDispensary = await dispensaryAPI.saveDispensary({ id, ...updateData }, true);
      updateDispensaire(id, updatedDispensary);
      hideModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading('update_dispensary', false);
    }
  };

  // Fonction pour supprimer un dispensaire
  const handleDeleteDispensary = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dispensaire ?')) {
      return;
    }

    try {
      setLoading('delete_dispensary', true);
      await dispensaryAPI.deleteDispensary(id);
      removeDispensaire(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading('delete_dispensary', false);
    }
  };

  // Fonction pour exporter les données
  const handleExportDispensaries = async () => {
    try {
      setLoading('export_dispensaries', true);
      await dispensaryAPI.exportDispensaries(filteredDispensaires, 'csv');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setLoading('export_dispensaries', false);
    }
  };

  // Fonction pour rafraîchir les données
  const handleRefresh = async () => {
    setLoading('dispensaires', true);
    try {
      const data = await dispensaryAPI.loadDispensaries();
      setDispensaires(data);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setLoading('dispensaires', false);
    }
  };

  // Filtrage des dispensaires avec les nouveaux filtres
  const filteredDispensaires = searchDispensaires(
    filters.search || '',
    {
      status: filters.status,
      arrondissement: filters.arrondissement
    }
  );

  // Pagination
  const totalPages = Math.ceil(filteredDispensaires.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDispensaires = filteredDispensaires.slice(startIndex, startIndex + itemsPerPage);

  // Statistiques calculées
  const stats = {
    total: dispensaires.length,
    active: dispensaires.filter(d => d.status === 'active').length,
    maintenance: dispensaires.filter(d => d.status === 'maintenance').length,
    inactive: dispensaires.filter(d => d.status === 'inactive').length,
    totalCapacity: dispensaires.reduce((sum, d) => sum + (d.capacity || 0), 0),
    totalPatients: dispensaires.reduce((sum, d) => sum + (d.currentPatients || 0), 0)
  };

  // Actions CRUD améliorées avec notifications
  const handleAdd = () => {
    showModal('addDispensaire');
  };

  const handleEdit = (dispensaire) => {
    showModal('editDispensaire', dispensaire);
  };

  const handleDelete = async (dispensaire) => {
    const confirmDelete = await new Promise(resolve => {
      notify.confirm(
        `Êtes-vous sûr de vouloir supprimer le dispensaire "${dispensaire.name}" ?`,
        resolve,
        {
          title: 'Confirmer la suppression',
          confirmLabel: 'Supprimer',
          cancelLabel: 'Annuler'
        }
      );
    });

    if (confirmDelete) {
      try {
        removeDispensaire(dispensaire.id);
        notify.success(`Dispensaire "${dispensaire.name}" supprimé avec succès`);
      } catch (error) {
        notify.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'maintenance':
        return '⏳';
      case 'inactive':
        return '❌';
      default:
        return '❓';
    }
  };

  if (isLoading('dispensaires')) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Dispensaires
          </h1>
          <p className="text-gray-600">
            Gérez les dispensaires, leurs services et leur statut (Version améliorée avec stores globaux)
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
            icon="🏥"
            color="text-blue-500"
            delay={0}
          />
          <StatsCard
            title="Actifs"
            value={stats.active}
            icon="✅"
            color="text-green-500"
            delay={0.1}
          />
          <StatsCard
            title="Maintenance"
            value={stats.maintenance}
            icon="⏳"
            color="text-yellow-500"
            delay={0.2}
          />
          <StatsCard
            title="Inactifs"
            value={stats.inactive}
            icon="❌"
            color="text-red-500"
            delay={0.3}
          />
          <StatsCard
            title="Capacité"
            value={stats.totalCapacity}
            icon="👥"
            color="text-blue-500"
            delay={0.4}
          />
          <StatsCard
            title="Patients"
            value={stats.totalPatients}
            icon="🏥"
            color="text-purple-500"
            delay={0.5}
          />
        </div>

        {/* Contrôles avec filtres améliorés */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher un dispensaire..."
                  value={filters.search || ''}
                  onChange={(e) => setFilter('search', e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtre par statut */}
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilter('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactif</option>
              </select>

              {/* Bouton de réinitialisation */}
              <button
                onClick={() => resetFilters()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
            </div>

            {/* Bouton d'ajout */}
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Nouveau dispensaire</span>
            </button>
          </div>
        </div>

        {/* Liste des dispensaires */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header du tableau */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Dispensaires ({filteredDispensaires.length})
            </h3>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 ${showGridLines ? 'border-collapse' : ''}`}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispensaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDispensaires.map((dispensaire, index) => (
                  <motion.tr
                    key={dispensaire.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`hover:bg-gray-50 ${compactMode ? 'h-12' : 'h-16'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {dispensaire.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {dispensaire.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dispensaire.manager}</div>
                      <div className="text-sm text-gray-500">{dispensaire.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispensaire.status)}`}>
                        {getStatusIcon(dispensaire.status)} {dispensaire.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dispensaire.currentPatients || 0}/{dispensaire.capacity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {(dispensaire.services || []).slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded"
                          >
                            {service}
                          </span>
                        ))}
                        {(dispensaire.services?.length || 0) > 2 && (
                          <span className="text-xs text-gray-500">
                            +{(dispensaire.services?.length || 0) - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(dispensaire)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(dispensaire)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination améliorée */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{' '}
                    <span className="font-medium">{startIndex + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredDispensaires.length)}
                    </span>{' '}
                    sur <span className="font-medium">{filteredDispensaires.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de statistiques
const StatsCard = ({ title, value, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
  >
    <div className="flex items-center">
      <div className={`h-8 w-8 ${color} text-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default DispensariesManagementImproved;
