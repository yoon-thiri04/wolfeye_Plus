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
          <div className="flex flex-wrap justify-center gap-10 text-white font-medium text-sm">
            <a href="#" className="hover:underline transition">
              About
            </a>
            <a href="#" className="hover:underline transition">
              Services
            </a>
            <a href="#" className="hover:underline transition">
              Projects
            </a>
            <a href="#" className="hover:underline transition">
              Tools & resources
            </a>
            <a href="#" className="hover:underline transition">
              Contact
            </a>
          </div>
          <p className="text-xs text-white mt-2">
            Copyright © 2024 WolfEye+ Inc. | All Rights Reserved
          </p>
        </div>

        {/* Right Side Social Icons */}
        <div className="flex gap-3 mt-8 md:mt-0">
          <a
            href="#"
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <Youtube size={16} className="text-black" />
          </a>
          <a
            href="#"
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <Instagram size={16} className="text-black" />
          </a>
          <a
            href="#"
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <Twitter size={16} className="text-black" />
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;
