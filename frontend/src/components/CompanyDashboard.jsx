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

      const response = await axios.get("http://localhost:8000/company/dashboard", {
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

    const response = await axios.get("http://localhost:8000/company/monthly_dashboard", {
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

      const response = await axios.get("http://localhost:8000/company/weekly_dashboard", {
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Employee Dashboard</h1>
            <p className="text-gray-500 text-sm">Real-time AI-powered construction safety monitoring</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setSelectedPeriod("Daily")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === "Daily"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setSelectedPeriod("Weekly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === "Weekly"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedPeriod("Monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === "Monthly"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {selectedPeriod === "Daily" ? (
          /* Daily view  */
          <>
            <div className="grid grid-cols-4 gap-6 mb-8 text-left">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Attendance Rate Today</span>
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-700" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{average_attendance_rate}%</div>
                  <div className="text-xs text-green-600 font-medium">-3% vs yesterday</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Performance</span>
                  <span className="text-xs font-semibold text-green-700">{average_attendance_rate}%</span>
                </div>
                <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
                  <div
                    className="bg-green-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${average_attendance_rate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Average Safety Compliance</span>
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-700" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{average_safety_rate}%</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Performance</span>
                  <span className="text-xs font-semibold text-blue-700">{average_safety_rate}%</span>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${average_safety_rate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Total Employees</span>
                  <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-700" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{total_employees}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Performance</span>
                  <span className="text-xs font-semibold text-purple-700">100%</span>
                </div>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Absent Employees</span>
                  <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-700" />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{absentCount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Performance</span>
                  <span className="text-xs font-semibold text-orange-700">{absentCount > 0 ? Math.round((absentCount / total_employees) * 100) : 0}%</span>
                </div>
                <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${absentCount > 0 ? Math.round((absentCount / total_employees) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-left">
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Employee Attendance</h2>
                  <div className="space-y-3">
  {attendance_today && attendance_today.length > 0 ? (
    <>
      {attendance_today.slice(0, showAll ? attendance_today.length : 3).map((employee, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-500 font-semibold text-sm">
              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{employee.name}</div>
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
            className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">PPE Compliance Distribution</h2>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Fully Compliant</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {compliance_distribution?.fully?.count || 0} ({compliance_distribution?.fully?.percent || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Partially Compliant</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {compliance_distribution?.partially?.count || 0} ({compliance_distribution?.partially?.percent || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Non-Compliant</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {compliance_distribution?.non?.count || 0} ({compliance_distribution?.non?.percent || 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <h2 className="text-lg font-semibold text-gray-900">Needs Improvement</h2>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {most_non_compliant_employees?.length || 0} Alerts
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-9">Employees requiring attention & support</p>

                  <div className="space-y-3">
                    {most_non_compliant_employees && most_non_compliant_employees.length > 0 ? (
                      most_non_compliant_employees.slice(0, 1).map((employee, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{employee.name}</div>
                                <div className="text-xs text-gray-500">{employee.employee_id}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-orange-600">{100 - employee.ppe_violation_percent}%</div>
                              <div className="text-xs text-gray-500">PPE</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            <span>{employee.total_violations} violations</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">All employees are compliant!</div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">PPE Violations Today</h2>
                  <p className="text-sm text-gray-500 mb-6">Real-time equipment compliance status</p>

                  <div className="space-y-4">
                    {ppeViolationsData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 ${item.color} transition-all rounded`}
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
<div className="space-y-6">
  {/* First Row for Summary Cards */}
  <div className="grid grid-cols-4 gap-6 text-left">
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Attendance Rate This Week</span>
        <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-green-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{weeklySummary.average_attendance_rate_week || 0}%</div>
        <div className="text-xs text-green-600 font-medium">+3% vs last week</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-green-700">{weeklySummary.average_attendance_rate_week || 0}%</span>
      </div>
      <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
        <div
          className="bg-green-600 h-1.5 rounded-full transition-all"
          style={{ width: `${weeklySummary.average_attendance_rate_week || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Average Safety Compliance</span>
        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{weeklySummary.average_safety_rate_week || 0}%</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-blue-700">{weeklySummary.average_safety_rate_week || 0}%</span>
      </div>
      <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${weeklySummary.average_safety_rate_week || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Total Employees</span>
        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{weeklySummary.total_employees || 0}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-purple-700">100%</span>
      </div>
      <div className="mt-2 w-full bg-purple-200 rounded-full h-1.5">
        <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: "100%" }}></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm border border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Absent This Week</span>
        <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{weeklySummary.unique_absent_employees_count || 0}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-orange-700">
          {weeklySummary.total_employees ? Math.round((weeklySummary.unique_absent_employees_count / weeklySummary.total_employees) * 100) : 0}%
        </span>
      </div>
      <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
        <div
          className="bg-orange-600 h-1.5 rounded-full transition-all"
          style={{ width: `${weeklySummary.total_employees ? Math.round((weeklySummary.unique_absent_employees_count / weeklySummary.total_employees) * 100) : 0}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Second Row for PPE Compliance Distribution and Needs Improvement */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* PPE Compliance Distribution */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">PPE Compliance Distribution</h2>
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
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-700">
                {item.name === "Fully" ? "Fully Compliant" :
                 item.name === "Partially" ? "Partially Compliant" : "Non-Compliant"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {item.name === "Fully" ? (pieCompliance.week_fully || 0) :
               item.name === "Partially" ? (pieCompliance.week_partial || 0) :
               (pieCompliance.week_non || 0)} ({item.percent || 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Needs Improvement */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Needs Improvement</h2>
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
    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
            {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.employee_id}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-orange-600">{employee.overall_worn_percent || 0}%</div>
          <div className="text-xs text-gray-500">PPE</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        <span>{employee.violation_count || 0} violations</span>
      </div>
    </div>
  ))}
</div>
    </div>
  </div>

  {/* Third Row for Per Employee Attendance and PPE Violations */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* Per Employee Attendance */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">PPE Employee Attendance</h2>
      <p className="text-sm text-gray-500 mb-6">Click on any employee to view details</p>

      <div className="space-y-4">
        {employeeAttendance.slice(0, 8).map((employee, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-500 font-semibold text-sm">
                {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{employee.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500">{employee.employee_id}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{employee.attendance_rate || 0}%</div>
              <div className="text-xs text-gray-500">{employee.days_present || 0}/7 days</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PPE Violations */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">PPE Violations This Week</h2>
      <p className="text-sm text-gray-500 mb-6">Most common equipment violations</p>

      <div className="space-y-4">
        {ppeViolationsWeek.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 capitalize">{item.item}</span>
              <span className="text-sm font-semibold text-gray-900">{item.count || 0}</span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${
                  index === 0 ? 'bg-red-400' :
                  index === 1 ? 'bg-orange-400' :
                  index === 2 ? 'bg-yellow-400' :
                  index === 3 ? 'bg-green-400' : 'bg-green-500'
                } transition-all rounded`}
                style={{ width: `${((item.count || 0) / Math.max(...ppeViolationsWeek.map(v => v.count || 0), 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Fourth Row for Daily Attendance Rate and Company-wide Safety Score */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* Daily Attendance Rate Chart */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Attendance Rate</h2>
      <p className="text-sm text-gray-500 mb-6">This Week vs Last Week comparison</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="this_week_attendance"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Last Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">This Week</span>
        </div>
      </div>
    </div>

    {/* Company-wide Safety Score */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Company-wide Safety Score</h2>
      <p className="text-sm text-gray-500 mb-6">This week trend with 95% goal line</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safetyComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <ReferenceLine y={95} stroke="#9ca3af" strokeDasharray="4 4" /> {/* 95% goal line */}
            <Line
              type="monotone"
              dataKey="this_week_safety"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-xs text-gray-600">Last Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-600">This Week</span>
        </div>
      </div>
    </div>
  </div>
</div>
        ) : (
          /* Monthly view */
<div className="space-y-6">
  {/* First Row for Summary Cards */}
  <div className="grid grid-cols-4 gap-6 text-left">
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border border-green-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Attendance Rate This Month</span>
        <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-green-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.average_attendance_rate_month || 0}%</div>
        <div className="text-xs text-green-600 font-medium">+5% vs last month</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-green-700">{monthlySummary.average_attendance_rate_month || 0}%</span>
      </div>
      <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
        <div
          className="bg-green-600 h-1.5 rounded-full transition-all"
          style={{ width: `${monthlySummary.average_attendance_rate_month || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Average Safety Compliance</span>
        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.average_safety_rate_month || 0}%</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-blue-700">{monthlySummary.average_safety_rate_month || 0}%</span>
      </div>
      <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${monthlySummary.average_safety_rate_month || 0}%` }}
        ></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Total Employees</span>
        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.total_employees || 0}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-purple-700">100%</span>
      </div>
      <div className="mt-2 w-full bg-purple-200 rounded-full h-1.5">
        <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: "100%" }}></div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm border border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Absent This Month</span>
        <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-700" />
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{monthlySummary.unique_absent_employees_count || 0}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Performance</span>
        <span className="text-xs font-semibold text-orange-700">
          {monthlySummary.total_employees ? Math.round((monthlySummary.unique_absent_employees_count / monthlySummary.total_employees) * 100) : 0}%
        </span>
      </div>
      <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
        <div
          className="bg-orange-600 h-1.5 rounded-full transition-all"
          style={{ width: `${monthlySummary.total_employees ? Math.round((monthlySummary.unique_absent_employees_count / monthlySummary.total_employees) * 100) : 0}%` }}
        ></div>
      </div>
    </div>
  </div>

  {/* Second Row for PPE Compliance Distribution and Needs Improvement */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* PPE Compliance Distribution */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">PPE Compliance Distribution</h2>
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
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-700">
                {item.name === "Fully" ? "Fully Compliant" :
                 item.name === "Partially" ? "Partially Compliant" : "Non-Compliant"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {item.name === "Fully" ? (pieComplianceMonth.month_fully || 0) :
               item.name === "Partially" ? (pieComplianceMonth.month_partial || 0) :
               (pieComplianceMonth.month_non || 0)} ({item.percent || 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Needs Improvement */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">Needs Improvement</h2>
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
    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
            {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.employee_id}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-orange-600">{employee.overall_worn_percent || 0}%</div>
          <div className="text-xs text-gray-500">PPE</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        <span>{employee.violation_count || 0} violations</span>
      </div>
    </div>
  ))}
</div>
    </div>
  </div>

  {/* Third Row for Per Employee Attendance and PPE Violations */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* Per Employee Attendance */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Employee Attendance</h2>
      <p className="text-sm text-gray-500 mb-6">Click on any employee to view details</p>

      <div className="space-y-4">
        {employeeAttendanceMonth.slice(0, 8).map((employee, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-500 font-semibold text-sm">
                {employee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'EMP'}
              </div>
              <div>
                <div className="font-medium text-gray-900">{employee.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500">{employee.employee_id}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{employee.attendance_rate || 0}%</div>
              <div className="text-xs text-gray-500">{employee.days_present || 0}/{employee.total_days || 30} days</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* PPE Violations This Month */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">PPE Violations This Month</h2>
      <p className="text-sm text-gray-500 mb-6">Most common equipment violations</p>

      <div className="space-y-4">
        {ppeViolationsMonth.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 capitalize">{item.item}</span>
              <span className="text-sm font-semibold text-gray-900">{item.count || 0}</span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${
                  index === 0 ? 'bg-red-400' :
                  index === 1 ? 'bg-orange-400' :
                  index === 2 ? 'bg-yellow-400' :
                  index === 3 ? 'bg-green-400' : 'bg-green-500'
                } transition-all rounded`}
                style={{ width: `${((item.count || 0) / Math.max(...ppeViolationsMonth.map(v => v.count || 0), 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Fourth Row for Weekly Attendance Rate and Company-wide Safety Score */}
  <div className="grid grid-cols-2 gap-6 text-left">
    {/* Weekly Attendance Rate Chart */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Rate</h2>
      <p className="text-sm text-gray-500 mb-6">This Month vs Last Month comparison</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceComparisonMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week_number"
              tickFormatter={(weekNum) => `Week ${weekNum}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="this_month_attendance"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e" }}
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
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Last Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">This Month</span>
        </div>
      </div>
    </div>

    {/* Company-wide Safety Score */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Company-wide Safety Score</h2>
      <p className="text-sm text-gray-500 mb-6">Monthly trend with 95% goal line</p>

      {/* Line Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safetyComparisonMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week_number"
              tickFormatter={(weekNum) => `Week ${weekNum}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <ReferenceLine y={95} stroke="#9ca3af" strokeDasharray="4 4" /> {/* 95% goal line */}
            <Line
              type="monotone"
              dataKey="this_month_safety"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-xs text-gray-600">Last Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-600">This Month</span>
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