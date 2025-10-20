import React from 'react';
import { Home, Award, Target, User } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

const EmployeeNavbar = ({ activePage }) => {
  const location = useLocation();
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

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-5xl mx-auto flex justify-around items-center sm:justify-between">

        <Link to="/employee/homepage">
          <button className={`flex flex-col items-center gap-1 ${current === 'Home' ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
            <Home size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Home</span>
          </button>
        </Link>

        <Link to="/employee/reward">
          <button className={`flex flex-col items-center gap-1 ${current === 'Rewards' ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
            <Award size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs font-medium">Rewards</span>
          </button>
        </Link>

        <Link to="/employee/dashboard">
          <button className={`flex flex-col items-center gap-1 ${current === 'Dashboard' ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
            <Target size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Dashboard</span>
          </button>
        </Link>

        <Link to="/employee/profile">
          <button className={`flex flex-col items-center gap-1 ${current === 'Profile' ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'} transition-colors`}>
            <User size={22} className="sm:size-6" />
            <span className="text-[10px] sm:text-xs">Profile</span>
          </button>
        </Link>

      </div>
    </nav>
  );
};

export default EmployeeNavbar;
