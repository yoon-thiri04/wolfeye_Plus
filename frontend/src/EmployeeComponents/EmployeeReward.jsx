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
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-orange-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Bar */}
      <EmployeeNavbar />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 tracking-tight" style={{ fontFamily: "Plus Jakarta Sans"}}>
            <span className="text-orange-500">Redeem</span> Your
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: "Plus Jakarta Sans"}}>
            Safety Points
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Exchange your safety points for exclusive partner rewards. The more consistent your PPE compliance, the greater your rewards.
          </p>
        </div>

        {/* Points Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-8 sm:p-10 mb-12 relative overflow-hidden max-w-2xl mx-auto shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-[2.5rem]"></div>
          <div className="absolute top-8 right-8 w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shadow-inner">
            <Award className="text-orange-600" size={28} />
          </div>
          
          <p className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
            YOUR AVAILABLE POINTS
          </p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight">
              2,350
            </p>
            <span className="text-orange-500 font-bold text-xl">PTS</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             +120 earned this week
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide justify-center">
          {['All Rewards', 'Café & Food', 'More'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                activeTab === tab
                  ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                  : 'bg-white/60 backdrop-blur-md text-gray-600 border border-white/50 hover:bg-white hover:shadow-md'
              }`}
            >
              {tab === 'Café & Food' ? (
                <Coffee size={18} />
              ) : tab === 'All Rewards' ? (
                <Award size={18} />
              ) : (
                <Gift size={18} />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto text-left mb-20">
          {/* Reward Card 1 */}
          <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img src={reward1} alt="Breakfast Combo" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                City Brew
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">City Brew Breakfast Combo</h3>
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  <Award className="text-orange-500" size={16} />
                  <span className="text-orange-700 font-bold">650</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Start your day right with coffee and a delicious breakfast sandwich. Valid at all downtown locations.
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Available
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/20">
                  Redeem Reward
                </button>
              </div>
            </div>
          </div>

          {/* Reward Card 2 */}
          <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img src={reward2} alt="Safety T-shirt" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                BE Store
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Safety T-shirt</h3>
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  <Award className="text-orange-500" size={16} />
                  <span className="text-orange-700 font-bold">650</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Exclusive branded safety t-shirt with reflective strips and moisture-wicking fabric. Available in all sizes.
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Available
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/20">
                  Redeem Reward
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Partners Section */}
        <section className="text-center px-4 sm:px-0 mb-20">
          <button className="mx-auto mb-8 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
            Show All Partners <ChevronDown size={16} />
          </button>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Our Trusted <span className="text-orange-500">Partners</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-12 text-base leading-relaxed">
            Collaborating with top local brands and cafés to reward workers for staying safe and consistent every day.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 items-center justify-center max-w-4xl mx-auto opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <img src={logo1} alt="Peppermint" className="mx-auto h-12 object-contain hover:scale-110 transition-transform" />
            <img src={logo2} alt="N" className="mx-auto h-12 object-contain hover:scale-110 transition-transform" />
            <img src={logo3} alt="Crop and Highlight" className="mx-auto h-12 object-contain hover:scale-110 transition-transform" />
            <img src={logo4} alt="Millssy" className="mx-auto h-12 object-contain hover:scale-110 transition-transform" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeReward;
