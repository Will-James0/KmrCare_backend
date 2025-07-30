/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import UserManagement from "./UserManagement";
import AppointmentManagement from "./AppointmentManagement";
import DispensariesManagement from "./DispensariesManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Données statistiques
  const stats = [
    {
      title: "Utilisateurs Total",
      value: "1,245",
      change: "+12%",
      icon: "👥",
      color: "bg-blue-500"
    },
    {
      title: "Rendez-vous Aujourd&apos;hui",
      value: "89",
      change: "+5%",
      icon: "📅",
      color: "bg-green-500"
    },
    {
      title: "Dispensaires Actifs",
      value: "23",
      change: "+2",
      icon: "🏥",
      color: "bg-purple-500"
    },
    {
      title: "Revenus Mensuel",
      value: "125,000 FCFA",
      change: "+8%",
      icon: "💰",
      color: "bg-yellow-500"
    }
  ];

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: '👥' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
    { id: 'dispensaries', label: 'Dispensaires', icon: '🏥' }
  ];

  const StatCard = ({ stat }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          <p className="text-sm mt-2">
            <span className="text-green-600 font-medium">{stat.change}</span>
            <span className="text-gray-500 ml-1">ce mois</span>
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl`}>
          {stat.icon}
        </div>
      </div>
    </motion.div>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/assets/logo.png" alt="KmrCare" className="h-8 w-auto" />
          <span className="text-xl font-bold text-[#0f425d]">Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 mb-2 ${
              activeTab === tab.id
                ? 'bg-[#159eec] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-3 right-3">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="text-lg">🏠</span>
          <span className="font-medium">Retour Accueil</span>
        </Link>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Tableau de Bord Administrateur
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-500">Connecté en tant que</p>
            <p className="font-medium text-gray-800">Administrateur</p>
          </div>
          <div className="w-10 h-10 bg-[#0f425d] rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'dispensaries':
        return <DispensariesManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <TopBar />
        
        {/* Dashboard Stats - Only on users tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>
        )}
        
        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
