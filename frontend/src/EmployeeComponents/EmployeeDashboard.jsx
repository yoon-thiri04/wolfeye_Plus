import React, { useState, useEffect } from "react";
import { Building, Calendar, MapPin, Gift, BarChart3, Check, X, AlertTriangle, Eye, LucideBookCheck, HardHat, Shield, Glasses, Ear } from "lucide-react";
import EmployeeNavbar from "./EmployeeNavbar.jsx";
import axios from "axios";

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

      const response = await axios.get("http://localhost:8000/employee/dashboard", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <EmployeeNavbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <EmployeeNavbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!dashboardData) {
    return (
      <>
        <EmployeeNavbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
      </>
    );
  }

  const { employee, company, attendance, ppe } = dashboardData;

  // Get current month and year for calendar
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Calculate calendar days
  const getCalendarDays = () => {
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentDate.getMonth(), 1).getDay();

  const days = [];

  // Add empty days for the first week
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const attendanceRecord = attendance.calender.find(a => a.date === dateStr);
    const dayDate = new Date(currentYear, currentDate.getMonth(), i);
    const isFuture = dayDate > currentDate;
    const hasData = !!attendanceRecord;

    days.push({
      day: i,
      present: attendanceRecord ? attendanceRecord.present : false,
      isToday: i === currentDate.getDate() && currentDate.getMonth() === currentDate.getMonth(),
      isFuture: isFuture,
      hasData: hasData
    });
  }

  return days;
};

  const calendarDays = getCalendarDays();

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const currentWeek = getWeekNumber(currentDate);
  const weeklyData = ppe.weekly_summary[currentWeek] || {};

  return (
    <>
      <EmployeeNavbar />
      <div className="min-h-screen bg-white flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Safety Performance Overview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Safety Performance <span className="text-yellow-600">Overview</span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 text-left">
              Your daily and weekly safety points are calculated from real-time PPE detections using webcam checks.
              Keep your gear complete to boost your score and earn rewards.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between bg-yellow-50 rounded-xl p-3">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <Building className="w-4 h-4 text-yellow-600" />
                  Assigned Company:
                </span>
                <span className="font-semibold text-gray-900">
                  {company.name}
                </span>
              </div>

              <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Plan:
                </span>
                <span className="font-semibold text-gray-900">
                  {company.plan}
                </span>
              </div>

              <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Employee:
                </span>
                <span className="font-semibold text-gray-900">
                  {employee.name}
                </span>
              </div>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-400 to-orange-400 text-white shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Your Rewards</h2>
            <p className="text-sm text-white/90 mb-6">
              Track your safety points and progress
            </p>

            <div className="relative mb-10 mt-10">
              <div className="relative bg-yellow-500 rounded-full p-8 shadow-xl border-8 border-yellow-400/50">
                <div className="absolute inset-4 bg-yellow-300/20 rounded-full"></div>

                <div className="text-center relative z-10">
                  <div className="text-5xl font-extrabold text-white mb-1">{employee.total_point}</div>
                  <div className="text-white/90 text-sm font-medium">Total Safety Points</div>
                </div>
              </div>
            </div>

            <div className="mb-6 border border-white/40 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-white/90 mb-1">
                <span>Next Level</span>
                <span>{employee.total_point} / 10000 pts</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: `${Math.min((employee.total_point / 10000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-white text-orange-600 font-semibold py-3 rounded-xl shadow hover:bg-gray-100 transition">
              <Gift className="w-5 h-5" />
              Redeem Rewards
            </button>
          </div>


          {/* Calendar */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
  <div className="flex justify-between items-center mb-4">
    <button className="text-gray-400 text-sm">&lt;</button>
    <h3 className="text-lg font-semibold text-gray-800">{currentMonth} {currentYear}</h3>
    <button className="text-gray-400 text-sm">&gt;</button>
  </div>

  {/* Separator */}
  <div className="flex items-center my-6">
    <hr className="flex-grow border-gray-300" />
    <hr className="flex-grow border-gray-300" />
  </div>

  <div className="grid grid-cols-7 text-center text-sm text-gray-600 mb-2">
    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
      <div key={d}>{d}</div>
    ))}
  </div>

  <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
    {calendarDays.map((day, i) => {
      if (!day) {
        return <div key={i} className="text-gray-300"></div>;
      }

      const dayDate = new Date(currentYear, currentDate.getMonth(), day.day);
      const isFutureDay = dayDate > currentDate;
      const isToday = day.day === currentDate.getDate() && currentDate.getMonth() === currentDate.getMonth();
      const hasAttendanceData = day.hasData;

      let bgColor = '';
      let textColor = 'text-gray-900';

      if (isFutureDay) {
        bgColor = '';
        textColor = 'text-gray-400';
      } else if (!hasAttendanceData) {
        bgColor = '';
        textColor = 'text-gray-600';
      } else if (day.present) {
        bgColor = 'bg-green-700';
        textColor = 'text-white';
      } else {
        bgColor = 'bg-red-600';
        textColor = 'text-white';
      }

      return (
        <div
          key={i}
          className={`${bgColor} ${textColor} ${(hasAttendanceData && !isFutureDay) ? 'font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''} ${isToday ? '' : ''}`}
        >
          {day.day}
        </div>
      );
    })}
  </div>

  {/* Separator */}
  <div className="flex items-center my-6">
    <hr className="flex-grow border-gray-300" />
    <hr className="flex-grow border-gray-300" />
  </div>

            <div className="flex justify-center gap-6 text-xs text-gray-600 mt-9">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span> Present
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span> Absent
              </div>
            </div>
          </div>

          {/* Attendance Stats Cards */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-900 text-white shadow-md p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div><BarChart3 className="w-5 h-5 text-white/80" /></div>
              <h4 className="font-semibold">Attendance Rate</h4>
            </div>
            <div className="text-4xl font-extrabold mb-1">{attendance.monthly_average}%</div>
            {/* Separator */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200" />
              <hr className="flex-grow border-gray-300" />
            </div>
            <p className="text-white/90 text-sm">Monthly average performance</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-400 to-green-900 text-white shadow-md p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-5 h-5 text-white/80" />
              <h4 className="font-semibold">Present Days</h4>
            </div>
            <div className="text-4xl font-extrabold mb-1">{attendance.present_count}</div>
            {/* Separator */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200" />
              <hr className="flex-grow border-gray-300" />
            </div>

            <p className="text-white/90 text-sm">Days successfully attended</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-red-400 to-red-900 text-white shadow-md p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <X className="w-5 h-5 text-white/80" />
              <h4 className="font-semibold">Absent Days</h4>
            </div>
            <div className="text-4xl font-extrabold mb-1">{attendance.absent_count}</div>

            {/* Separator */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-200" />
              <hr className="flex-grow border-gray-300" />
            </div>

            <p className="text-white/90 text-sm">Days missed this month</p>
          </div>

          {/* Safety Equipment Detection Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Safety Equipment Detection</h2>
            <p className="text-sm text-gray-500 mb-4">
              Track your PPE compliance and earn points for wearing proper safety gear
            </p>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-6">
              <button
                onClick={() => setActiveDetectionTab("daily")}
                className={`flex-1 text-sm px-4 py-1.5 rounded-full transition-colors ${
                  activeDetectionTab === "daily" 
                    ? 'bg-white text-gray-900 font-medium shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Daily Detection
              </button>
              <button
                onClick={() => setActiveDetectionTab("weekly")}
                className={`flex-1 text-sm px-4 py-1.5 rounded-full transition-colors ${
                  activeDetectionTab === "weekly" 
                    ? 'bg-white text-gray-900 font-medium shadow-sm' 
                    : 'text-gray-600'
                }`}
              >
                Weekly Summary
              </button>
            </div>

            {activeDetectionTab === "daily" ? (
              /* Daily Detection Content */
              <div className="bg-gradient-to-b from-white to-orange-50 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">PPE Compliance Analysis</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Which safety equipment you're missing most often this week
                </p>

                <div className="space-y-4">
                  {/* First Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Total Violations */}
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
                        <div className="text-sm font-semibold text-red-700">Total Violations</div>
                        <div className="text-xl font-bold text-red-800 mt-1">{weeklyData.violations || 0}</div>
                      </div>
                    </div>

                    {/* Working Days */}
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-5 h-5 text-yellow-600 mb-2" />
                        <div className="text-sm font-semibold text-yellow-700">Working Days</div>
                        <div className="text-xl font-bold text-yellow-800 mt-1">{weeklyData.days_count || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Second Row - Most Missed items */}
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                    <div className="flex flex-col items-center">
                      <Eye className="w-5 h-5 text-red-600 mb-2" />
                      <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Most Missed</span>
                      <span className="text-lg font-semibold text-red-700 mt-1">
                        {weeklyData.most_missed_item ? weeklyData.most_missed_item.replace('_', ' ').toUpperCase() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bar Chart */}
{weeklyData.bar_chart_data && Object.keys(weeklyData.bar_chart_data).length > 0 && (
  <div className="bg-white rounded-xl p-4 mt-4">
    <h4 className="text-sm text-gray-700 font-medium mb-2">Times Missed</h4>
    <div className="h-40 flex items-end justify-around">
      {Object.entries(weeklyData.bar_chart_data).map(([item, count], index) => (
        <div key={item} className="flex flex-col items-center">
          <div
            className="w-6 bg-red-500 rounded-t"
            style={{ height: `${Math.min(count * 10, 70)}px` }}
          ></div>
          <span className="text-xs text-gray-600 mt-10 transform -rotate-45 origin-top-left whitespace-nowrap">
            {item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('Ear protection', 'Ear')}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
                {/* Focus Area */}
                {weeklyData.most_missed_item && (
                  <div className="bg-red-50 p-4 rounded-xl mt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 text-lg">⚠️</span>
                      <p className="text-sm text-gray-700">
                        {weeklyData.most_missed_item.replace('_', ' ')} was missed {weeklyData.bar_chart_data?.[weeklyData.most_missed_item] || 0} times. Remember to wear it every day!
                      </p>
                    </div>
                  </div>
                )}

                {/* Best Compliance */}
                {weeklyData.best_compliance_item && (
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-lg"><LucideBookCheck /></span>
                      <p className="text-sm text-gray-700">
                        {weeklyData.best_compliance_item.replace('_', ' ')} – Great compliance this week!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Weekly Summary Content */
              <div className="space-y-6">
                {/* Today's PPE Detection Results */}
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
    <h3 className="text-sm font-semibold text-gray-800">
      Today's PPE Detection Results
    </h3>

    {/* Points section */}
    <div className="text-sm sm:text-sm font-bold text-gray-900 mt-1 sm:mt-0 bg-yellow-500 w-[120px] p-1 rounded-full text-center">
      {ppe.today_point || 0} <span className="text-gray-500 text-sm">/ 45 points</span>
    </div>
  </div>

  <div className="text-sm text-gray-500 text-center sm:text-left">
    Real-time safety equipment detection
  </div>



                  {/* Bar Chart */}
{ppe.today_status && Object.keys(ppe.today_status).length > 0 && (
  <div className="relative h-56 mb-6">
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-6">
      {/* Y-axis labels + grid lines */}
      <div className="flex flex-col justify-between h-48 text-[11px] text-gray-400 absolute left-0 top-0 w-full">
        {[12, 9, 6, 3, 0].map((val) => (
          <div key={val} className="flex items-center">
            <span className="w-6 text-right mr-1">{val}</span>
            <div className="border-t border-gray-200 flex-1"></div>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex justify-around w-full ml-8 items-end z-10">
        {Object.entries(ppe.today_status).map(([item, status]) => (
          <div key={item} className="flex flex-col items-center">
            <div
              className={`w-8 sm:w-10 rounded-md transition-all duration-300 ${
                status ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ height: `${status ? 96 : 32}px` }}
            ></div>
            <span className="text-[11px] text-gray-700 mt-2 text-center">
              {item
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace('Ear protection', 'Ear')}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
</div>

                {/* Detection Results List */}
                <div className="space-y-3">
                  {ppe.today_status && Object.entries(ppe.today_status).map(([item, status]) => {
                    const itemIcons = {
                      helmet: HardHat,
                      vest: Shield,
                      gloves: Shield,
                      glasses: Glasses,
                      ear_protection: Ear
                    };

                    const IconComponent = itemIcons[item] || Shield;
                    const points = status ? 20 : 0;

                    return (
                      <div key={item} className={`flex items-center justify-between ${status ? 'bg-green-50' : 'bg-red-50'} p-3 rounded-xl`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${status ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-4 h-4 ${status ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              {status ? ' +20 Points' : ' Missing'}
                            </div>
                          </div>
                        </div>
                        <div className={`${status ? 'text-green-600' : 'text-red-600'} font-semibold text-sm`}>
                          {status ? '+20 Points' : '0 Points'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Message */}
                {ppe.items_missed && ppe.items_missed.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        You missed {ppe.items_missed.join(', ')} today — wear all PPE to earn full points!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;