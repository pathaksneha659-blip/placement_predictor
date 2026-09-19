import React, { useEffect, useState } from "react";
import { FaBrain, FaServer, FaExternalLinkAlt } from "react-icons/fa";
import { checkHealth } from "../../services/api";

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#9F595B] flex items-center justify-center text-white shadow-card flex-shrink-0">
            <FaBrain className="text-sm sm:text-lg text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-[#30241D] tracking-tight font-serif truncate">
                PlaceIQ
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FBF8F2] text-[#9F595B] border border-[#D8C8B5] flex-shrink-0">
                ML Model
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#756354] hidden sm:block truncate">
              Placement Probability Predictor & Career Platform
            </p>
          </div>
        </div>

        {/* Backend Status Indicator & Swagger Link */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[11px] sm:text-xs">
            <FaServer className="text-[#968576] text-[10px] sm:text-xs flex-shrink-0" />
            <span className="text-[#5B4A3D] hidden lg:inline">API:</span>
            {isBackendHealthy === null ? (
              <span className="flex items-center text-[#968576] space-x-1">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="hidden xs:inline">Connecting</span>
              </span>
            ) : isBackendHealthy ? (
              <span className="flex items-center text-[#71856B] font-semibold space-x-1 sm:space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#71856B]"></span>
                <span className="hidden sm:inline">Online (Port 8000)</span>
                <span className="sm:hidden">Online</span>
              </span>
            ) : (
              <span className="flex items-center text-[#A65D5D] font-semibold space-x-1 sm:space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#A65D5D]"></span>
                <span>Offline</span>
              </span>
            )}
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold text-[#30241D] hover:text-[#9F595B] bg-[#FBF8F2] hover:bg-[#F5EFE6] border border-[#D8C8B5] transition shadow-card flex items-center space-x-1"
          >
            <span className="hidden sm:inline">Swagger Docs</span>
            <span className="sm:hidden">Docs</span>
            <FaExternalLinkAlt className="text-[9px] text-[#756354]" />
          </a>
        </div>
      </div>
    </header>
  );
}
