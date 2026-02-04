import React, { useState } from 'react';
import { Settings, Mail, UserCheck, ChevronDown, Save, Bell, Building, Smartphone, Calendar, AlertTriangle } from 'lucide-react';
import Navbar from "./Navbar.jsx";
import { motion } from 'framer-motion';

function Setting() {
  const [formData, setFormData] = useState({
    email: 'yangjonstarcoinc@gmail.com',
    phone: '+959790479290',
    constructionName: 'Yangon Star Construction',
    weeklyDay: 'Friday',
    alertThreshold: '75'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 font-sans">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      {/* Success Notification */}
      <div className={`fixed top-24 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg z-50 max-w-sm transition-all duration-300 transform ${showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Save className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-green-800 font-medium">Settings Saved!</p>
            <p className="text-green-700 text-sm">Your preferences have been updated.</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-3">
            Company Settings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Manage your company's identity and notification preferences. Keep your profile up to date for better tracking and reporting.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Contact Information Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/50 p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-100/50 transition-colors duration-500"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-sm text-gray-500">Primary contact details for notifications</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(for SMS)</span>
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Construction Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/50 p-6 sm:p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100/50 transition-colors duration-500"></div>

            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Company Details & Preferences</h2>
                <p className="text-sm text-gray-500">Configure how the system interacts with your company</p>
              </div>
            </div>

            <div className="space-y-8 relative">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Construction Name
                </label>
                <div className="relative max-w-md">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="constructionName"
                    value={formData.constructionName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  This name will be displayed on reports and invoices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weekly Summary Day
                  </label>
                  <div className="relative w-full">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                      name="weeklyDay"
                      value={formData.weeklyDay}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Day to receive automated weekly reports.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Low Attendance Alert Threshold
                  </label>
                  <div className="relative w-full">
                    <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="alertThreshold"
                      value={formData.alertThreshold}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      %
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Alert when attendance drops below this value.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end pt-4"
          >
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className={`flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40 transition-all transform active:scale-[0.98] ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSaving ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Settings className="w-6 h-6 animate-spin-slow" />
              )}
              <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Setting;
