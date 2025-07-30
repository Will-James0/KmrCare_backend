/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { authAPI } from '../../_lib/api';

const PendingRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getRequests();
      // La réponse est directement un tableau depuis l'API Django
      setRegistrations(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Erreur lors du chargement des demandes d\'inscription');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (token, registrationData) => {
    try {
      setActionLoading(token);
      await authAPI.approveRequest(token);
      
      // Supprimer de la liste locale
      setRegistrations(prev => prev.filter(reg => reg.token !== token));
      setSelectedRegistration(null);
      
      // Notification de succès
      alert(`Demande de ${registrationData.dispensary_name} approuvée avec succès !`);
    } catch (err) {
      console.error('Error approving registration:', err);
      alert('Erreur lors de l\'approbation de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (token, registrationData) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir rejeter la demande de ${registrationData.dispensary_name} ?`)) {
      return;
    }

    try {
      setActionLoading(token);
      await authAPI.rejectRequest(token);
      
      // Supprimer de la liste locale
      setRegistrations(prev => prev.filter(reg => reg.token !== token));
      setSelectedRegistration(null);
      
      // Notification de succès
      alert(`Demande de ${registrationData.dispensary_name} rejetée.`);
    } catch (err) {
      console.error('Error rejecting registration:', err);
      alert('Erreur lors du rejet de la demande');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des demandes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Erreur</h3>
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={fetchPendingRegistrations}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes d'inscription</h1>
        <p className="text-gray-600">
          Gérez les demandes d'inscription des propriétaires de dispensaires
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl text-gray-400 mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande en attente</h3>
          <p className="text-gray-600">
            Toutes les demandes d'inscription ont été traitées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des demandes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Demandes en attente ({registrations.length})
            </h2>
            
            {registrations.map((registration) => (
              <motion.div
                key={registration.token}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all ${
                  selectedRegistration?.token === registration.token
                    ? 'border-primary ring-2 ring-primary ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRegistration(registration)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {registration.logo ? (
                      <img 
                        src={registration.logo} 
                        alt="Logo" 
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xl">🏥</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {registration.dispensary_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {registration.first_name} {registration.last_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Email:</span> {registration.email}</p>
                    <p><span className="font-medium">Téléphone:</span> {registration.phone}</p>
                    <p><span className="font-medium">Quartier:</span> {registration.dispensary_quarter}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Détails de la demande sélectionnée */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails de la demande</h2>
            
            {selectedRegistration ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="flex items-center space-x-4">
                    {selectedRegistration.logo ? (
                      <img 
                        src={selectedRegistration.logo} 
                        alt="Logo" 
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">🏥</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedRegistration.dispensary_name}
                      </h3>
                      <p className="text-gray-600">
                        Demande de {selectedRegistration.first_name} {selectedRegistration.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Nom d'utilisateur:</span>
                        <p className="text-gray-900">{selectedRegistration.username}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <p className="text-gray-900">{selectedRegistration.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Téléphone:</span>
                        <p className="text-gray-900">{selectedRegistration.phone || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations du dispensaire */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations du dispensaire</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Spécialités:</span>
                        <p className="text-gray-900">{selectedRegistration.dispensary_specialities}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Localisation:</span>
                        <p className="text-gray-900">{selectedRegistration.dispensary_localisation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Quartier:</span>
                        <p className="text-gray-900">{selectedRegistration.dispensary_quarter}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-600">Ouverture:</span>
                          <p className="text-gray-900">{selectedRegistration.dispensary_opening}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Fermeture:</span>
                          <p className="text-gray-900">{selectedRegistration.dispensary_ending}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-600">Téléphone dispensaire:</span>
                          <p className="text-gray-900">{selectedRegistration.dispensary_phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Email dispensaire:</span>
                          <p className="text-gray-900">{selectedRegistration.dispensary_email || 'Non renseigné'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(selectedRegistration.token, selectedRegistration)}
                      disabled={actionLoading === selectedRegistration.token}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading === selectedRegistration.token ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Approbation...
                        </span>
                      ) : (
                        '✅ Approuver'
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(selectedRegistration.token, selectedRegistration)}
                      disabled={actionLoading === selectedRegistration.token}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading === selectedRegistration.token ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Rejet...
                        </span>
                      ) : (
                        '❌ Rejeter'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <div className="text-4xl text-gray-400 mb-4">👆</div>
                <p className="text-gray-600">
                  Sélectionnez une demande pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRegistrations;
