import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Menu, X } from "lucide-react";
import wolfMascot from "../assets/images/wolf-intro.png";
import logo from "../assets/images/Logo-Elitebuilders.png";
import gradientBg from "../assets/images/home-gradient-effect.png";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function LandingHomepage() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 lg:px-0 py-12 overflow-hidden">
        {/*<Navbar />*/}
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
        className={`fixed top-0 left-0 right-0 w-full flex items-center justify-between py-4 px-6 lg:px-12 z-50 transition-all duration-300 ${
            isScrolled 
              ? "bg-white/80 backdrop-blur-md shadow-sm" 
              : "bg-transparent"
          }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="WolfEye+ Logo" className="h-7 w-auto" />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav + Profile */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 relative">
            <a href="#home" className="text-gray-900 font-semibold hover:text-orange-600 transition-colors">
              Home
            </a>
            <a
              href="#about"
              className="text-gray-500 hover:text-orange-600 transition-colors"
            >
              About
            </a>
            <a
              href="#how"
              className="text-gray-500 hover:text-orange-600 transition-colors"
            >
              How it Works
            </a>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
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
                    className="absolute top-12 right-0 bg-white border border-gray-100 shadow-xl rounded-2xl p-6 flex flex-col gap-4 z-50 w-72"
                  >
                      <Link to='/company/login' className="block group">
                          <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                          Webcam Detection{" "}
                          <ArrowRight className="text-orange-600 w-4 h-4" />
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 text-left">
                          AI checks safety gear instantly.
                        </p>
                      </div>
                      </Link>
                      <Link to='/company/login' className="block group">
                          <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                          Instant Alerts{" "}
                          <ArrowRight className="text-orange-600 w-4 h-4" />
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 text-left">
                          Notify non-compliance in real time.
                        </p>
                      </div>
                      </Link>
                      <Link to="/company/login" className="block group">
                          <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                          Dashboard{" "}
                          <ArrowRight className="text-orange-600 w-4 h-4" />
                        </h4>
                        <p className="text-gray-500 text-xs mt-1 text-left">
                          View attendance & performance.
                        </p>
                      </div>
                      </Link>

                    {/* Pointer Triangle */}
                    <div className="absolute -top-2 right-10 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Employee Login Button */}
          <Link 
            to="/employee/login"
            className="hidden lg:flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
          >
            Employee Portal
          </Link>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-white shadow-lg z-50 px-6 py-8 border-b mb-6"
          >
            <nav className="flex flex-col gap-6 text-center">
              <a href="#home" className="text-gray-900 font-semibold text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </a>
              <a href="#about" className="text-gray-500 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </a>
              <a href="#how" className="text-gray-500 text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                How it Works
              </a>
              <div className="flex flex-col gap-4 mt-4">
                  <p className="text-gray-400 text-sm uppercase tracking-wider">Services</p>
                  <Link to='/company/login' className="text-gray-800 font-medium">Webcam Detection</Link>
                  <Link to='/company/login' className="text-gray-800 font-medium">Instant Alerts</Link>
                  <Link to='/company/login' className="text-gray-800 font-medium">Dashboard</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl z-10 px-4 md:px-0">
        {/* Left Side (Text + Stats) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-left w-full"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            WolfEye+ <br /> Protect Every Worker
          </h1>
          <p
            className="text-gray-600 leading-relaxed mb-8 max-w-2xl"
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
            className="grid grid-cols-1 sm:grid-cols-3 gap-7 mt-9 text-center max-w-md w-full"
          >
            <div>
              <p className="text-4xl md:text-5xl font-bold text-gray-900">25+</p>
              <p className="text-gray-500 mt-1 text-sm">Sites Monitored</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-gray-900">500+</p>
              <p className="text-gray-500 mt-1 text-sm">Workers Protected</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-gray-900">98%</p>
              <p className="text-gray-500 mt-1 text-sm">Compliance Rate</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mascot Section */}
        <div className="flex-1 relative mt-16 lg:mt-0 flex justify-center items-center w-full">
          {/* Orange Info Box */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 lg:-left-10 bg-orange-500 text-white text-sm font-semibold px-5 py-6 rounded-xl shadow-lg text-left leading-tight z-20"
          >
            See
            <br />
            Beyond with
            <br />
            <span className="text-2xl">WolfEye+</span>
          </motion.div>

          {/* Placeholder for removed image or just a decorative element */}
          <div className="w-full max-w-xs md:max-w-md h-64 md:h-80 flex items-center justify-center">
             {/* You can add a different image here or leave it empty/styled */}
          </div>

          {/* Floating Button */}
          <motion.div
            whileHover={{ rotate: 45, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute bottom-0 right-0 lg:right-10 bg-black text-white p-6 rounded-2xl shadow-lg flex items-center justify-center z-20 cursor-pointer"
          >
            <ArrowUpRight size={40} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
