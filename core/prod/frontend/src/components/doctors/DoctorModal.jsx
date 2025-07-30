/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DoctorModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`bg-white rounded-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto shadow-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête du modal */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-[#0f425d]">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
          
          {/* Contenu du modal */}
          <div className={title ? 'p-6' : 'p-6'}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DoctorModal;
