import React from "react";
import { Youtube, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo-white.png";

const Footer = () => {
  return (
    <div
      className="relative bg-cover bg-center min-h-[300px] flex items-center justify-center py-12"
    >
      <motion.footer
        className="relative bg-black backdrop-blur-sm rounded-[2rem] shadow-lg w-[90%] md:w-[85%] py-10 px-8 flex flex-col md:flex-row justify-between items-start md:items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <p className="text-white font-medium text-sm">
            Building the future with excellence
          </p>
          <div className="flex items-center gap-2">
            <img src={logo} alt="WolfEye+" className="h-7 w-auto" />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col md:items-center gap-4 mt-8 md:mt-0">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white font-medium text-sm">
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">
              About
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">
              Services
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">
              Projects
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">
              Tools & resources
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors duration-300">
              Contact
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Copyright © 2024 WolfEye+ Inc. | All Rights Reserved
          </p>
        </div>

        {/* Right Side Social Icons */}
        <div className="flex gap-3 mt-8 md:mt-0">
          <a
            href="#"
            className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 group"
          >
            <Youtube size={18} className="text-white group-hover:text-white" />
          </a>
          <a
            href="#"
            className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 group"
          >
            <Instagram size={18} className="text-white group-hover:text-white" />
          </a>
          <a
            href="#"
            className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 group"
          >
            <Twitter size={18} className="text-white group-hover:text-white" />
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
