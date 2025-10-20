import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Building, Users, Shield, Briefcase } from "lucide-react";
import axios from "axios";

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if company is already logged in
    const token = localStorage.getItem("company_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting company login with:", formData.email);

      // Try different possible login endpoints and payload formats
      const loginAttempts = [

        // General login with role
        axios.post("http://localhost:8000/login", {
          email: formData.email,
          password: formData.password,
          role: "company"
        }),

        //  Simple login
        axios.post("http://localhost:8000/login", {
          email: formData.email,
          password: formData.password
        })
      ];

      let response = null;
      let successfulAttempt = null;

      // Try each login endpoint
      for (let attempt of loginAttempts) {
        try {
          response = await attempt;
          successfulAttempt = attempt;
          break; // Exit loop if successful
        } catch (err) {
          console.log(`Login attempt failed: ${err.config.url}`);
          continue; // Try next endpoint
        }
      }

      if (!response) {
        throw new Error("All login attempts failed");
      }

      console.log("Company login successful:", response.data);

      // Handle different response formats
      let token, userData;

      if (response.data.access_token) {
        token = response.data.access_token;
        userData = {
          id: response.data.user_id,
          email: formData.email,
          role: "company",
          name: response.data.name || formData.email.split('@')[0]
        };
      } else if (response.data.token) {
        token = response.data.token;
        userData = {
          id: response.data.id || response.data.user_id,
          email: formData.email,
          role: response.data.role || "company",
          name: response.data.name || formData.email.split('@')[0]
        };
      } else {
        throw new Error("No authentication token found in response");
      }

      // Store authentication data
      localStorage.setItem("company_token", token);
      localStorage.setItem("company_user", JSON.stringify(userData));

      // Also store for face verification pages
      localStorage.setItem("face_verification_company_token", token);
      localStorage.setItem("face_verification_company_id", userData.id);

      console.log("Company login successful, navigating to homepage");
      navigate("/");

    } catch (err) {
      console.error("Company login error:", err);
      console.error("Error details:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.response?.status === 404) {
        setError("Login endpoint not found. Please contact administrator.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.message === "All login attempts failed") {
        setError("Unable to connect to authentication service. Please try again.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Test credentials for development
  const useTestCredentials = () => {
    setFormData({
      email: "company@example.com",
      password: "company123"
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Portal</h1>
            <p className="text-gray-600">Sign in to manage your employees and safety compliance</p>
          </div>

          {/* Development Helper - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                Development Mode:{" "}
                <button
                  type="button"
                  onClick={useTestCredentials}
                  className="underline font-medium hover:text-yellow-900"
                >
                  Use Test Credentials
                </button>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Company Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="company@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In to Company Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-xs text-blue-700">
                Contact your administrator for login credentials or if you're having trouble accessing your account.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Company Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Monitor employee attendance, safety compliance, and manage your workforce with real-time analytics.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Employee Management</h3>
                  <p className="text-sm text-gray-600">Add and manage your employees</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safety Compliance</h3>
                  <p className="text-sm text-gray-600">Monitor PPE compliance in real-time</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Attendance Analytics</h3>
                  <p className="text-sm text-gray-600">Track employee attendance and reports</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-3">Company Features</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Real-time employee attendance tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                PPE compliance monitoring
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Employee enrollment and management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Safety violation alerts and reports
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;