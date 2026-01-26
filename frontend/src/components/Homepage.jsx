import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Menu, X, User } from "lucide-react";
import wolfMascot from "../assets/images/wolf-intro.png";
import logo from "../assets/images/Logo-Elitebuilders.png";
import gradientBg from "../assets/images/home-gradient-effect.png";
import { Link, useNavigate } from "react-router-dom";

export default function Homepage() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 w-full flex items-center justify-between py-4 px-6 lg:px-12 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm rounded-b-2xl" 
            : "bg-transparent"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="WolfEye+ Logo" className="h-8 w-auto" />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <a href="#home" className="text-gray-900 font-semibold text-sm hover:text-orange-500 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium">
              About
            </a>
            <a href="#how" className="text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium">
              How it Works
            </a>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors cursor-pointer text-sm font-medium"
              >
                Services
                <svg
                  className={`w-4 h-4 transform transition-transform ${isServicesOpen ? "rotate-180" : "rotate-0"}`}
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
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-[400px] bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl p-6 flex flex-col gap-4 z-50"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        onClick={() => navigateWithToken('/facewebcam')}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                           <ArrowUpRight size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                            Webcam Detection
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">
                            AI checks safety gear instantly.
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => navigateWithToken('/add')}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                         <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                           <User size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                            Enroll Employee
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">
                            Add your workers & detect safety.
                          </p>
                        </div>
                      </div>

                       <div
                        onClick={() => navigateWithToken('/company/dashboard')}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                         <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors">
                           <ArrowRight size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                            Dashboard
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">
                            View attendance & performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Employee Login Button */}
          <Link
            to="/employee/login"
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <User size={16} />
            Employee Login
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg overflow-hidden lg:hidden flex flex-col p-6 gap-4 z-40"
            >
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900">Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">About</a>
              <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-600">How it Works</a>
              
              <div className="py-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-400 mb-2">Services</p>
                <div onClick={() => { navigateWithToken('/facewebcam'); setIsMobileMenuOpen(false); }} className="py-2 text-gray-700 font-medium cursor-pointer">Webcam Detection</div>
                <div onClick={() => { navigateWithToken('/add'); setIsMobileMenuOpen(false); }} className="py-2 text-gray-700 font-medium cursor-pointer">Enroll Employee</div>
                <div onClick={() => { navigateWithToken('/company/dashboard'); setIsMobileMenuOpen(false); }} className="py-2 text-gray-700 font-medium cursor-pointer">Dashboard</div>
              </div>

              <Link
                to="/employee/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-medium mt-2"
              >
                <User size={18} />
                Employee Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center w-full max-w-5xl z-10 text-center mx-auto mt-10 lg:mt-0">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center px-4"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            WolfEye+ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Protect Every Worker</span>
          </h1>
          <p
            className="text-gray-600 leading-relaxed mb-10 max-w-2xl text-lg md:text-xl"
            style={{ fontFamily: "Inter" }}
          >
            AI-powered detection ensures every worker wears the required safety
            gear before starting work. Track attendance, monitor compliance, and
            reward disciplined behavior.
          </p>

          {/* Try Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateWithToken('/facewebcam')}
            className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-gray-900 transition-all mb-16 shadow-xl shadow-orange-100/50 text-lg font-medium ring-4 ring-black/5"
          >
            Try WolfEye+
            <ArrowUpRight size={20} />
          </motion.button>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-3 gap-8 md:gap-16 text-center w-full max-w-3xl"
          >
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">25+</p>
              <p className="text-gray-500 text-sm md:text-base font-medium">Sites Monitored</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">500+</p>
              <p className="text-gray-500 text-sm md:text-base font-medium">Workers Protected</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm">
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">98%</p>
              <p className="text-gray-500 text-sm md:text-base font-medium">Compliance Rate</p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}