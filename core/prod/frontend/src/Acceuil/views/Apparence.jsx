/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Apparence = ({
  property1,
  className,
}) => {
  // Images for different variants
  const defaultImages = [
    "https://c.animaapp.com/mbfwxdap4GBqLX/img/physician-trends-2021-merritt-hawkins-1-1.png",
    "https://c.animaapp.com/mbfwxdap4GBqLX/img/physician-trends-2021-merritt-hawkins-2-1.png"
  ];

  const variant2Images = [
    "https://c.animaapp.com/mbfwxdap4GBqLX/img/docteur-junior.png"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImages = property1 === "variant-2" ? variant2Images : defaultImages;

  // Auto-cycle through images continuously every 4 seconds
  useEffect(() => {
    if (currentImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % currentImages.length
        );
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [currentImages.length]);

  return (
    <div className={`w-full min-h-[500px] md:min-h-[600px] lg:min-h-[560px] ${className}`}>
      <div
        className={`${property1 === "variant-2" ? "top-1" : ""} ${property1 === "variant-2" ? "min-h-[500px] md:min-h-[600px] lg:min-h-[560px]" : "min-h-[550px] md:min-h-[650px] lg:min-h-[560px]"} ${property1 === "variant-2" ? "relative" : ""}`}
      >
        <div
          className={`w-full relative ${property1 === "variant-2" ? "min-h-[500px] md:min-h-[600px] lg:min-h-[560px]" : "min-h-[550px] md:min-h-[650px] lg:min-h-[560px]"}`}
        >
          {/* Background color layer */}
          <div
            className={`w-full left-0 rotate-180 h-[560px] bg-[#02ddcd] absolute ${property1 === "default" ? "top-1" : "top-0"} -z-10`}
          />

          {/* Animated background images */}
          <div className={`absolute inset-0 ${property1 === "default" ? "top-1" : "top-0"} overflow-hidden`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`absolute inset-0 ${property1 === "default" ? "h-[600px]" : "h-full md:h-[560px]"} bg-cover bg-center bg-no-repeat z-0`}
                style={{
                  backgroundImage: `url(${currentImages[currentImageIndex]})`
                }}
              />
            </AnimatePresence>
          </div>

          {/* Gradient overlay */}
          <div
            className={`[background:linear-gradient(259deg,rgba(229,228,232,1)_9%,rgba(235,234,239,0)_100%)] w-full left-0 rotate-180 h-[560px] absolute ${property1 === "default" ? "top-1" : "top-0"} z-5`}
          />

          {/* Content container */}
          <div
            className={`w-full left-0 h-[560px] overflow-hidden absolute ${property1 === "default" ? "top-1" : "top-0"} flex items-center`}
          >

            {/* Container for text content and decorative circle */}
            <div className="relative w-full h-full flex items-center justify-center lg:justify-start px-4 sm:px-8">
              {/* Decorative circle - hidden on small screens, adjusted for larger */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`hidden top-[140px] left-[1238px] lg:block w-[500px] h-[500px] xl:w-[734px] xl:h-[734px] opacity-50 rounded-full absolute transform -translate-x-1/2 z-20 ${property1 === "default" ? "bg-[#0b9444]" : "bg-[#0f425d]"}`}
              />

              {/* Text content block */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.9,
                  delay: 0.3
                }}
                className="relative z-30 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl lg:ml-[5%] xl:ml-[10%] text-center lg:text-left"
              >
                <div className="flex flex-col items-center lg:items-start space-y-4 md:space-y-6 py-8">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="[font-family:'Work_Sans',Helvetica] w-full tracking-[2.88px] text-lg md:text-xl text-[#0b9444] font-bold leading-[normal]"
                  >
                    UN RENDEZ-VOUS, UNE SOLUTION
                  </motion.div>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="[font-family:'Yeseva_One',Helvetica] w-full text-2xl sm:text-3xl md:text-4xl lg:text-[38px] text-[#0f425d] font-normal leading-[normal]"
                  >
                    Votre santé, simplifiée. Prenez rendez-vous dans les
                    dispensaires de Douala en un instant.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4 w-full mt-6"
                  >
                    <a href="#disp">
                      <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-[#0b9444] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0a7c3a] transition-all duration-300 text-center"
                    >
                      🏥 Trouver un Dispensaire
                    </motion.button>
                    </a>
                  </motion.div>

                  {/* Stats rapides */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="flex flex-wrap gap-6 mt-8 w-full"
                  >
                    <div className="flex items-center space-x-2 text-[#0f425d]">
                      <span className="text-2xl font-bold">50+</span>
                      <span className="text-sm">Dispensaires</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#0f425d]">
                      <span className="text-2xl font-bold">1000+</span>
                      <span className="text-sm">RDV par mois</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#0f425d]">
                      <span className="text-2xl font-bold">24/7</span>
                      <span className="text-sm">Disponibilité</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Decorative background circle */}
            <motion.div
              initial={{ scale: 0, x: -200 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ 
                duration: 1.8, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className={`w-[734px] left-[-387px] opacity-30 h-[734px] rounded-[367px] bg-[#0b9444] absolute z-15 ${property1 === "variant-2" ? "top-[-369px]" : "top-[-599px]"}`}
            />
          </div>

          {/* Image navigation dots for all variants */}
          {currentImages.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-3"
            >
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-[#0b9444] scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Voir image ${index + 1}`}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
