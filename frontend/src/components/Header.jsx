import React, { useEffect, useState } from "react";
import { FaBrain, FaServer } from "react-icons/fa";
import { checkHealth } from "../services/api";

export default function Header() {
  const [isBackendHealthy, setIsBackendHealthy] = useState(null);

  useEffect(() => {
    const verifyApi = async () => {
      try {
        const res = await checkHealth();
        if (res.status === "healthy") {
          setIsBackendHealthy(true);
        } else {
          setIsBackendHealthy(false);
        }
      } catch (err) {
        setIsBackendHealthy(false);
      }
    };
    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8C8B5] bg-[#EDE3D4]/95 backdrop-blur-md shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-[#9F595B] flex items-center justify-center text-white shadow-card">
            <FaBrain className="text-lg text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-[#30241D] tracking-tight font-serif">
                PlaceIQ
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FBF8F2] text-[#9F595B] border border-[#D8C8B5]">
                ML Model
              </span>
            </div>
            <p className="text-xs text-[#756354] hidden sm:block">
              Placement Probability Predictor & Career Platform
            </p>
          </div>
        </div>

        {/* Backend Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-xs">
            <FaServer className="text-[#968576] text-xs" />
            <span className="text-[#5B4A3D] hidden md:inline">API Backend:</span>
            {isBackendHealthy === null ? (
              <span className="flex items-center text-[#968576] space-x-1">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Connecting...</span>
              </span>
            ) : isBackendHealthy ? (
              <span className="flex items-center text-[#71856B] font-semibold space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#71856B]"></span>
                <span>Online (Port 8000)</span>
              </span>
            ) : (
              <span className="flex items-center text-[#A65D5D] font-semibold space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#A65D5D]"></span>
                <span>Offline</span>
              </span>
            )}
          </div>
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg font-semibold text-[#30241D] hover:text-[#9F595B] bg-[#FBF8F2] hover:bg-[#F5EFE6] border border-[#D8C8B5] transition shadow-card"
          >
            Swagger Docs
          </a>
        </div>
      </div>
    </header>
  );
}