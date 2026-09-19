import React from "react";
import { FaFire } from "react-icons/fa";
import { NAV_TABS } from "../../constants/predictorConfig";

export default function Navigation({ activeTab, setActiveTab, streak = 0, tabs = NAV_TABS }) {
  return (
    <div className="w-full border-b border-[#D4C4AC] bg-[#E8DCC8] sticky top-14 sm:top-16 z-30 shadow-soft">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between h-12 sm:h-13 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center space-x-1 sm:space-x-1.5 py-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                {Icon && <Icon className="text-xs sm:text-sm flex-shrink-0" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#F5EFE6] border border-[#D4C4AC] text-[#A08B70] text-xs font-bold whitespace-nowrap shadow-card ml-2 flex-shrink-0">
          <FaFire className="text-[#B47876] text-xs" />
          <span className="hidden sm:inline">{streak} Day Streak</span>
          <span className="sm:hidden">{streak}d</span>
        </div>
      </div>
    </div>
  );
}
