/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const LinkButton = ({
  className,
  linkButtonClassName,
  text = "En Savoir Plus",
  to = "/en-savoir-plus",
}) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 6 }}
        whileTap={{ scale: 1.05 }}
        className={`all-[unset] box-border inline-flex items-center justify-center gap-2.5 relative cursor-pointer ${className}`}
      >
        <span
          className={`all-[unset] box-border relative w-fit mt-[-1.00px] text-[#0b9444] font-body font-bold text-[length:var(--body-font-size)] tracking-[var(--body-letter-spacing)] leading-[var(--body-line-height)] whitespace-nowrap [font-style:var(--body-font-style)] ${linkButtonClassName}`}
        >
          {text}
        </span>

        <img
          className="relative w-[12.83px] h-3 mr-[-1.00px]"
          alt="Vector"
          src="/assets/arrow-right.svg"
        />
      </motion.div>
    </Link>
  );
};
