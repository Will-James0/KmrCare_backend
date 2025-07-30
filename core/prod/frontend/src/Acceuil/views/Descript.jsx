import { motion } from "motion/react";

const Descript = () => {
   return(
    <div className="w-full py-12 md:py-20 lg:py-24 bg-sky-50/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 p-4 sm:p-6 md:p-8 bg-gray-100 rounded-lg shadow-lg">
              {/* Courtes descriptions avec étapes */}
            <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity:1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:w-1/2 xl:flex-grow w-full p-4 md:p-6 bg-white rounded-md shadow">
                <h3 className="font-title font-bold text-xl md:text-2xl text-secondary mb-4 md:mb-6 flex items-center">
                    🚀 Comment Prendre Rendez-vous ?
                </h3>

                <div className="space-y-4 text-sm md:text-base text-gray-900 font-semibold leading-relaxed">
                    <motion.div 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="relative p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow border-l-4 border-[#0b9444] overflow-hidden group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🗺️</span>
                            <div>
                                <h4 className="font-bold text-[#0b9444] mb-1">Étape 1: Localiser</h4>
                                <p className="text-gray-700">
                                    Trouvez les dispensaires proches de chez vous via notre Catalogue.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="relative p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow border-l-4 border-[#0f425d] overflow-hidden group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📅</span>
                            <div>
                                <h4 className="font-bold text-[#0f425d] mb-1">Étape 2: Réserver</h4>
                                <p className="text-gray-700">
                                    Choisissez votre créneau et prenez rendez-vous depuis votre PC ou mobile.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="relative p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow border-l-4 border-primary overflow-hidden group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <h4 className="font-bold text-primary mb-1">Étape 3: Gérer</h4>
                                <p className="text-gray-700">
                                    Modifiez, confirmez ou annulez votre RDV à tout moment.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bonus tip */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">💡</span>
                            <p className="text-sm text-yellow-800 font-medium">
                                <strong>Astuce:</strong> Recevez des rappels automatiques par email !
                            </p>
                        </div>
                    </motion.div>                </div>
            </motion.div>

            {/* Icons améliorés */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="lg:w-1/4 xl:w-1/3 w-full justify-center items-center hidden md:flex flex-col gap-8"
            >

                <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="relative overflow-hidden text-center"
                >
                    <div className="medical-icon mb-2 mx-auto">
                        <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-[#0f425d] font-bold">Multi-plateforme</p>
                    <motion.img
                        whileHover={{ scale: 0.8 }}
                        className="w-40 h-20 mx-auto mt-2 opacity-60"
                        src="/assets/phone-pc.png"
                        alt="Adaptabilité"
                    />
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative overflow-hidden text-center"
                >
                    <div className="medical-icon mb-2 mx-auto">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-[#0f425d] font-bold">Instantané</p>
                    <motion.img
                        whileHover={{ scale: 0.7 }}
                        className="w-20 h-20 mx-auto mt-2 opacity-60"
                        src="/assets/instant.png"
                        alt="Instantané"
                    />
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="relative overflow-hidden text-center"
                >
                    <div className="medical-icon mb-2 mx-auto">
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-[#0f425d] font-bold">Validation</p>
                    <motion.img
                        whileHover={{ scale: 0.7 }}
                        className="w-20 h-20 mx-auto mt-2 opacity-60"
                        src="/assets/puce.png"
                        alt="Validation"
                    />
                </motion.div>
            </motion.div>

        </div>
    </div>
   );
};

export default Descript;