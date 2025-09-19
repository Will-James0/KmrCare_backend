// EndAppointmentForm.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ClipboardEdit } from 'lucide-react';

const EndAppointmentForm = ({ appointment, onSubmit, onCancel, loading = false }) => {
  const [observation, setObservation] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!observation.trim()) {
      setError('L\'observation est requise.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ observation });
    setObservation('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5"
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-[#0f425d] rounded-full flex items-center justify-center text-white mx-auto mb-3">
            <ClipboardEdit className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#0f425d]">Observation du rendez-vous</h2>
          <p className="text-sm text-gray-500 mt-1">
            Confirmez la fin du rendez-vous et ajoutez une observation
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observation *</label>
          <textarea
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#0b9444] focus:border-transparent text-black ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            rows="5"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Saisir ici l'observation du médecin"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7a3a] flex items-center disabled:opacity-50"
            disabled={loading}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? 'Envoi...' : 'Terminer'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EndAppointmentForm;
