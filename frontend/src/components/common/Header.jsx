import React, { useEffect, useState, useRef } from "react";
import { FaBrain, FaServer, FaExternalLinkAlt } from "react-icons/fa";
import { checkHealth, DOCS_URL, subscribeApiStatus } from "../../services/api";

const MAX_CONNECTING_RETRIES = 8; // ~32-35s grace period for Render cold boot

export default function Header() {
  // Status states: "connecting" | "online" | "offline"
  const [status, setStatus] = useState("connecting");
  const failureCountRef = useRef(0);
  const isMountedRef = useRef(true);

  const runHealthCheck = async () => {
    try {
      const res = await checkHealth();
      if (!isMountedRef.current) return;
      if (res?.status === "healthy" || res?.model_loaded === true) {
        failureCountRef.current = 0;
        setStatus("online");
      } else {
        throw new Error("Unexpected health response");
      }
    } catch {
      if (!isMountedRef.current) return;
      failureCountRef.current += 1;
      // Only transition to offline if we exceeded all retries (genuine backend failure)
      if (failureCountRef.current >= MAX_CONNECTING_RETRIES) {
        setStatus("offline");
      } else {
        // While retrying during cold start, stay in "connecting"
        setStatus((prev) => (prev === "online" ? "connecting" : prev));
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    let timerId = null;

    // Listen to real application events (e.g., successful /predict call confirms backend online)
    const unsubscribe = subscribeApiStatus((newStatus) => {
      if (isMountedRef.current && newStatus === "online") {
        failureCountRef.current = 0;
        setStatus("online");
      }
    });

    const poll = async () => {
      await runHealthCheck();
      if (isMountedRef.current) {
        // Poll every 4s while connecting/offline (rapid detection of wake-up);
        // throttle to 15s once confirmed online.
        const delay = failureCountRef.current === 0 ? 15000 : 4000;
        timerId = setTimeout(poll, delay);
      }
    };

    poll();

    return () => {
      isMountedRef.current = false;
      unsubscribe();
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleBadgeClick = () => {
    failureCountRef.current = 0;
    setStatus("connecting");
    runHealthCheck();
  };

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
          <div
            onClick={handleBadgeClick}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[11px] sm:text-xs font-semibold cursor-pointer hover:bg-[#F5EFE6] transition shadow-card"
            title={
              status === "online"
                ? "Backend connected and healthy"
                : status === "connecting"
                ? "Connecting to backend service (waking up if sleeping)... Click to re-check."
                : "Backend unreachable after retries. Click to retry."
            }
          >
            <FaServer className="text-[#968576] text-[10px] sm:text-xs flex-shrink-0" />
            {status === "online" ? (
              <span className="flex items-center text-[#71856B] space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#71856B]"></span>
                <span>API Online</span>
              </span>
            ) : status === "connecting" ? (
              <span className="flex items-center text-amber-700 space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Connecting...</span>
              </span>
            ) : (
              <span className="flex items-center text-[#A65D5D] space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#A65D5D]"></span>
                <span>API Offline</span>
              </span>
            )}
          </div>

          <a
            href={DOCS_URL}
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
