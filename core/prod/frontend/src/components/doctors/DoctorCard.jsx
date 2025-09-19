/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

const DoctorCard = ({ doctor, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      {/* En-tête du médecin */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[#0f425d] rounded-full flex items-center justify-center text-white font-bold mr-4">
          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#0f425d]">
            Dr. {doctor.first_name} {doctor.last_name}
          </h3>
          <p className="text-sm text-gray-600">{doctor.speciality}</p>
        </div>
      </div>

      {/* Informations de contact */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {doctor.email}
        </div>
        {doctor.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {doctor.phone}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onView(doctor)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Voir
        </button>
        <button
          onClick={() => onEdit(doctor)}
          className="flex-1 px-3 py-2 text-sm bg-[#0b9444] text-white rounded-md hover:bg-[#0a7a3a]"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(doctor)}
          className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
