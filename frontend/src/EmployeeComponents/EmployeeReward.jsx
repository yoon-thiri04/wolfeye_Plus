import React, { useState } from 'react';
import { Home, Award, Target, User, Coffee, Gift, ChevronDown } from 'lucide-react';
import reward1 from "../assets/images/reward1.png";
import reward2 from "../assets/images/reward2.png";
import logo1 from "../assets/images/brand_logo1.png";
import logo2 from "../assets/images/brand_logo6.png";
import logo3 from "../assets/images/brand_logo5.png";
import logo4 from "../assets/images/brand_logo4.png";
import EmployeeNavbar from "./EmployeeNavbar.jsx";

const EmployeeReward = () => {
  const [activeTab, setActiveTab] = useState('All Rewards');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Bar */}
        <EmployeeNavbar />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: "Plus Jakarta Sans"}}>
            <span className="text-yellow-500">Redeem</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: "Plus Jakarta Sans"}}>
            Your Safety Points
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Exchange your safety points for exclusive partner rewards. The more consistent your PPE compliance, the greater your rewards.
          </p>
        </div>

        {/* Points Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-5 sm:p-8 mb-8 sm:mb-12 relative overflow-hidden max-w-2xl mx-auto shadow-2xl">
          <div className="absolute top-6 right-6 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Award className="text-yellow-500 sm:size-7" size={22} />
          </div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide mb-3">
            YOUR POINTS
          </p>
          <p className="text-4xl sm:text-6xl font-bold text-yellow-500 mb-2">
            2,350
          </p>
          <p className="text-gray-400 text-sm sm:text-lg">
            +120 earned this week
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide justify-center sm:justify-start">
          {['All Rewards', 'Café & Food', 'More'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full whitespace-nowrap transition-colors text-sm sm:text-base ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab === 'Café & Food' ? (
                <Coffee size={16} className="sm:size-5" />
              ) : (
                <Gift size={16} className="sm:size-5" />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto text-left mb-16">
          {/* Reward Card 1 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-52 sm:h-72 bg-gray-200">
              <img src={reward1} alt="Breakfast Combo" className="w-full h-full object-cover" />
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-yellow-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                CITY BREW
              </p>
              <h3 className="text-lg sm:text-2xl text-gray-900 mb-3">City Brew Breakfast Combo</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 leading-relax">
                Start your day right with coffee and a delicious breakfast sandwich.
              </p>

              <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-20">
                <div className="flex items-center gap-2">
                  <Award className="text-yellow-500 sm:size-6" size={20} />
                  <span className="text-yellow-500 font-bold text-lg sm:text-xl">650</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 text-sm sm:text-base font-medium">
                    Available to redeem
                  </span>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white font-semibold py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base">
                Redeem
              </button>
            </div>
          </div>

          {/* Reward Card 2 */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-52 sm:h-72 bg-gray-200">
              <img src={reward2} alt="Safety T-shirt" className="w-full h-full object-cover" />
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-yellow-500 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                BE STORE
              </p>
              <h3 className="text-lg sm:text-2xl text-gray-900 mb-3">Safety T-shirt</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8 leading-relax">
                Exclusive branded safety t-shirt with reflective strips and moisture-wicking fabric.
              </p>

              <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-20">
                <div className="flex items-center gap-2">
                  <Award className="text-yellow-500 sm:size-6" size={20} />
                  <span className="text-yellow-500 font-bold text-lg sm:text-xl">650</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 text-sm sm:text-base font-medium">
                    Available to redeem
                  </span>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white font-semibold py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base">
                Redeem
              </button>
            </div>
          </div>
        </div>

        {/* Trusted Partners Section */}
        <section className="text-center px-4 sm:px-0 mb-20">
          {/* Show All Button */}
          <button className="mx-auto mb-6 px-6 py-2 rounded-full border border-gray-300 text-gray-700 text-sm sm:text-base flex items-center gap-2 hover:bg-gray-50 transition">
            Show All <ChevronDown size={16} />
          </button>

          {/* Title and Subtitle */}
          <h2 className="text-2xl sm:text-4xl font-bold mb-3">
            Our Trusted <span className="text-yellow-500">Partners</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-12 text-sm sm:text-base leading-relaxed">
            Collaborating with top local brands and cafés to reward workers for staying safe and consistent every day.
          </p>

          {/* Partner Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 items-center justify-center max-w-3xl mx-auto">
            <img src={logo1} alt="Peppermint" className="mx-auto w-28 sm:w-36 object-contain" />
            <img src={logo2} alt="N" className="mx-auto w-28 sm:w-36 object-contain" />
            <img src={logo3} alt="Crop and Highlight" className="mx-auto w-28 sm:w-36 object-contain" />
            <img src={logo4} alt="Millssy" className="mx-auto w-28 sm:w-36 object-contain" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeReward;
