/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DispensariesManagement = () => {
  const [dispensaries, setDispensaries] = useState([]);
  const [filteredDispensaries, setFilteredDispensaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDispensary, setSelectedDispensary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;

  // Données fictives pour les dispensaires
  const mockDispensaries = [
    {
      id: 1,
      name: "Dispensaire Central Dakar",
      address: "Avenue Cheikh Anta Diop, Dakar",
      phone: "+221 33 864 5678",
      email: "central.dakar@kmrcare.sn",
      manager: "Dr. Fatou Diallo",
      services: ["Consultation générale", "Pédiatrie", "Gynécologie"],
      status: "active",
      capacity: 150,
      currentPatients: 120,
      operatingHours: "08:00 - 18:00",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Dispensaire Médina",
      address: "Rue 15, Médina, Dakar",
      phone: "+221 33 842 3456",
      email: "medina@kmrcare.sn",
      manager: "Dr. Mamadou Sow",
      services: ["Consultation générale", "Vaccination", "Soins infirmiers"],
      status: "active",
      capacity: 100,
      currentPatients: 85,
      operatingHours: "07:30 - 17:30",
      createdAt: "2024-02-20"
    },
    {
      id: 3,
      name: "Dispensaire Pikine",
      address: "Quartier Guinaw Rail, Pikine",
      phone: "+221 33 855 7890",
      email: "pikine@kmrcare.sn",
      manager: "Dr. Aminata Ba",
      services: ["Consultation générale", "Maternité", "Urgences"],
      status: "maintenance",
      capacity: 120,
      currentPatients: 0,
      operatingHours: "Fermé temporairement",
      createdAt: "2024-03-10"
    },
    {
      id: 4,
      name: "Dispensaire Guédiawaye",
      address: "Cité Millionnaire, Guédiawaye",
      phone: "+221 33 834 5678",
      email: "guediawaye@kmrcare.sn",
      manager: "Dr. Ousmane Dieng",
      services: ["Consultation générale", "Dentaire", "Ophtalmologie"],
      status: "active",
      capacity: 80,
      currentPatients: 65,
      operatingHours: "08:00 - 17:00",
      createdAt: "2024-04-05"
    },
    {
      id: 5,
      name: "Dispensaire Thiès",
      address: "Avenue Lamine Gueye, Thiès",
      phone: "+221 33 951 2345",
      email: "thies@kmrcare.sn",
      manager: "Dr. Awa Ndiaye",
      services: ["Consultation générale", "Cardiologie", "Neurologie"],
      status: "active",
      capacity: 200,
      currentPatients: 180,
      operatingHours: "07:00 - 19:00",
      createdAt: "2024-05-12"
    },
    {
      id: 6,
      name: "Dispensaire Kaolack",
      address: "Quartier Bongré, Kaolack",
      phone: "+221 33 941 6789",
      email: "kaolack@kmrcare.sn",
      manager: "Dr. Ibrahima Fall",
      services: ["Consultation générale", "Pédiatrie", "Pharmacie"],
      status: "inactive",
      capacity: 90,
      currentPatients: 0,
      operatingHours: "Fermé",
      createdAt: "2024-06-08"
    }
  ];

  // Simulation du chargement des données
  useEffect(() => {
    const loadDispensaries = async () => {
      setIsLoading(true);
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDispensaries(mockDispensaries);
      setFilteredDispensaries(mockDispensaries);
      setIsLoading(false);
    };

    loadDispensaries();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = dispensaries;

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(dispensary => dispensary.status === statusFilter);
    }

    // Recherche par nom, adresse ou responsable
    if (searchTerm) {
      filtered = filtered.filter(dispensary =>
        dispensary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispensary.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispensary.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDispensaries(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dispensaries]);

  // Pagination
  const totalPages = Math.ceil(filteredDispensaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDispensaries = filteredDispensaries.slice(startIndex, startIndex + itemsPerPage);

  // Statistiques
  const stats = {
    total: dispensaries.length,
    active: dispensaries.filter(d => d.status === 'active').length,
    maintenance: dispensaries.filter(d => d.status === 'maintenance').length,
    inactive: dispensaries.filter(d => d.status === 'inactive').length,
    totalCapacity: dispensaries.reduce((sum, d) => sum + d.capacity, 0),
    totalPatients: dispensaries.reduce((sum, d) => sum + d.currentPatients, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <span className="text-green-600">✅</span>;
      case 'maintenance': return <span className="text-yellow-600">⏳</span>;
      case 'inactive': return <span className="text-red-600">❌</span>;
      default: return null;
    }
  };

  const handleEdit = (dispensary) => {
    setSelectedDispensary(dispensary);
    setShowEditModal(true);
  };

  const handleDelete = (dispensary) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le dispensaire "${dispensary.name}" ?`)) {
      setDispensaries(prev => prev.filter(d => d.id !== dispensary.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            Gérez les dispensaires, leurs services et leur statut
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-primary text-2xl flex items-center justify-center">
              🏥
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-green-500 text-2xl flex items-center justify-center">
              ✅
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-yellow-500 text-2xl flex items-center justify-center">
              ⏳
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-red-500 text-2xl flex items-center justify-center">
              ❌
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-blue-500 text-2xl flex items-center justify-center">
              👥
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Capacité</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCapacity}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >          <div className="flex items-center">
            <div className="h-8 w-8 text-purple-500 text-2xl flex items-center justify-center">
              🏥
            </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contrôles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher un dispensaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 text-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filtre par statut */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-secondary focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="maintenance">En maintenance</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>

            {/* Bouton d'ajout */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span>
              Ajouter un dispensaire
            </button>
          </div>
        </div>

        {/* Liste des dispensaires */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispensaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedDispensaries.map((dispensary, index) => (
                    <motion.tr
                      key={dispensary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary text-lg">🏥</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dispensary.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <span className="mr-1">📍</span>
                              {dispensary.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{dispensary.manager}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <span className="mr-1">📞</span>
                          {dispensary.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {dispensary.services.slice(0, 2).map((service, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {service}
                            </span>
                          ))}
                          {dispensary.services.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{dispensary.services.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dispensary.status)}`}>
                          {getStatusIcon(dispensary.status)}
                          <span className="ml-1 capitalize">{dispensary.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(dispensary.currentPatients / dispensary.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs">
                            {dispensary.currentPatients}/{dispensary.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(dispensary)}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <span className="text-lg">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDelete(dispensary)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                      {Math.min(startIndex + itemsPerPage, filteredDispensaries.length)}
                    </span>{' '}
                    sur <span className="font-medium">{filteredDispensaries.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

      {/* Modales (placeholders pour l'ajout/modification) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter un dispensaire</h2>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en cours de développement. L`intégration avec le backend permettra d'ajouter de nouveaux dispensaires.
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showEditModal && selectedDispensary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Modifier le dispensaire</h2>
            <p className="text-gray-600 mb-4">
              Modification de "{selectedDispensary.name}". L`intégration avec le backend permettra de modifier les informations du dispensaire.
            </p>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispensariesManagement;
