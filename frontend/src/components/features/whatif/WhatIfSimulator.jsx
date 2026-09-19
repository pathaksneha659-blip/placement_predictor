import React, { useState, useEffect } from "react";
import { 
  FaSlidersH, 
  FaRedoAlt, 
  FaArrowUp, 
  FaArrowDown, 
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";
import { predictPlacement } from "../../../services/api";

const SIMULATOR_FIELDS = [
  { key: "cgpa", label: "CGPA", min: 0.0, max: 10.0, step: 0.1, unit: "" },
  { key: "internships_count", label: "Internships", min: 0, max: 10, step: 1, unit: "" },
  { key: "projects_count", label: "Projects", min: 0, max: 20, step: 1, unit: "" },
  { key: "coding_skill_score", label: "Coding Skill", min: 0, max: 100, step: 1, unit: "/100" },
  { key: "aptitude_score", label: "Aptitude", min: 0, max: 100, step: 1, unit: "/100" },
  { key: "communication_skill_score", label: "Communication", min: 0, max: 100, step: 1, unit: "/100" },
  { key: "logical_reasoning_score", label: "Logical Reasoning", min: 0, max: 100, step: 1, unit: "/100" },
  { key: "mock_interview_score", label: "Mock Interview", min: 0, max: 100, step: 1, unit: "/100" },
  { key: "backlogs", label: "Backlogs", min: 0, max: 10, step: 1, unit: "" },
];

export default function WhatIfSimulator({ currentProfile, currentResult }) {
  const [whatIfProfile, setWhatIfProfile] = useState({ ...currentProfile });
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setWhatIfProfile({ ...currentProfile });
    }
  }, [currentProfile]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await predictPlacement(whatIfProfile);
        setSimulatedResult(res);
      } catch (err) {
        console.error("What-If prediction error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [whatIfProfile]);

  const handleSliderChange = (field, val) => {
    const parsed = parseFloat(val) || 0;
    setWhatIfProfile((prev) => ({
      ...prev,
      [field]: parsed,
    }));
  };

  const resetToCurrent = () => {
    setWhatIfProfile({ ...currentProfile });
  };

  const currentProb = currentResult ? currentResult.placement_probability : 58.0;
  const simulatedProb = simulatedResult ? simulatedResult.placement_probability : currentProb;
  const delta = simulatedProb - currentProb;
  const isPositiveDelta = delta >= 0;

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel p-4 sm:p-6 md:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] shadow-luxury">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 sm:pb-6 border-b border-[#D8C8B5] gap-3 sm:gap-4">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="p-2 sm:p-2.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] flex-shrink-0">
            <FaSlidersH className="text-base sm:text-lg" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#30241D] tracking-tight font-serif">
              What-If Placement Simulator
            </h3>
            <p className="text-[11px] sm:text-xs text-[#756354] mt-0.5">
              Adjust parameters below to evaluate real-time model probability changes without retraining.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToCurrent}
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-card"
        >
          <FaRedoAlt className="text-[10px]" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Probability Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 my-6 sm:my-8 items-stretch">
        {/* Current Profile Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] flex flex-col justify-between text-center shadow-card">
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#756354] mb-1">
              CURRENT PROFILE
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30241D] my-1 sm:my-2 font-mono">
              {currentProb.toFixed(1)}%
            </div>
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${
              currentResult && currentResult.placement_status === "Placed"
                ? "bg-[#71856B]/15 text-[#71856B] border border-[#71856B]/30"
                : "bg-[#A65D5D]/15 text-[#A65D5D] border border-[#A65D5D]/30"
            }`}>
              {currentResult ? currentResult.placement_status : "Placed"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#756354] mt-3 pt-2.5 border-t border-[#D8C8B5]">
            Baseline ML prediction
          </p>
        </div>

        {/* Delta Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] flex flex-col items-center justify-center text-center shadow-card">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#756354] mb-1">
            SIMULATED DIFFERENCE
          </span>
          <div className={`text-2xl sm:text-3xl font-extrabold my-1 sm:my-2 flex items-center space-x-1 font-mono ${
            isPositiveDelta ? "text-[#71856B]" : "text-[#A65D5D]"
          }`}>
            {isPositiveDelta ? <FaArrowUp className="text-base sm:text-lg mr-1" /> : <FaArrowDown className="text-base sm:text-lg mr-1" />}
            <span>{isPositiveDelta ? `+${delta.toFixed(2)}` : delta.toFixed(2)}</span>
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-[#756354]">
            percentage points
          </span>
        </div>

        {/* What-If Simulated Profile Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#9F595B]/40 bg-[#FBF8F2] flex flex-col justify-between text-center relative shadow-card">
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#9F595B] mb-1 flex items-center justify-center space-x-1">
              <span>WHAT-IF PROFILE</span>
              {loading && <FaSpinner className="animate-spin text-xs text-[#9F595B] ml-1" />}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#30241D] my-1 sm:my-2 font-mono">
              {simulatedProb.toFixed(1)}%
            </div>
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${
              simulatedResult && simulatedResult.placement_status === "Placed"
                ? "bg-[#71856B]/15 text-[#71856B] border border-[#71856B]/30"
                : "bg-[#A65D5D]/15 text-[#A65D5D] border border-[#A65D5D]/30"
            }`}>
              {simulatedResult ? simulatedResult.placement_status : "Placed"}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#756354] mt-3 pt-2.5 border-t border-[#D8C8B5]">
            Real-time inference output
          </p>
        </div>
      </div>

      {/* Formal Non-Guaranty Disclaimer Box */}
      <div className="p-3 sm:p-3.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[11px] sm:text-xs text-[#756354] mb-6 sm:mb-8 flex items-start space-x-2.5 leading-relaxed">
        <FaInfoCircle className="text-[#9F595B] text-xs sm:text-sm flex-shrink-0 mt-0.5" />
        <span>
          <strong>Model Inference Disclaimer</strong>: The model's predicted probability changed by{" "}
          <strong className="text-[#30241D]">
            {isPositiveDelta ? `+${delta.toFixed(2)}` : delta.toFixed(2)} percentage points
          </strong>{" "}
          for this simulated profile. Changing inputs does not guarantee an actual campus placement offer.
        </span>
      </div>

      {/* Parameter Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {SIMULATOR_FIELDS.map((field) => {
          const val = whatIfProfile[field.key] !== undefined ? whatIfProfile[field.key] : 0;
          const origVal = currentProfile[field.key] !== undefined ? currentProfile[field.key] : 0;
          const fieldDelta = val - origVal;

          return (
            <div key={field.key} className="glass-card p-3.5 sm:p-4 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-2.5 sm:space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#30241D]">
                  {field.label}
                </label>
                <div className="flex items-center space-x-1 bg-[#F5EFE6] border border-[#D8C8B5] px-2 py-0.5 rounded text-xs">
                  <span className="font-mono font-bold text-[#30241D]">
                    {val}
                  </span>
                  {field.unit && <span className="text-[10px] text-[#756354]">{field.unit}</span>}
                  {fieldDelta !== 0 && (
                    <span className={`text-[10px] font-mono ml-1 ${fieldDelta > 0 ? "text-[#71856B]" : "text-[#A65D5D]"}`}>
                      ({fieldDelta > 0 ? `+${fieldDelta.toFixed(1)}` : fieldDelta.toFixed(1)})
                    </span>
                  )}
                </div>
              </div>

              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={val}
                onChange={(e) => handleSliderChange(field.key, e.target.value)}
                className="w-full h-2 cursor-pointer accent-[#9F595B]"
              />

              <div className="flex justify-between text-[9px] sm:text-[10px] text-[#756354] font-mono">
                <span>Baseline: {origVal}{field.unit}</span>
                <span>Simulated: {val}{field.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
