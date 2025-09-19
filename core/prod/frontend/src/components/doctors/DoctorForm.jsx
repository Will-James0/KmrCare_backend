/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Stethoscope, EyeOff, Shield, Lock, Eye } from 'lucide-react';

// Constantes des rôles
const DOCTOR_ROLES = {
  CHIEF_DOCTOR: { value: 'CHIEF_DOCTOR', label: 'Médecin Chef' },
  DOCTOR: { value: 'DOCTOR', label: 'Médecin' }
};

const DoctorForm = ({ doctor, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    first_name: doctor?.first_name || '',
    last_name: doctor?.last_name || '',
    email: doctor?.email || '',
    username: doctor?.username || '',
    speciality: doctor?.speciality || '',
    phone: doctor?.phone || '',
    role: doctor?.role || 'DOCTOR',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs requis
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!formData.speciality.trim()) newErrors.speciality = 'La spécialité est requise';
    if (!formData.role.trim()) newErrors.role = 'Le rôle est requis';

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation mot de passe pour nouveau médecin
    if (!doctor) {
      if (!formData.password) newErrors.password = 'Le mot de passe est requis';
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    // Validation mot de passe pour modification (optionnel)
    if (doctor && formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;
      
      // Si c'est une modification, ne pas envoyer le mot de passe s'il est vide
      if (doctor && !formData.password) {
        delete submitData.password;
      }
      
      await onSubmit(submitData)
        .then(() => console.log(`Soumission réussie : ${JSON.stringify(submitData)}`))
        .catch((err) => console.error("Erreur soumission", err));
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête */}
        <div className="text-center pb-4 border-b">
          <div className="w-16 h-16 bg-[#0f425d] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-[#0f425d]">
            {doctor ? 'Modifier le médecin' : 'Nouveau médecin'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {doctor ? 'Mettez à jour les informations du médecin' : 'Ajoutez un nouveau médecin à votre dispensaire'}
          </p>
        </div>

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="Entrez le prénom"
              />
            </div>
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="Entrez le nom"
              />
            </div>
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="exemple@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent"
                style={{ color: '#000000' }}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d&apos;utilisateur *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="nom_utilisateur"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spécialité *
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.speciality ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="Médecine générale, Pédiatrie, etc."
              />
            </div>
            {errors.speciality && (
              <p className="text-red-500 text-xs mt-1">{errors.speciality}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent appearance-none bg-white ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
              >
                <option value="DOCTOR">Médecin</option>
                <option value="CHIEF_DOCTOR">Médecin Chef</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {doctor ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="Entrez le mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {doctor && (
              <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver le mot de passe actuel</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {doctor ? 'Confirmer le nouveau mot de passe' : 'Confirmer le mot de passe *'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 pr-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0b9444] focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ color: '#000000' }}
                placeholder="Confirmez le mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7a3a] disabled:opacity-50 transition-colors flex items-center"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? 'Enregistrement...' : doctor ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default DoctorForm;
