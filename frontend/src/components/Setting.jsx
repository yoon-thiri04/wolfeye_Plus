import { useState } from 'react';
import { Home, Users, BarChart3, Settings, Mail, UserCheck, ChevronDown } from 'lucide-react';
import Navbar from "./Navbar.jsx";

function Setting() {
  const [activeTab, setActiveTab] = useState('settings');
  const [formData, setFormData] = useState({
    email: 'yangjonstarcoinc@gmail.com',
    phone: '+959790479290',
    constructionName: 'Yangon Star Construction',
    weeklyDay: 'Friday',
    alertThreshold: '75'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', formData);
  };

  return (
    <div className="min-h-screen bg-white text-left">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Notification Settings
          </h1>
          <p className="text-gray-500">
            Manage your company's identity and details. Keep your profile up to date for better tracking and reporting.
          </p>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <Mail size={20} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number (for SMS)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Construction Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-2 mb-6">
            <UserCheck size={20} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Your Construction Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Construction Name
              </label>
              <input
                type="text"
                name="constructionName"
                value={formData.constructionName}
                onChange={handleInputChange}
                className="w-80 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter your official construction company name.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Weekly Summary Day
              </label>
              <div className="relative w-80">
                <select
                  name="weeklyDay"
                  value={formData.weeklyDay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                When to send weekly attendance reports
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Low Attendance Alert Threshold
              </label>
              <div className="relative w-80">
                <input
                  type="number"
                  name="alertThreshold"
                  value={formData.alertThreshold}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                  min="0"
                  max="100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Send email when employee attendance falls below this percentage
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Settings size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Setting;
