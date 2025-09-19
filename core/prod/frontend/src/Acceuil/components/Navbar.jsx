import { useState } from "react";                                                                                                                                                                                                                                                                                                                              
import { motion } from "motion/react";
function Navigation() {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <a className="nav-link" href="#">
          Acceuil
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#">
          A Propos
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#">
          Dispensaires
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#">
          Contact
        </a>
      </li>
      <li>
        <button className="btn" href="#">
          Prendre un Rendez-vous
        </button>
      </li>
      <li>
        <button className="btn" href="#">
          Se Connecter
        </button>
      </li>
    </ul>
  );
}
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="inset-x-0 z-20 w-full p-3 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-0">
          <img
            alt="Logo"
            src="https://c.animaapp.com/mbfwxdap4GBqLX/img/logo-dispensaire-plan-de-travail-1-copie-2-3-1.png"
            className="w-40 h-30 cursor-pointer"
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer bg-primary text-white hover:text-[#10425d] focus:outline-none sm:hidden"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6"
              alt="toggle"
            />
          </button>
          <nav className="hidden font-bold sm:flex">
            <Navigation />
          </nav>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          <nav className="pb-5 font-bold">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
