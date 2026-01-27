import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  Shield,
  Plus,
  LogOut,
  Eye,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [doorDeviceId, setDoorDeviceId] = useState("DOOR_001");
  const [doorLoading, setDoorLoading] = useState(false);
  const [doorStatus, setDoorStatus] = useState("");
  const [doorError, setDoorError] = useState("");
  const navigate = useNavigate();

  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    plan: "basic"
  });

  useEffect(() => {
    // Mock fetch companies (replace with actual API call)
    // fetchCompanies();
    setCompanies([
      { id: 1, name: "Acme Corp", email: "contact@acme.com", plan: "enterprise", status: "active" },
      { id: 2, name: "BuildSafe Ltd", email: "info@buildsafe.com", plan: "premium", status: "active" },
      { id: 3, name: "ConstructCo", email: "admin@constructco.com", plan: "basic", status: "inactive" },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies(companies.filter(c => c.id !== id));
      setSuccessMessage("Company deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    const newCompany = {
      id: companies.length + 1,
      ...companyForm,
      status: "active"
    };
    setCompanies([...companies, newCompany]);
    setShowAddCompany(false);
    setCompanyForm({ name: "", email: "", plan: "basic" });
    setSuccessMessage("Company added successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleDoorUnlock = async () => {
    const deviceId = doorDeviceId.trim() || "DOOR_001";
    setDoorLoading(true);
    setDoorStatus("");
    setDoorError("");
    try {
      const res = await fetch("/api/iot/trigger_unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device_id: deviceId, duration: 5000 })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to send unlock command");
      }
      setDoorStatus(data?.message || `Unlock command sent to ${deviceId}`);
    } catch (err) {
      setDoorError(err?.message || "Failed to send unlock command");
    } finally {
      setDoorLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fff5eb]">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Admin Portal</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">System Administration</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-2xl p-4 shadow-sm max-w-md mx-auto sm:mx-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-green-800 font-medium text-sm sm:text-base">{successMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Plans</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {companies.filter(c => c.plan !== "basic").length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">System Status</p>
                  <p className="text-3xl font-bold text-gray-900">Active</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/70 mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Door Lock Test</h2>
                <p className="text-sm text-gray-500">Send a one-time unlock command to a device.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  value={doorDeviceId}
                  onChange={(e) => setDoorDeviceId(e.target.value)}
                  placeholder="Device ID"
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 bg-white/90 text-sm"
                />
                <button
                  onClick={handleDoorUnlock}
                  disabled={doorLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-60"
                >
                  {doorLoading ? "Sending..." : "Unlock Door"}
                </button>
              </div>
            </div>
            {(doorStatus || doorError) && (
              <div className="mt-4 text-sm">
                {doorStatus && <p className="text-green-700">{doorStatus}</p>}
                {doorError && <p className="text-red-600">{doorError}</p>}
              </div>
            )}
          </motion.div>

          {/* Main Container */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-orange-500/5 border border-white overflow-hidden">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-100 overflow-x-auto">
              <nav className="flex px-6 min-w-max">
                <button
                  onClick={() => setActiveTab("companies")}
                  className={`relative py-5 px-6 font-medium text-sm transition-colors ${
                    activeTab === "companies"
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Companies Management
                  {activeTab === "companies" && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`relative py-5 px-6 font-medium text-sm transition-colors ${
                    activeTab === "settings"
                      ? "text-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  System Settings
                  {activeTab === "settings" && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "companies" && (
                  <motion.div
                    key="companies"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                      <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search companies..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm"
                        />
                      </div>
                      <button
                        onClick={() => setShowAddCompany(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        Add New Company
                      </button>
                    </div>

                    {filteredCompanies.length === 0 ? (
                      <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No companies found</h3>
                        <p className="text-gray-500">Try adjusting your search or add a new company.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredCompanies.map((company, index) => (
                          <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shrink-0 border border-blue-200 group-hover:scale-105 transition-transform">
                                  <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-gray-900 truncate text-base">{company.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="truncate">{company.email}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className={`capitalize ${company.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                      {company.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  company.plan === "basic" 
                                    ? "bg-gray-100 text-gray-600"
                                    : company.plan === "premium"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}>
                                  {company.plan}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                    title="View Details"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCompany(company.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete Company"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-300">
                      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-10 h-10 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">System Configuration</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Advanced system settings and global configurations will be available in the next update.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Add Company Modal */}
        <AnimatePresence>
          {showAddCompany && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddCompany(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Add New Company</h3>
                    <button 
                      onClick={() => setShowAddCompany(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-white/80 text-sm mt-1">Enter company details below</p>
                </div>

                <div className="p-6 sm:p-8">
                  <form onSubmit={handleAddCompany} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={companyForm.name}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="e.g. Acme Corporation"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={companyForm.email}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="company@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subscription Plan
                      </label>
                      <div className="relative">
                        <select
                          name="plan"
                          value={companyForm.plan}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none"
                        >
                          <option value="basic">Basic Plan</option>
                          <option value="premium">Premium Plan</option>
                          <option value="enterprise">Enterprise Plan</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <Filter className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddCompany(false)}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                      >
                        Create Company
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
