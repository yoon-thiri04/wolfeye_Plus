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
  X
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    plan: "basic"
  });

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    if (user.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    // Fetch companies list
    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get("http://localhost:8000/admin/company_list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompanies(response.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.post(
        "http://localhost:8000/admin/add_company",
        companyForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.message === "Company Added!") {
        setSuccessMessage("Company added successfully!");
        setCompanyForm({ name: "", email: "", plan: "basic" });
        setShowAddCompany(false);
        fetchCompanies(); // Refresh the list

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error adding company:", err);
      if (err.response?.status === 400) {
        setError("A company with this email already exists!");
      } else if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Failed to add company. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`http://localhost:8000/admin/delete_company?company_id=${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage("Company deleted successfully!");
      fetchCompanies(); // Refresh the list
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting company:", err);
      setError("Failed to delete company.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">System Administration</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.filter(c => c.plan !== "basic").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("companies")}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "companies"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === "settings"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "companies" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Company Management</h2>
                  <button
                    onClick={() => setShowAddCompany(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Company
                  </button>
                </div>

                {/* Add Company Form Modal */}
                {showAddCompany && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Company</h3>
                        <button
                          onClick={() => setShowAddCompany(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800 text-sm">{error}</p>
                        </div>
                      )}

                      <form onSubmit={handleAddCompany} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={companyForm.name}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter company name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={companyForm.email}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="company@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plan
                          </label>
                          <select
                            name="plan"
                            value={companyForm.plan}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                          >
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowAddCompany(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                              loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {loading ? "Adding..." : "Add Company"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Companies List */}
                <div className="bg-gray-50 rounded-lg border">
                  {companies.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No companies added yet</p>
                      <button
                        onClick={() => setShowAddCompany(true)}
                        className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Add your first company
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {companies.map((company) => (
                        <div key={company.id} className="p-4 hover:bg-white transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{company.name}</h3>
                                <p className="text-sm text-gray-500">{company.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                company.plan === "basic" 
                                  ? "bg-green-100 text-green-800"
                                  : company.plan === "premium"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}>
                                {company.plan}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {/* View company details */}}
                                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCompany(company.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete Company"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">System configuration and settings will be available here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;