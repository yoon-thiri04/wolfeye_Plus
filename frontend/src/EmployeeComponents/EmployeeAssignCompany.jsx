import React from "react";
import { MapPin, User, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import wolflying from "../assets/images/wolf-lying.png";
import snowflake from "../assets/images/snowflake-effect.png";

const EmployeeAssignCompany = () => {
  return (
    <section className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6 md:px-12 relative overflow-hidden">

      {/* Background image */}
      <img
        src={snowflake}
        alt="background"
        className="absolute inset-0 m-auto w-[799px] h-[841px] object-contain opacity-20 pointer-events-none z-0 mt-50"
      />

      {/* Wolf mascot */}
      <motion.div
        className="mb-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <img
          src={wolflying}
          alt="Wolf mascot"
          className="w-100 h-100 object-contain"
        />
      </motion.div>

      {/* Title and subtitle */}
      <motion.div
        className="text-center mb-12 max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Assigned Company
        </h2>
        <p className="text-gray-600 text-base leading-relaxed">
          You’re part of the{" "}
          <span className="text-orange-500 font-medium">
            Yangon Central Project Team
          </span>
          , working to maintain safety, performance, and attendance through
          WolfEye+. Stay consistent, earn points, and help build a safer,
          smarter construction environment.
        </p>
      </motion.div>

      {/* Info cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl px-4 md:px-0 text-left relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {/* Location */}
        <div className="flex flex-col p-5 rounded-xl border-2 border-l-9 border-[#4DDFFD] bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#7AE7FD] p-2 rounded-lg inline-flex items-center justify-center">
              <MapPin className="w-5 h-5" stroke="white" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm">Location</h4>
          </div>
          <p className="text-gray-900 font-semibold text-lg">Yangon</p>
          <p className="text-gray-500 text-sm mt-1">Downtown District, Site A3</p>
        </div>

        {/* Supervisor */}
        <div className="flex flex-col p-5 rounded-xl border-2 border-l-9 border-[#F9773B] bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#F9773B] p-2 rounded-lg inline-flex items-center justify-center">
              <User className="w-5 h-5" stroke="white" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm">Supervisor</h4>
          </div>
          <p className="text-gray-900 font-semibold text-lg">Michael Chen</p>
          <p className="text-gray-500 text-sm mt-1">Site Manager</p>
        </div>

        {/* Duration */}
        <div className="flex flex-col p-5 rounded-xl border-2 border-l-9 border-[#9672FF] bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#9672FF] p-2 rounded-lg inline-flex items-center justify-center">
              <Clock className="w-5 h-5" stroke="white" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm">Duration</h4>
          </div>
          <p className="text-gray-900 font-semibold text-lg">6 Months</p>
          <p className="text-gray-500 text-sm mt-1">Jan 2025 – Jun 2025</p>
        </div>

        {/* Active */}
        <div className="flex flex-col p-5 rounded-xl border-2 border-l-9 border-[#FFA414] bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#FFA414] p-2 rounded-lg inline-flex items-center justify-center">
              <Eye className="w-5 h-5" stroke="white" />
            </div>
            <h4 className="font-medium text-gray-800 text-sm">Active</h4>
          </div>
          <p className="text-gray-900 font-semibold text-lg">WolfEye+ Stats</p>
          <p className="text-gray-500 text-sm mt-1">connected</p>
        </div>
      </motion.div>
    </section>
  );
};

export default EmployeeAssignCompany;
