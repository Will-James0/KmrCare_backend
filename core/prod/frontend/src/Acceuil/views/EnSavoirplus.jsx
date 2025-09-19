/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const EnSavoirPlus = () => {
  // Remettre la scrollbar en haut lors du montage du composant
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-green-50/50">
      {/* Navbar simple pour la navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img
                alt="Logo KmrCare"
                src="/assets/logo.png"
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-lg sm:text-xl font-bold text-[#0f425d] hidden sm:block">KmrCare</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-[#0f425d] hover:text-white hover:bg-[#0f425d] rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <span>←</span>
                <span className="hidden sm:inline">🏠 Retour à l&apos;accueil</span>
                <span className="sm:hidden">🏠</span>
              </Link>
              <span className="text-[#0b9444] font-semibold text-sm sm:text-base">
                <span className="hidden sm:inline">ℹ️ En Savoir Plus</span>
                <span className="sm:hidden">ℹ️ Info</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Hero */}
      <div className="bg-gradient-to-r from-[#0f425d] to-[#0b9444] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              🏥 Qu&apos;est-ce que KmrCare ?
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Votre plateforme digitale pour simplifier l&apos;accès aux soins médicaux à Douala. 
              Prenez rendez-vous dans les dispensaires partenaires en quelques clics !
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Utilité */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f425d] mb-4">
                🎯 Notre Mission
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                KmrCare révolutionne l&apos;accès aux soins de santé à Douala en connectant les patients 
                aux dispensaires locaux grâce à une plateforme numérique moderne et intuitive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100"
              >
                <div className="w-16 h-16 bg-[#0f425d] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏥</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0f425d] mb-2">Accessibilité</h3>
                <p className="text-gray-600">
                  Trouvez rapidement un dispensaire proche de chez vous parmi nos 12+ partenaires.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100"
              >
                <div className="w-16 h-16 bg-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0b9444] mb-2">Rapidité</h3>
                <p className="text-gray-600">
                  Réservez votre rendez-vous en moins de 2 minutes, 24h/24 et 7j/7.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100"
              >
                <div className="w-16 h-16 bg-[#a5c2f7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-[#0f425d] mb-2">Sécurité</h3>
                <p className="text-gray-600">
                  Vos données médicales sont protégées et sécurisées selon les normes internationales.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section Avantages */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f425d] text-center mb-12">
              ✨ Pourquoi Choisir KmrCare ?
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Fini les Files d&apos;Attente</h3>
                    <p className="text-gray-600">
                      Plus besoin de faire la queue dès l&apos;aube. Réservez votre créneau depuis chez vous.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Transparence des Prix</h3>
                    <p className="text-gray-600">
                      Consultez les tarifs avant votre visite. Aucune surprise à l&apos;arrivée.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Choix du Praticien</h3>
                    <p className="text-gray-600">
                      Sélectionnez le médecin de votre choix selon sa spécialité et sa disponibilité.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Rappels Automatiques</h3>
                    <p className="text-gray-600">
                      Recevez des notifications SMS pour ne jamais oublier vos rendez-vous.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Suivi Médical</h3>
                    <p className="text-gray-600">
                      Gardez un historique de vos consultations et prescriptions en ligne.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#0b9444] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f425d] mb-2">Support 24/7</h3>
                    <p className="text-gray-600">
                      Notre équipe support est disponible pour vous accompagner à tout moment.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Fonctionnement */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f425d] text-center mb-12">
              🚀 Comment Ça Marche ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0f425d] to-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f425d] mb-3">1. Recherchez</h3>
                <p className="text-gray-600 text-sm">
                  Trouvez le dispensaire le plus proche de chez vous grâce à notre catalogue.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0f425d] to-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f425d] mb-3">2. Réservez</h3>
                <p className="text-gray-600 text-sm">
                  Choisissez votre créneau parmi les disponibilités en temps réel du dispensaire.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0f425d] to-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f425d] mb-3">3. Confirmez</h3>
                <p className="text-gray-600 text-sm">
                  Recevez une confirmation instantanée par Mail avec tous les détails de votre RDV.
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#0f425d] to-[#0b9444] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🏥</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0f425d] mb-3">4. Consultez</h3>
                <p className="text-gray-600 text-sm">
                  Présentez-vous à l&apos;heure prévue, votre dossier est déjà prêt !
                </p>
              </motion.div>
            </div>

            {/* Flèches de connexion pour desktop */}
            <div className="hidden md:flex justify-center items-center mt-8 space-x-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0b9444] to-transparent opacity-50"></div>
              <span className="text-[#0b9444] text-xl">→</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0b9444] to-transparent opacity-50"></div>
              <span className="text-[#0b9444] text-xl">→</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0b9444] to-transparent opacity-50"></div>
            </div>
          </div>
        </motion.div>

        {/* Section Statistiques */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#0f425d] to-[#0b9444] rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              📊 KmrCare en Chiffres
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">12+</div>
                <div className="text-white/80 text-sm md:text-base">Dispensaires Partenaires</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                <div className="text-white/80 text-sm md:text-base">Médecins Disponibles</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/80 text-sm md:text-base">Patients Satisfaits</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-white/80 text-sm md:text-base">Service Disponible</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section Call to Action */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f425d] mb-6">
              🎉 Prêt à Commencer ?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez dès maintenant les milliers d&apos;utilisateurs qui ont choisi KmrCare 
              pour simplifier leur accès aux soins de santé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0b9444] text-white font-semibold rounded-xl hover:bg-[#0a7c3a] transition-all duration-200 hover:scale-105"
              >
                🏥 Voir les Dispensaires
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnSavoirPlus;