import React, { useState, useEffect } from "react";
import { Calendar, Shield, Users, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
    LineChart,
  Line,
    ReferenceLine
} from 'recharts';


const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [error, setError] = useState("");
  const [noEmployees, setNoEmployees] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [monthlyData, setMonthlyData] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const navigateWithToken = (path) => {
    const companyToken = localStorage.getItem('company_token');
    const companyUser = localStorage.getItem('company_user');

    if (companyToken) {
      localStorage.setItem('face_verification_company_token', companyToken);
    }
    if (companyUser) {
      try {
        const userData = JSON.parse(companyUser);
        if (userData.id) {
          localStorage.setItem('face_verification_company_id', userData.id);
        }
      } catch (err) {
        console.error("Error parsing company user data:", err);
      }
    }

    console.log("Navigating to", path, "with company token");
    window.location.href = path;
  };

  useEffect(() => {
    const token = localStorage.getItem("company_token") || localStorage.getItem("face_verification_company_token");
    const user = JSON.parse(localStorage.getItem("company_user") || localStorage.getItem("face_verification_company_user") || "{}");

    console.log("Dashboard - Token found:", !!token);
    console.log("Dashboard - User role:", user.role);

    if (!token) {
      console.error("No token found in localStorage");
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    if (user.role !== "company") {
      console.error("User role is not company:", user.role);
      setError("Unauthorized access. Please login as company.");
      setLoading(false);
      return;
    }

    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setError("");
      setNoEmployees(false);

      console.log("Fetching dashboard data with token:", token ? "Token present" : "No token");

      const response = await axios.get("/api/company/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Dashboard API response:", response.data);

      if (response.data && response.data.total_employees > 0) {
        setDashboardData(response.data);
      } else {
        setNoEmployees(true);
        setError("No employees found or no data available.");
      }

    } catch (err) {
      console.error("Error fetching dashboard:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        // Clear invalid tokens
        localStorage.removeItem("company_token");
        localStorage.removeItem("face_verification_company_token");
      } else if (err.response?.data?.detail === "Employees with this company had not been placed!" ||
          err.response?.data?.detail === "No employees found for this company") {
        setNoEmployees(true);
        setError("No employees found. Please add employees to see dashboard data.");
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
  try {
    setMonthlyLoading(true);
    const token = localStorage.getItem("company_token") || localStorage.getItem("face_verification_company_token");

    const response = await axios.get("/api/company/monthly_dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Monthly dashboard API response:", response.data);
    setMonthlyData(response.data);

  } catch (err) {
    console.error("Error fetching monthly dashboard:", err);
    setError("Failed to load monthly data. Please try again.");
  } finally {
    setMonthlyLoading(false);
  }
};

  useEffect(() => {
  if (selectedPeriod === "Weekly") {
    fetchWeeklyData();
  } else if (selectedPeriod === "Monthly") {
    fetchMonthlyData();
  }
}, [selectedPeriod]);

// Add data mapping for monthly view
const monthlySummary = monthlyData?.summary || {};
const pieComplianceMonth = monthlyData?.pie_compliance_month || {};
const topImprovementMonth = monthlyData?.top_needing_improvement || [];
const employeeAttendanceMonth = monthlyData?.per_employee_attendance || [];
const ppeViolationsMonth = monthlyData?.ppe_class_violations || [];
const attendanceComparisonMonth = monthlyData?.attendance_comparison || [];
const safetyComparisonMonth = monthlyData?.safety_comparison || [];

  const fetchWeeklyData = async () => {
    try {
      setWeeklyLoading(true);
      const token = localStorage.getItem("company_token") || localStorage.getItem("face_verification_company_token");

      const response = await axios.get("/api/company/weekly_dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Weekly dashboard API response:", response.data);
      setWeeklyData(response.data);

    } catch (err) {
      console.error("Error fetching weekly dashboard:", err);
      setError("Failed to load weekly data. Please try again.");
    } finally {
      setWeeklyLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPeriod === "Weekly") {
      fetchWeeklyData();
    }
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !noEmployees) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/company/login"}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (noEmployees || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Employees Found</h2>
          <p className="text-gray-600 mb-6">{error || "Please add employees to see dashboard data."}</p>
          <button
            onClick={() => navigateWithToken("/add")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add Employees
          </button>
        </div>
      </div>
    );
  }

  // Daily Data
  const {
    total_employees = 0,
    present_count = 0,
    average_attendance_rate = 0,
    average_safety_rate = 0,
    attendance_today = [],
    most_non_compliant_employees = [],
    compliance_distribution = { fully: { count: 0, percent: 0 }, partially: { count: 0, percent: 0 }, non: { count: 0, percent: 0 } },
    ppe_violations_today = []
  } = dashboardData;

  const absentCount = total_employees - present_count;

  const ppeViolationsData = [
    { name: "Gloves", value: ppe_violations_today?.find(v => v.item === "gloves")?.count || 0, color: "bg-red-400" },
    { name: "Glasses", value: ppe_violations_today?.find(v => v.item === "goggles")?.count || 0, color: "bg-orange-400" },
    { name: "Ear protection", value: ppe_violations_today?.find(v => v.item === "ear protection")?.count ||  0, color: "bg-yellow-400" },
    { name: "Helmet", value: ppe_violations_today?.find(v => v.item === "helmet")?.count || 0, color: "bg-green-400" },
    { name: "Vest", value: ppe_violations_today?.find(v => v.item === "vest")?.count || 0, color: "bg-green-500" }
  ];

  const maxViolations = Math.max(...ppeViolationsData.map(v => v.value), 1);

  // Weekly Data
  const weeklySummary = weeklyData?.summary || {};
  const pieCompliance = weeklyData?.pie_compliance_week || {};
  const topImprovement = weeklyData?.top_needing_improvement || [];
  const employeeAttendance = weeklyData?.per_employee_attendance || [];
  const ppeViolationsWeek = weeklyData?.ppe_class_violations || [];
  const attendanceComparison = weeklyData?.attendance_comparison || [];
  const safetyComparison = weeklyData?.safety_comparison || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-gray-600">Real-time AI-powered construction safety monitoring</p>
          </div>
          <div className="flex items-center gap-1 bg-white/50 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-white/20">
            {["Daily", "Weekly", "Monthly"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                    : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {selectedPeriod === "Daily" ? (
          /* Daily view  */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{average_attendance_rate}%</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit mt-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>Today's status</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${average_attendance_rate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Safety Compliance</span>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{average_safety_rate}%</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit mt-2">
                    <Shield className="w-3 h-3" />
                    <span>Average score</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${average_safety_rate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Total Employees</span>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{total_employees}</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit mt-2">
                    <Users className="w-3 h-3" />
                    <span>Active staff</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Absent Today</span>
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{absentCount}</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit mt-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Needs attention</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${absentCount > 0 ? Math.round((absentCount / total_employees) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Employee Attendance
                  </h2>
                  <div className="space-y-3">
  {attendance_today && attendance_today.length > 0 ? (
    <>
      {attendance_today.slice(0, showAll ? attendance_today.length : 3).map((employee, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50/50 transition-colors bg-white/50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm">
              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{employee.name}</div>
              <div className="text-sm text-gray-500">Roll: {employee.employee_id}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Marked at {employee.marked_at}</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              employee.present
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {employee.present ? "Present" : "Absent"}
            </span>
          </div>
        </div>
      ))}

      {attendance_today.length > 3 && (
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 text-orange-600 hover:text-orange-700 text-sm font-medium border border-orange-200 rounded-full hover:bg-orange-50 transition-colors"
          >
            {showAll ? 'Show Less' : `View All ${attendance_today.length} Employees`}
          </button>
        </div>
      )}
    </>
  ) : (
    <div className="text-center py-8 text-gray-500">No attendance records for today</div>
  )}
</div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500" />
                      PPE Compliance Distribution
                    </h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {compliance_distribution?.fully?.percent || 0}% Compliant
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Real-time equipment compliance status</p>

                  <div className="flex items-center justify-center mb-8">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray={`${(compliance_distribution?.fully?.percent || 0) * 5.03} 503`}
                          strokeLinecap="round"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray={`${(compliance_distribution?.partially?.percent || 0) * 5.03} 503`}
                          strokeDashoffset={`-${(compliance_distribution?.fully?.percent || 0) * 5.03}`}
                          strokeLinecap="round"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray={`${(compliance_distribution?.non?.percent || 0) * 5.03} 503`}
                          strokeDashoffset={`-${((compliance_distribution?.fully?.percent || 0) + (compliance_distribution?.partially?.percent || 0)) * 5.03}`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm shadow-green-200"></div>
                        <span className="text-sm font-medium text-gray-700">Fully Compliant</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {compliance_distribution?.fully?.count || 0} ({compliance_distribution?.fully?.percent || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm shadow-yellow-200"></div>
                        <span className="text-sm font-medium text-gray-700">Partially Compliant</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {compliance_distribution?.partially?.count || 0} ({compliance_distribution?.partially?.percent || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm shadow-red-200"></div>
                        <span className="text-sm font-medium text-gray-700">Non-Compliant</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {compliance_distribution?.non?.count || 0} ({compliance_distribution?.non?.percent || 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <h2 className="text-xl font-bold text-gray-900">Needs Improvement</h2>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {most_non_compliant_employees?.length || 0} Alerts
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Employees requiring attention & support</p>

                  <div className="space-y-3">
                    {most_non_compliant_employees && most_non_compliant_employees.length > 0 ? (
                      most_non_compliant_employees.slice(0, 1).map((employee, index) => (
                        <div key={index} className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-200">
                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{employee.name}</div>
                                <div className="text-xs text-gray-500">{employee.employee_id}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-orange-600">{100 - employee.ppe_violation_percent}%</div>
                              <div className="text-xs text-gray-500">PPE Score</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="font-medium">{employee.total_violations} active violations</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">All employees are compliant!</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    PPE Violations Today
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">Real-time equipment compliance status</p>

                  <div className="space-y-5">
                    {ppeViolationsData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm font-bold text-gray-900">{item.value}</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 ${item.color} transition-all duration-1000 ease-out rounded-full`}
                            style={{ width: `${(item.value / maxViolations) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : selectedPeriod === "Weekly" ? (
          /* Weekly view  */
          <div className="space-y-8">
            {/* First Row for Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{weeklySummary.average_attendance_rate_week || 0}%</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit mt-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>+3% vs last week</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${weeklySummary.average_attendance_rate_week || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Safety Compliance</span>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{weeklySummary.average_safety_rate_week || 0}%</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit mt-2">
                    <Shield className="w-3 h-3" />
                    <span>Average score</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${weeklySummary.average_safety_rate_week || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Total Employees</span>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{weeklySummary.total_employees || 0}</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit mt-2">
                    <Users className="w-3 h-3" />
                    <span>Active staff</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Absent This Week</span>
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-3xl font-bold text-gray-900">{weeklySummary.unique_absent_employees_count || 0}</div>
                  <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit mt-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Needs attention</span>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${weeklySummary.total_employees ? Math.round((weeklySummary.unique_absent_employees_count / weeklySummary.total_employees) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

  {/* Second Row for PPE Compliance Distribution and Needs Improvement */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* PPE Compliance Distribution */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          PPE Compliance Distribution
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {pieCompliance.total_compliance_percent || 0}% Compliant
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Real-time equipment compliance status</p>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${(pieCompliance.distribution?.[0]?.percent || 0) * 5.03} 503`}
              strokeLinecap="round"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeDasharray={`${(pieCompliance.distribution?.[1]?.percent || 0) * 5.03} 503`}
              strokeDashoffset={`-${(pieCompliance.distribution?.[0]?.percent || 0) * 5.03}`}
              strokeLinecap="round"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
              strokeDasharray={`${(pieCompliance.distribution?.[2]?.percent || 0) * 5.03} 503`}
              strokeDashoffset={`-${((pieCompliance.distribution?.[0]?.percent || 0) + (pieCompliance.distribution?.[1]?.percent || 0)) * 5.03}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {pieCompliance.distribution?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shadow-sm ${
                index === 0 ? 'bg-green-500 shadow-green-200' : index === 1 ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {item.name === "Fully" ? "Fully Compliant" :
                 item.name === "Partially" ? "Partially Compliant" : "Non-Compliant"}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {item.name === "Fully" ? (pieCompliance.week_fully || 0) :
               item.name === "Partially" ? (pieCompliance.week_partial || 0) :
               (pieCompliance.week_non || 0)} ({item.percent || 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Needs Improvement */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Needs Improvement</h2>
        </div>
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          {topImprovement.length} Alerts
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Employees requiring attention & support</p>

      <div className="space-y-4">
  {topImprovement
    .filter(employee => employee.email !== "wintwah@gmail.com" && employee.name && employee.employee_id)
    .slice(0, 4)
    .map((employee, index) => (
    <div key={index} className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-200">
            {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.employee_id}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-orange-600">{employee.overall_worn_percent || 0}%</div>
          <div className="text-xs text-gray-500">PPE Score</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="font-medium">{employee.violation_count || 0} active violations</span>
      </div>
    </div>
  ))}
</div>
    </div>
  </div>

  {/* Third Row for Per Employee Attendance and PPE Violations */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* Per Employee Attendance */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-orange-500" />
        PPE Employee Attendance
      </h2>
      <p className="text-sm text-gray-500 mb-6">Click on any employee to view details</p>

      <div className="space-y-3">
        {employeeAttendance.slice(0, 8).map((employee, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50/50 transition-colors bg-white/50 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600 font-bold text-sm shadow-sm">
                {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{employee.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500">{employee.employee_id}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">{employee.attendance_rate || 0}%</div>
              <div className="text-xs text-gray-500">{employee.days_present || 0}/7 days</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PPE Violations */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        PPE Violations This Week
      </h2>
      <p className="text-sm text-gray-500 mb-6">Most common equipment violations</p>

      <div className="space-y-5">
        {ppeViolationsWeek.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 capitalize">{item.item}</span>
              <span className="text-sm font-bold text-gray-900">{item.count || 0}</span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${
                  index === 0 ? 'bg-red-400' :
                  index === 1 ? 'bg-orange-400' :
                  index === 2 ? 'bg-yellow-400' :
                  index === 3 ? 'bg-green-400' : 'bg-green-500'
                } transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${((item.count || 0) / Math.max(...ppeViolationsWeek.map(v => v.count || 0), 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Fourth Row for Daily Attendance Rate and Company-wide Safety Score */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* Daily Attendance Rate Chart */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        Daily Attendance Rate
      </h2>
      <p className="text-sm text-gray-500 mb-6">This Week vs Last Week comparison</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceComparison}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
              }
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Line
              type="monotone"
              dataKey="this_week_attendance"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">Last Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">This Week</span>
        </div>
      </div>
    </div>

    {/* Company-wide Safety Score */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        Company-wide Safety Score
      </h2>
      <p className="text-sm text-gray-500 mb-6">This week trend with 95% goal line</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safetyComparison}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
              }
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <ReferenceLine y={95} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Goal (95%)', fill: '#f97316', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="this_week_safety"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">Last Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">This Week</span>
        </div>
      </div>
    </div>
  </div>
</div>
        ) : (
          /* Monthly view */
<div className="space-y-6">
  {/* First Row for Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.average_attendance_rate_month || 0}%</div>
        <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit mt-2">
          <TrendingUp className="w-3 h-3" />
          <span>+5% vs last month</span>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${monthlySummary.average_attendance_rate_month || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Average Safety Compliance</span>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.average_safety_rate_month || 0}%</div>
        <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit mt-2">
          <Shield className="w-3 h-3" />
          <span>Average score</span>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${monthlySummary.average_safety_rate_month || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Total Employees</span>
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.total_employees || 0}</div>
        <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full w-fit mt-2">
          <Users className="w-3 h-3" />
          <span>Active staff</span>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "100%" }}></div>
      </div>
    </div>

    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-orange-100/20 border border-white/40 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Absent This Month</span>
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.unique_absent_employees_count || 0}</div>
        <div className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-fit mt-2">
          <AlertTriangle className="w-3 h-3" />
          <span>Needs attention</span>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${monthlySummary.total_employees ? Math.round((monthlySummary.unique_absent_employees_count / monthlySummary.total_employees) * 100) : 0}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Second Row for PPE Compliance Distribution and Needs Improvement */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* PPE Compliance Distribution */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          PPE Compliance Distribution
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {pieComplianceMonth.total_compliance_percent || 0}% Compliant
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Monthly equipment compliance status</p>

      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray={`${(pieComplianceMonth.distribution?.[0]?.percent || 0) * 5.03} 503`}
              strokeLinecap="round"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="20"
              strokeDasharray={`${(pieComplianceMonth.distribution?.[1]?.percent || 0) * 5.03} 503`}
              strokeDashoffset={`-${(pieComplianceMonth.distribution?.[0]?.percent || 0) * 5.03}`}
              strokeLinecap="round"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
              strokeDasharray={`${(pieComplianceMonth.distribution?.[2]?.percent || 0) * 5.03} 503`}
              strokeDashoffset={`-${((pieComplianceMonth.distribution?.[0]?.percent || 0) + (pieComplianceMonth.distribution?.[1]?.percent || 0)) * 5.03}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {pieComplianceMonth.distribution?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shadow-sm ${
                index === 0 ? 'bg-green-500 shadow-green-200' : index === 1 ? 'bg-yellow-500 shadow-yellow-200' : 'bg-red-500 shadow-red-200'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                {item.name === "Fully" ? "Fully Compliant" :
                 item.name === "Partially" ? "Partially Compliant" : "Non-Compliant"}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {item.name === "Fully" ? (pieComplianceMonth.month_fully || 0) :
               item.name === "Partially" ? (pieComplianceMonth.month_partial || 0) :
               (pieComplianceMonth.month_non || 0)} ({item.percent || 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Needs Improvement */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Needs Improvement</h2>
        </div>
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          {topImprovementMonth.length} Alerts
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Employees requiring attention & support</p>

      <div className="space-y-4">
  {topImprovementMonth
    .filter(employee => employee.email !== "wintwah@gmail.com" && employee.name && employee.employee_id)
    .slice(0, 4)
    .map((employee, index) => (
    <div key={index} className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-200">
            {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.employee_id}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-orange-600">{employee.overall_worn_percent || 0}%</div>
          <div className="text-xs text-gray-500">PPE Score</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/50 p-2 rounded-lg">
        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="font-medium">{employee.violation_count || 0} active violations</span>
      </div>
    </div>
  ))}
</div>
    </div>
  </div>

  {/* Third Row for Per Employee Attendance and PPE Violations */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* Per Employee Attendance */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-orange-500" />
        Monthly Employee Attendance
      </h2>
      <p className="text-sm text-gray-500 mb-6">Click on any employee to view details</p>

      <div className="space-y-3">
        {employeeAttendanceMonth.slice(0, 8).map((employee, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50/50 transition-colors bg-white/50 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-600 font-bold text-sm shadow-sm">
                {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{employee.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500">{employee.employee_id}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">{employee.attendance_rate || 0}%</div>
              <div className="text-xs text-gray-500">{employee.days_present || 0}/{employee.total_days || 30} days</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PPE Violations This Month */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        PPE Violations This Month
      </h2>
      <p className="text-sm text-gray-500 mb-6">Most common equipment violations</p>

      <div className="space-y-5">
        {ppeViolationsMonth.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 capitalize">{item.item}</span>
              <span className="text-sm font-bold text-gray-900">{item.count || 0}</span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${
                  index === 0 ? 'bg-red-400' :
                  index === 1 ? 'bg-orange-400' :
                  index === 2 ? 'bg-yellow-400' :
                  index === 3 ? 'bg-green-400' : 'bg-green-500'
                } transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${((item.count || 0) / Math.max(...ppeViolationsMonth.map(v => v.count || 0), 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Fourth Row for Weekly Attendance Rate and Company-wide Safety Score */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
    {/* Weekly Attendance Rate Chart */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        Weekly Attendance Rate
      </h2>
      <p className="text-sm text-gray-500 mb-6">This Month vs Last Month comparison</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceComparisonMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="week_number"
              tickFormatter={(weekNum) => `Week ${weekNum}`}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Line
              type="monotone"
              dataKey="this_month_attendance"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="last_month_attendance"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">Last Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">This Month</span>
        </div>
      </div>
    </div>

    {/* Company-wide Safety Score */}
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-orange-100/20 border border-white/40 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        Company-wide Safety Score
      </h2>
      <p className="text-sm text-gray-500 mb-6">Monthly trend with 95% goal line</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safetyComparisonMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="week_number"
              tickFormatter={(weekNum) => `Week ${weekNum}`}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <ReferenceLine y={95} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'Goal (95%)', fill: '#f97316', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="this_month_safety"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">Last Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-600">This Month</span>
        </div>
      </div>
    </div>
  </div>
</div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
