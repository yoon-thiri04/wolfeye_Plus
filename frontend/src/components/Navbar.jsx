import React from "react";
import { Home, UserPlus, Settings, PanelTopDashedIcon } from "lucide-react";

const Navbar = () => {
  const currentPath = window.location.pathname;

  const navigateWithToken = (path) => {
    const companyToken = localStorage.getItem('company_token');
    const companyUser = localStorage.getItem('company_user');

    // Ensure tokens are properly stored for the target page
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

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigateWithToken("/")}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              currentPath === "/" 
                ? "text-orange-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Home</span>
          </button>
            <button
            onClick={() => navigateWithToken("/add")}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              currentPath === "/add" 
                ? "text-orange-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-sm">Enroll Employee</span>
          </button>
          <button
            onClick={() => navigateWithToken("/company/dashboard")}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              currentPath === "/company/dashboard" 
                ? "text-orange-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <PanelTopDashedIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Employee Dashboard</span>
          </button>
          <button
            onClick={() => navigateWithToken("/company/setting")}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              currentPath === "/company/setting" 
                ? "text-orange-500" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;