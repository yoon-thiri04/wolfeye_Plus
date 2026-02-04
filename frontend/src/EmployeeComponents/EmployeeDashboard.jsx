import React, { useState, useEffect } from "react";
import { 
  Building, Calendar, MapPin, Gift, BarChart3, Check, X, 
  AlertTriangle, Eye, LucideBookCheck, HardHat, Shield, 
  Glasses, Ear, TrendingUp, Activity, Award, ChevronRight 
} from "lucide-react";
import EmployeeNavbar from "./EmployeeNavbar.jsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const EmployeeDashboard = () => {
  const [activeDetectionTab, setActiveDetectionTab] = useState("daily");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("employee_token");

      if (!token) {
        window.location.href = "/employee/login";
        return;
      }

      const response = await axios.get("/api/employee/dashboard", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response)
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (err.response && err.response.status === 401) {
        window.location.href = "/employee/login";
      } else {
        setError("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50/50 flex flex-col">
        <EmployeeNavbar activePage="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50/50 flex flex-col">
        <EmployeeNavbar activePage="Dashboard" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { employee, company, attendance, ppe } = dashboardData;
  const currentDate = new Date();
  
  // Calculate stats for cards
  const attendanceRate = parseFloat(attendance.monthly_average) || 0;
  
  const currentWeekData = ppe.weekly_summary?.[getWeekNumber(currentDate)];
  let safetyScore = 0;

  if (currentWeekData?.safety_score !== undefined) {
    safetyScore = currentWeekData.safety_score;
  } else if (currentWeekData) {
    // Fallback: Calculate from violations assuming 5 PPE items per day
    const totalChecks = (currentWeekData.days_count || 0) * 5;
    const violations = currentWeekData.violations || 0;
    if (totalChecks > 0) {
      safetyScore = Math.max(0, ((totalChecks - violations) / totalChecks) * 100);
    }
  }


  // Chart Data Preparation
  const weeklyData = ppe.weekly_summary[getWeekNumber(currentDate)] || {};
  const violationsData = weeklyData.bar_chart_data 
    ? Object.entries(weeklyData.bar_chart_data).map(([name, value]) => ({
        name: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        value: value
      }))
    : [];

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      <EmployeeNavbar activePage="Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, <span className="text-orange-600">{employee.name}</span>
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {company.name} • {company.plan} Plan
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className="text-gray-600 font-medium">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Points Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg shadow-orange-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-white/90">Total Safety Points</span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold">{employee.total_point}</span>
                <span className="text-sm text-white/80 mb-1.5">pts</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-white rounded-full h-1.5 transition-all duration-1000"
                  style={{ width: `${Math.min((employee.total_point / 10000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white/80">
                <span>Progress to Level 2</span>
                <span>10,000 pts</span>
              </div>
            </div>
          </motion.div>

          {/* Attendance Rate Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-medium text-gray-600">Attendance Rate</span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                attendanceRate >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {attendanceRate >= 90 ? 'Excellent' : 'Average'}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">{attendanceRate}%</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {attendance.present_count} Present
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                {attendance.absent_count} Absent
              </span>
            </div>
          </motion.div>

          {/* Safety Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-600">Safety Score</span>
              </div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">{safetyScore}</span>
              <span className="text-sm text-gray-500 mb-1">/ 100</span>
            </div>
            <p className="text-sm text-gray-500">
              Based on PPE compliance this week. Keep it up!
            </p>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Attendance Calendar */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Attendance Calendar</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Present</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Absent</span>
                </div>
              </div>
              
              <CalendarView attendance={attendance} currentYear={currentDate.getFullYear()} currentMonth={currentDate.getMonth()} />
            </motion.div>

            {/* PPE Detection Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">PPE Compliance Analysis</h2>
                  <p className="text-sm text-gray-500">Track your safety equipment usage</p>
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveDetectionTab("daily")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeDetectionTab === "daily" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Weekly Summary
                  </button>
                  <button
                    onClick={() => setActiveDetectionTab("weekly")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeDetectionTab === "weekly" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Today's Status
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeDetectionTab === "daily" ? (
                  <motion.div
                    key="weekly-summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-700">Total Violations</span>
                        </div>
                        <p className="text-2xl font-bold text-red-800">{weeklyData.violations || 0}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Eye className="w-5 h-5 text-orange-500" />
                          <span className="font-medium text-orange-700">Most Missed Item</span>
                        </div>
                        <p className="text-lg font-bold text-orange-800 truncate">
                          {weeklyData.most_missed_item ? weeklyData.most_missed_item.replace(/_/g, ' ').toUpperCase() : 'None'}
                        </p>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      {violationsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={violationsData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip 
                              cursor={{ fill: '#F3F4F6' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                          No violations recorded this week
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="today-status"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Today's Score</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-800">{ppe.today_point || 0} pts</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ppe.today_status && Object.entries(ppe.today_status).map(([key, value]) => (
                        <div key={key} className={`p-4 rounded-xl border flex items-center justify-between ${
                          value ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                        }`}>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          {value ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Rewards & Actions */}
          <div className="space-y-8">
             <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-fit"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Award className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="font-medium">Redeem Rewards</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <HardHat className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="font-medium">Report Issue</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                </button>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-2">Safety Tip</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                Always ensure your helmet fits snugly. A loose helmet provides significantly less protection in case of impact.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Shield className="w-4 h-4" />
                <span>Daily Recommendation</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Functions
const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  console.log('target', target)
  const dayNr = (date.getDay() + 6) % 7;
  console.log('dayNr', dayNr)
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  console.log('firstThursday', firstThursday)
  target.setMonth(0, 1);
  console.log('target', target)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
};

const CalendarView = ({ attendance, currentYear, currentMonth }) => {
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  
  // Adjust for Monday start if needed
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; 

  const days = [];
  for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getDayStatus = (day) => {
    if (!day) return null;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = attendance.calender.find(a => a.date === dateStr);
    
    // Check if future
    const checkDate = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (checkDate > today) return "future";
    if (!record) return "absent"; 
    
    if (record) return record.present ? "present" : "absent";
    return "no-data";
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="aspect-square"></div>;
          
          const status = getDayStatus(day);
          let bgClass = "bg-gray-50 text-gray-400"; // Future/No data
          
          if (status === "present") bgClass = "bg-green-100 text-green-700 font-bold border border-green-200";
          if (status === "absent") bgClass = "bg-red-100 text-red-700 font-bold border border-red-200";
          if (status === "no-data") bgClass = "bg-gray-50 text-gray-400";

          const isToday = day === new Date().getDate();

          return (
            <div key={day} className={`aspect-square rounded-xl flex items-center justify-center text-sm transition-all ${bgClass} ${isToday ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeDashboard;