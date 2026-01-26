import React from "react";
import { Youtube, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo-white.png";

const EmployeeFooter = () => {
  return (
    <div
      className="relative bg-cover bg-center flex items-center justify-center py-12 bg-white"
    >
      <motion.footer
        className="relative bg-black/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl w-[95%] md:w-[90%] py-12 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -left-[10%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Left Section */}
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WolfEye+" className="h-8 w-auto brightness-0 invert" />
            <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: "Plus Jakarta Sans" }}>WolfEye+</span>
          </div>
          <p className="text-gray-400 font-medium text-sm max-w-xs leading-relaxed">
            Building the future with excellence. Safety, compliance, and efficiency in one platform.
          </p>
        </div>

        {/* Middle Links */}
        <div className="flex flex-col md:items-center gap-6 mt-10 md:mt-0 relative z-10">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-300 font-medium text-sm">
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
          <p className="text-xs text-gray-500 mt-2 text-center">
            Copyright © 2024 WolfEye+ Inc. | All Rights Reserved
          </p>
        </div>

        {/* Right Side (Social Icons) */}
        <div className="flex gap-4 mt-10 md:mt-0 relative z-10">
          <a
            href="#"
            className="p-3 bg-white/10 border border-white/10 rounded-xl hover:bg-orange-500 hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-md"
          >
            <Youtube size={18} />
          </a>
          <a
            href="#"
            className="p-3 bg-white/10 border border-white/10 rounded-xl hover:bg-orange-500 hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-md"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            className="p-3 bg-white/10 border border-white/10 rounded-xl hover:bg-orange-500 hover:text-white text-gray-300 transition-all duration-300 backdrop-blur-md"
          >
            <Twitter size={18} />
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default EmployeeFooter;
