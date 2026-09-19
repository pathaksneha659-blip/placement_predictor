import React from "react";
import { FaMagic, FaRedoAlt } from "react-icons/fa";
import { PRESETS } from "../../../constants/predictorConfig";

export default function PresetsBar({ onSelectPreset, onReset }) {
  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-[#D4C4AC] bg-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
      <div className="flex items-center space-x-2 text-xs font-semibold text-[#4A3D30]">
        <FaMagic className="text-[#B47876] text-xs" />
        <span>Quick Candidate Presets:</span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {Object.keys(PRESETS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelectPreset(key)}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#EAE0D2] hover:bg-[#E0D4C0] text-[#4A3D30] border border-[#D4C4AC] transition cursor-pointer font-medium shadow-soft"
          >
            {PRESETS[key].label}
          </button>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#F5EFE6] hover:bg-[#EAE0D2] text-[#685644] hover:text-[#4A3D30] border border-[#D4C4AC] transition flex items-center space-x-1 cursor-pointer shadow-soft"
        >
          <FaRedoAlt className="text-[9px]" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
