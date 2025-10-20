import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import wolfMascot from "../assets/images/wolf-intro.png";
import logo from "../assets/images/Logo-Elitebuilders.png";
import gradientBg from "../assets/images/home-gradient-effect.png";
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get company authentication token
  const getCompanyAuthToken = () => {
    return localStorage.getItem('face_verification_company_token') ||
           localStorage.getItem('company_token');
  };

  const getCompanyId = () => {
    return localStorage.getItem('face_verification_company_id');
  };

  const navigateWithToken = (path) => {
    const companyToken = getCompanyAuthToken();
    const companyId = getCompanyId();

    if (companyToken) {
      localStorage.setItem('company_token', companyToken);
      localStorage.setItem('face_verification_company_token', companyToken);
    }
    if (companyId) {
      localStorage.setItem('face_verification_company_id', companyId);
    }

    console.log("Navigating to", path, "with company token:", companyToken ? "Present" : "Missing");
    console.log("Tokens set in localStorage:", {
      company_token: localStorage.getItem('company_token') ? 'Present' : 'Missing',
      face_verification_company_token: localStorage.getItem('face_verification_company_token') ? 'Present' : 'Missing',
      company_id: localStorage.getItem('face_verification_company_id') ? 'Present' : 'Missing'
    });
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const companyToken = getCompanyAuthToken();
    const companyId = getCompanyId();

    if (companyToken && companyId) {
      console.log("Company user authenticated on homepage");
      console.log("Current tokens:", {
        company_token: localStorage.getItem('company_token'),
        face_verification_company_token: localStorage.getItem('face_verification_company_token'),
        company_id: localStorage.getItem('face_verification_company_id')
      });
    } else {
      console.log("No company authentication found on homepage");
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 lg:px-0 py-12 overflow-hidden">
      {/* Gradient Image Background */}
      <img
        src={gradientBg}
        alt="Gradient Background"
        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full flex items-center justify-between py-4 mb-6 relative z-20"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="WolfEye+ Logo" className="h-7 w-auto" />
        </div>

        {/* Right Section (Nav and Profile) */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-8 relative">
            <a href="#home" className="text-gray-900 font-semibold">
              Home
            </a>
            <a
              href="#about"
              className="text-gray-500 hover:text-gray-800 transition"
            >
              About
            </a>
            <a
              href="#how"
              className="text-gray-500 hover:text-gray-800 transition"
            >
              How it Works
            </a>

            {/*  Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-500 hover:text-gray-800 flex items-center gap-1 transition cursor-pointer"
              >
                Services
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    isServicesOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-10 right-0 bg-white border border-gray-100 shadow-xl rounded-3xl p-10 flex flex-col md:flex-row gap-10 z-50"
                    style={{
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      width: "500px",
                    }}
                  >
                    {/* Left Column */}
                    <div className="flex flex-col gap-8">
                      <div
                        onClick={() => navigateWithToken('/facewebcam')}
                        className="block cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2 text-left">
                            Webcam Detection{" "}
                            <ArrowRight className="text-blue-600 w-4 h-4" />
                          </h4>
                          <p className="text-gray-500 text-sm mt-1 text-left">
                            AI checks safety gear instantly.
                          </p>
                        </div>
                      </div>
                      <div
                          onClick={() => navigateWithToken('/add')}
                          className="hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                        <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          Enroll Employee{" "}
                          <ArrowRight className="text-blue-600 w-4 h-4" />
                        </h4>
                        <p className="text-gray-500 text-sm mt-1 text-left">
                          Add your workers & detect safety.
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">
                      <div
                        onClick={() => navigateWithToken('/company/dashboard')}
                        className="hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          Dashboard{" "}
                          <ArrowRight className="text-blue-600 w-4 h-4" />
                        </h4>
                        <p className="text-gray-500 text-sm mt-1 text-left">
                          View attendance & performance.
                        </p>
                      </div>
                    </div>

                    {/* Pointer Triangle */}
                    <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Profile Icon */}
          <div className="flex items-center justify-center w-9 h-9 bg-gray-300 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 h-5 text-white"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
              <path d="M14 14s-1-1.5-6-1.5S2 14 2 14s1-3 6-3 6 3 6 3z" />
            </svg>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl z-10">
        {/* Left Side (Text + Stats) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left"
        >
          <h1
            className="text-6xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            WolfEye+ <br /> Protect Every Worker
          </h1>
          <p
            className="text-gray-600 leading-relaxed mb-8 max-w-250"
            style={{ fontFamily: "Inter" }}
          >
            AI-powered detection ensures every worker wears the required safety
            gear before starting work. Track attendance, monitor compliance, and
            reward disciplined behavior through a simple webcam and intuitive
            dashboard.
          </p>

          {/* Try Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateWithToken('/facewebcam')}
            className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all mb-10 shadow-md"
          >
            Try WolfEye+
            <ArrowUpRight size={18} />
          </motion.button>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-3 gap-7 mt-9 text-center max-w-md"
          >
            <div>
              <p className="text-5xl font-bold text-gray-900">25+</p>
              <p className="text-gray-500 mt-1 text-sm">Sites Monitored</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-900">500+</p>
              <p className="text-gray-500 mt-1 text-sm">Workers Protected</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-900">98%</p>
              <p className="text-gray-500 mt-1 text-sm">Compliance Rate</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mascot Section */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative mt-9 lg:mt-0 flex justify-center items-center -ml-0"
        >
          {/* Orange Box */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            className="absolute top-8 left-8 bg-orange-500 text-white text-sm font-semibold px-5 py-6 rounded-xl shadow-lg text-left leading-tight ml-30"
          >
            See
            <br />
            Beyond with
            <br />
            <span className="text-2xl">WolfEye+</span>
          </motion.div>

          {/* Mascot Image */}
          <motion.img
            src={wolfMascot}
            alt="Wolf Mascot"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="w-72 md:w-96 object-contain relative z-10 ml-50"
          />

          {/* Floating arrow Button */}
          <motion.div
            whileHover={{ rotate: 45, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigateWithToken('/facewebcam')}
            className="absolute bottom-0 right-0 bg-black text-white p-6 rounded-2xl shadow-lg flex items-center justify-center z-20 ml-90 cursor-pointer"
          >
            <ArrowUpRight size={40} />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}