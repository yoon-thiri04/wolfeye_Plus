import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, Building, Users, Shield, Briefcase, ArrowRight } from "lucide-react";
import axios from "axios";
import gradientBg from "../assets/images/home-gradient-effect.png";
import logo from "../assets/images/Logo-Elitebuilders.png";

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
      navigate("/company/dashboard");
    }
  }, [navigate]);

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      return null;
    }
  };

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
        axios.post("/api/login", {
          email: formData.email,
          password: formData.password,
          role: "company"
        }),

        //  Simple login
        axios.post("/api/login", {
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
        const payload = decodeToken(token);
        const responseUser = response.data.user;
        userData = {
          id: responseUser?.id || payload?.id || response.data.id || response.data.user_id,
          email: responseUser?.email || formData.email,
          role: responseUser?.role || payload?.role || "company",
          name: responseUser?.name || response.data.name || formData.email.split('@')[0]
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

      console.log("Company login successful, navigating to dashboard");
      navigate("/company/dashboard");

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
      password: "companytempo@123!"
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Gradient */}
      <img
        src={gradientBg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 md:p-10 border border-white/50">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
             <img src={logo} alt="WolfEye+" className="h-8 md:h-10 mx-auto" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Plus Jakarta Sans" }}>
            Company Portal
          </h1>
          <p className="text-gray-500 text-sm md:text-base">Sign in to manage your workforce safety</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-xl flex items-start gap-3">
             <div className="bg-red-100 p-1 rounded-full text-red-600 shrink-0 mt-0.5">
               <Shield size={14} />
             </div>
             <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Company Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:bg-white/80 text-base"
                placeholder="company@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm hover:bg-white/80 text-base"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Dashboard <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-200/50">
           <div className="flex flex-col gap-3 text-center">
             <p className="text-sm text-gray-500">Other login options:</p>
             <div className="flex justify-center gap-4 text-sm font-medium">
               <Link to="/employee/login" className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                 <Users size={16} /> Employee
               </Link>
               <span className="text-gray-300">|</span>
               <Link to="/admin/login" className="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                 <Shield size={16} /> Admin
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
