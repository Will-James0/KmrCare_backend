/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User } from 'lucide-react';
import DoctorCard from './DoctorCard';

const DoctorList = ({ 
  doctors = [], 
  loading = false, 
  searchTerm = '', 
  onSearchChange,
  onAddDoctor,
  onEditDoctor,
  onDeleteDoctor,
  onViewDoctor,
  viewMode = 'list'
}) => {
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f425d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex items-center space-x-4">
          {/* Barre de recherche */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Bouton d'ajout */}
        <button
          onClick={onAddDoctor}
          className="flex items-center px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7a3a] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un médecin
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Total médecins</div>
          <div className="text-2xl font-bold text-[#0f425d]">{doctors.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Médecins actifs</div>
          <div className="text-2xl font-bold text-green-600">
            {doctors.filter(d => d.is_active || d.status === 'Actif').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Résultats filtrés</div>
          <div className="text-2xl font-bold text-blue-600">{filteredDoctors.length}</div>
        </div>
      </div>

      {/* Liste des médecins */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-400 mb-2">
            <User className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun médecin trouvé</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par ajouter votre premier médecin'
            }
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onEdit={onEditDoctor}
                onDelete={onDeleteDoctor}
                onView={onViewDoctor}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredDoctors.map((doctor) => (
                  <motion.tr
                    key={doctor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#0f425d] rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {doctor.first_name} {doctor.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.speciality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onViewDoctor?.(doctor)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => onEditDoctor?.(doctor)}
                        className="text-[#0b9444] hover:text-[#0a7c3a]"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDeleteDoctor?.(doctor)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
