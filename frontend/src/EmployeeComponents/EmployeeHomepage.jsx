import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Menu, X, CheckCircle, Shield, Clock } from "lucide-react";
import logo from "../assets/images/logo.png";
import gradientBg from "../assets/images/home-gradient-effect.png";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeHomepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white font-sans overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={gradientBg}
          alt="Gradient Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white/80 to-white/90 mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={logo} alt="WolfEye+ Logo" className="h-8 w-auto relative z-10" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              WolfEye<span className="text-orange-600">+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link to="/employee/dashboard" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/facewebcam" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
                Safety Check
              </Link>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
                EP
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 md:hidden p-4 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/employee/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-gray-50 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-3"
              >
                <Clock size={18} /> Dashboard
              </Link>
              <Link
                to="/facewebcam"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-gray-50 text-gray-900 font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-3"
              >
                <Shield size={18} /> Safety Check
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold mb-6 shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Employee Portal
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Work Safe. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  Stay Protected.
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Start your shift with confidence. Use our AI-powered safety verification to ensure you're fully equipped with the right PPE gear before entering the site.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/facewebcam"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  Start Safety Check
                  <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                
                <Link
                  to="/employee/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-900 hover:border-orange-200 hover:bg-orange-50 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  View Dashboard
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
                <div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500 mt-1">AI Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">&lt;2s</div>
                  <div className="text-sm text-gray-500 mt-1">Detection Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-500 mt-1">Availability</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Modern Cards/Visuals instead of Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full max-w-lg lg:max-w-none"
            >
              <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                
                {/* Main Glass Card */}
                <div className="relative bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Safety Status</h3>
                      <p className="text-sm text-gray-500">Real-time monitoring</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Helmet Detected", status: "Verified", color: "text-green-600", bg: "bg-green-50" },
                      { label: "Safety Vest", status: "Verified", color: "text-green-600", bg: "bg-green-50" },
                      { label: "Safety Goggles", status: "Verified", color: "text-green-600", bg: "bg-green-50" },
                      { label: "Gloves", status: "Pending", color: "text-orange-600", bg: "bg-orange-50" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.status === "Verified" ? "bg-green-500" : "bg-orange-500"}`} />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.bg} ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                  >
                    <Shield className="w-8 h-8 text-orange-500" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
                  >
                    <Clock className="w-8 h-8 text-blue-500" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
