/* eslint-disable no-unused-vars */
import React from "react";
import { LinkButton } from "../components/LinkButton";
import { motion } from "motion/react";

const Grouper = () => {
  return (
    <div className="w-full py-12 md:py-20 lg:py-24 h-120 bg-gray-50/50" id="apropos">
      <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto my-12 md:my-24 px-4 text-center">
        <div className="mb-6 md:mb-8">
          <div className="font-caption font-bold text-[#0b9444] text-sm md:text-base tracking-wider uppercase mb-2">
            BIENVENUE SUR KMRCARE
          </div>
          <p className="font-display-2 font-semibold text-[#0f425d] text-2xl sm:text-3xl md:text-4xl leading-tight">
            Prenez Rendez-vous Dans Un Dispensaire En Un Clic.
          </p>
        </div>

        <p className="font-body text-black text-sm md:text-base leading-relaxed mb-8 md:mb-10">
          Vous Voulez Des Soins rapides? Les Hopitaux Sont Trop Loin? Trop Chers?
          Vous Voulez Prendre Rendez Vous Depuis Chez Vous? Vous Êtes Au Bon Endroit! 
        </p>
        <LinkButton/>
        
        <div className="bg-gradient-to-r from-transparent via-secondary to-transparent h-[1px] w-full"/>
      </motion.div>
    </div>
  );
};

export default Grouper;
