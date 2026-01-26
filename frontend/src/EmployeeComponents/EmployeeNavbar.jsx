import React from 'react';
import { Home, Award, Target, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const EmployeeNavbar = ({ activePage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname || "";

  const inferred = path.includes("/employee/reward")
    ? "Rewards"
    : path.includes("/employee/homepage")
    ? "Home"
    : path.includes("/employee/dashboard")
    ? "Dashboard"
    : path.includes("/employee/profile")
    ? "Profile"
    : "Dashboard";

  const current = activePage || inferred;

  const handleLogout = () => {
    localStorage.removeItem("employee_token");
    localStorage.removeItem("employee_data");
    navigate("/employee/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex justify-around items-center sm:justify-between">

        <Link to="/employee/homepage">
          <button className={`flex flex-col items-center gap-1 ${current === 'Home' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} transition-colors`}>
            <Home size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Home</span>
          </button>
        </Link>

        <Link to="/employee/reward">
          <button className={`flex flex-col items-center gap-1 ${current === 'Rewards' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} transition-colors`}>
            <Award size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs font-medium">Rewards</span>
          </button>
        </Link>

        <Link to="/employee/dashboard">
          <button className={`flex flex-col items-center gap-1 ${current === 'Dashboard' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} transition-colors`}>
            <Target size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Dashboard</span>
          </button>
        </Link>

        <Link to="/employee/profile">
          <button className={`flex flex-col items-center gap-1 ${current === 'Profile' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} transition-colors`}>
            <User size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Profile</span>
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <LogOut size={22} className="sm:size-6" />
          <span className="text-[10px] sm:text-xs">Logout</span>
        </button>

      </div>
    </nav>
  );
};

export default EmployeeNavbar;
