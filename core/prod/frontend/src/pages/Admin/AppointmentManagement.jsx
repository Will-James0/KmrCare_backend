/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "motion/react";
import PropTypes from "prop-types";

const AppointmentManagement = () => {
  const [activeCategory, setActiveCategory] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Données d'exemple des rendez-vous
  const appointments = [
    {
      id: 1,
      patientName: "Jean Dupont",
      patientPhone: "+237 690 123 456",
      dispensaryName: "Dispensaire Central Akwa",
      service: "Consultation générale",
      date: "2025-01-05",
      time: "09:00",
      status: "pending",
      notes: "Première consultation",
      createdAt: "2025-01-03",
      priority: "normal"
    },
    {
      id: 2,
      patientName: "Marie Fotso",
      patientPhone: "+237 691 234 567",
      dispensaryName: "Dispensaire Bonanjo",
      service: "Suivi prénatal",
      date: "2025-01-04",
      time: "14:30",
      status: "accepted",
      notes: "Contrôle mensuel",
      createdAt: "2025-01-02",
      priority: "high"
    },
    {
      id: 3,
      patientName: "Paul Ateba",
      patientPhone: "+237 692 345 678",
      dispensaryName: "Dispensaire Makepe",
      service: "Cardiologie",
      date: "2025-01-03",
      time: "11:00",
      status: "rejected",
      notes: "Rendez-vous annulé par le patient",
      createdAt: "2025-01-01",
      priority: "high"
    },
    {
      id: 4,
      patientName: "Sophie Belinga",
      patientPhone: "+237 694 567 890",
      dispensaryName: "Dispensaire Bonaberi",
      service: "Vaccination",
      date: "2025-01-06",
      time: "10:15",
      status: "pending",
      notes: "Vaccination COVID-19",
      createdAt: "2025-01-03",
      priority: "normal"
    },
    {
      id: 5,
      patientName: "David Mballa",
      patientPhone: "+237 695 678 901",
      dispensaryName: "Dispensaire Deido",
      service: "Urgences",
      date: "2025-01-04",
      time: "08:00",
      status: "accepted",
      notes: "Consultation d&apos;urgence",
      createdAt: "2025-01-03",
      priority: "urgent"
    }
  ];

  const categories = [
    { id: "pending", label: "En attente", count: appointments.filter(a => a.status === "pending").length, color: "bg-yellow-500" },
    { id: "accepted", label: "Acceptés", count: appointments.filter(a => a.status === "accepted").length, color: "bg-green-500" },
    { id: "rejected", label: "Rejetés", count: appointments.filter(a => a.status === "rejected").length, color: "bg-red-500" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'normal': return 'Normale';
      default: return priority;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesCategory = appointment.status === activeCategory;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || appointment.date === filterDate;
    return matchesCategory && matchesSearch && matchesDate;
  });

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#159eec] rounded-full flex items-center justify-center text-white font-medium">
            {appointment.patientName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-500">{appointment.patientPhone}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${getPriorityColor(appointment.priority)}`} />
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-sm text-gray-500">Dispensaire:</span>
            <p className="font-medium text-gray-900">{appointment.dispensaryName}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Service:</span>
            <p className="font-medium text-gray-900">{appointment.service}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <span className="text-sm text-gray-500">Date:</span>
            <p className="font-medium text-gray-900">
              {new Date(appointment.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Heure:</span>
            <p className="font-medium text-gray-900">{appointment.time}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Priorité:</span>
            <p className="font-medium text-gray-900">{getPriorityLabel(appointment.priority)}</p>
          </div>
        </div>

        {appointment.notes && (
          <div>
            <span className="text-sm text-gray-500">Notes:</span>
            <p className="text-sm text-gray-700 mt-1">{appointment.notes}</p>
          </div>
        )}
      </div>

      {appointment.status === 'pending' && (
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 px-3 py-2 bg-[#0b9444] text-white rounded-lg hover:bg-[#0a7c3a] transition-colors text-sm font-medium">
            Accepter
          </button>
          <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
            Rejeter
          </button>
        </div>
      )}

      {appointment.status !== 'pending' && (
        <div className="mt-4">
          <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Voir détails
          </button>
        </div>
      )}
    </motion.div>
  );

  // Validation des props pour AppointmentCard
  AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
      patientName: PropTypes.string.isRequired,
      patientPhone: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      dispensaryName: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      notes: PropTypes.string,
    }).isRequired,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Rendez-vous</h2>
        <p className="text-gray-600">Gérez tous les rendez-vous de la plateforme</p>
      </div>

      {/* Categories Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              activeCategory === category.id
                ? 'border-[#159eec] bg-[#159eec] text-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold">{category.label}</h3>
                <p className={`text-2xl font-bold ${
                  activeCategory === category.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.count}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                activeCategory === category.id ? 'bg-white' : category.color
              }`} />
            </div>
          </motion.button>
        ))}
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
              placeholder="Patient, dispensaire ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-secondary rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-secondary rounded-lg focus:ring-2 focus:ring-[#159eec] focus:border-[#159eec] transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilterDate("");
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun rendez-vous trouvé
            </h3>
            <p className="text-gray-500">
              Il n&apos;y a aucun rendez-vous dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
