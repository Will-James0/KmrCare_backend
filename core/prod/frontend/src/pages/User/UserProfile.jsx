/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../_store/auth';
import { authAPI } from '../../_lib/api';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.token) {
      setError('Token utilisateur manquant');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await authAPI.updateProfile(user.token, formData);
      
      // Mettre à jour le store avec les nouvelles données
      if (setUser) {
        setUser({
          ...user,
          ...response
        });
      }
      
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo de profil et informations de base */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="mb-4">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt="Photo de profil" 
                      className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="h-32 w-32 bg-primary rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                      <span className="text-white text-4xl font-bold">
                        {user.first_name?.charAt(0) || user.username?.charAt(0) || '👤'}
                      </span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username
                  }
                </h2>
                
                <p className="text-gray-600 mb-4">Patient</p>
                
                <button 
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  disabled
                >
                  📷 Changer la photo
                  <span className="block text-xs text-gray-500 mt-1">(Bientôt disponible)</span>
                </button>
              </div>

              {/* Statistiques rapides */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rendez-vous totaux</span>
                    <span className="font-semibold text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Prochains RDV</span>
                    <span className="font-semibold text-gray-900">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Membre depuis</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(user.date_joined || Date.now()).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Informations détaillées */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Informations Personnelles</h3>
                <div className="flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sauvegarde...
                          </span>
                        ) : (
                          'Sauvegarder'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      ✏️ Modifier
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.first_name || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.last_name || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {user.phone || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'inscription
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                    {user.date_joined 
                      ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Non disponible'
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section Sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sécurité</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mot de passe</h4>
                    <p className="text-sm text-gray-600">Dernière modification il y a plus de 30 jours</p>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                    Changer
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-600">Renforcez la sécurité de votre compte</p>
                  </div>
                  <button 
                    className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Bientôt disponible
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Section Préférences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications par email</h4>
                    <p className="text-sm text-gray-600">Recevoir des notifications pour les rendez-vous</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications SMS</h4>
                    <p className="text-sm text-gray-600">Recevoir des rappels par SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
