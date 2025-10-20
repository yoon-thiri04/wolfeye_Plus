import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, User, Shield, Clock, Award, Bug } from "lucide-react";
import axios from "axios";

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
    setDebugInfo("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setDebugInfo("");

  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    setLoading(false);
    return;
  }

  try {
    console.log("Attempting employee login with:", formData.email);
    setDebugInfo(`Attempting login for: ${formData.email}`);

    const response = await axios.post("http://localhost:8000/login", {
      email: formData.email,
      password: formData.password
    });

    console.log("Login response:", response.data);
    setDebugInfo(`Login successful! Role: ${response.data.user?.role}`);

    // Check if the logged-in user has employee role
    if (response.data.user?.role !== "employee") {
      const errorMsg = "This account is not an employee account. Please use the company login.";
      setError(errorMsg);
      setDebugInfo(`Wrong user role: ${response.data.user?.role}`);
      return;
    }

    // Handle employee data
    const responseData = response.data;
    const token = responseData.token;
    const userData = responseData.user;

    if (!token || !userData) {
      throw new Error("Invalid response from server");
    }

    // Store authentication data specifically for employee
    localStorage.setItem("employee_token", token);
    localStorage.setItem("employee_data", JSON.stringify(userData));

    console.log("Employee login successful, navigating to dashboard");
    setDebugInfo("Login successful! Redirecting to dashboard...");

    setTimeout(() => {
      navigate("/employee/dashboard");
    }, 1000);

  } catch (err) {
    console.error("Employee login error:", err);
    setDebugInfo(`Error: ${err.response?.status} - ${err.response?.data?.detail || err.message}`);

    if (err.response?.status === 401) {
      setError("Invalid email or password. Please check your credentials.");
    } else if (err.response?.data?.detail) {
      setError(err.response.data.detail);
    } else if (err.message.includes("not an employee account")) {
      setError(err.message);
    } else if (err.code === "NETWORK_ERROR" || err.message.includes("Network Error")) {
      setError("Network error. Please check if the server is running.");
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

  // Test different credentials
  const useTestCredentials = (type = "employee") => {
    if (type === "employee") {
      setFormData({
        email: "wintwah@gmail.com",
        password: "employee@123!"
      });
    } else {
      setFormData({
        email: "test@company.com",
        password: "test123"
      });
    }
    setDebugInfo(`Test credentials loaded for: ${type}`);
  };

  // Check if employee exists in database
  const checkEmployeeExists = async () => {
    try {
      setDebugInfo("Checking if employee exists in database...");
      console.log("Checking employee:", formData.email);
      setDebugInfo(`Checked: ${formData.email} - No check endpoint available`);
    } catch (err) {
      setDebugInfo("Error checking employee existence");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bug className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Debug Info:</span>
              </div>
              <p className="text-xs text-blue-700 font-mono">{debugInfo}</p>
            </div>
          )}

          {/* Development Helper */}
          <div className="mb-4 space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm text-center mb-2">
                Development Tools
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => useTestCredentials("employee")}
                  className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  Employee Test Creds
                </button>
                <button
                  type="button"
                  onClick={() => useTestCredentials("other")}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                  Other Test Creds
                </button>
                <button
                  type="button"
                  onClick={checkEmployeeExists}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Check Employee
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                placeholder="employee@company.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors pr-12"
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
              <p className="text-xs text-gray-500 mt-1">
                Use the temporary password provided by your company
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-red-800">Login Failed</span>
                </div>
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Make sure the employee exists and the password is correct.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
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
                  Sign In to Employee Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Troubleshooting</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Make sure you're using your company email</li>
                <li>• Use the temporary password provided by your company</li>
                <li>• Contact administrator if account doesn't exist</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Employee Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Track your attendance, safety compliance, and performance metrics.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Attendance Tracking</h3>
                  <p className="text-sm text-gray-600">View your daily attendance records</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safety Compliance</h3>
                  <p className="text-sm text-gray-600">Monitor your PPE compliance scores</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Performance Points</h3>
                  <p className="text-sm text-gray-600">Track your safety performance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-3">Common Login Issues</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Employee not created in system
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Incorrect temporary password
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Password not properly hashed
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Account not activated
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;