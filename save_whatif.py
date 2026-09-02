content = """import React, { useState, useEffect, useRef } from "react";
import { 
  FaSlidersH, 
  FaArrowUp, 
  FaArrowDown, 
  FaEquals, 
  FaMagic, 
  FaRedoAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaLightbulb,
  FaInfoCircle,
  FaGraduationCap,
  FaBriefcase,
  FaLaptopCode,
  FaChartLine,
  FaComments,
  FaBrain,
  FaExclamationTriangle
} from "react-icons/fa";
import { predictPlacement } from "../services/api";

const SIMULATED_FIELDS = [
  { name: "cgpa", label: "CGPA", min: 0.0, max: 10.0, step: 0.1, unit: "", icon: FaGraduationCap },
  { name: "coding_skill_score", label: "Coding Skill Score", min: 0, max: 100, step: 1, unit: "/100", icon: FaLaptopCode },
  { name: "aptitude_score", label: "Aptitude Score", min: 0, max: 100, step: 1, unit: "/100", icon: FaChartLine },
  { name: "projects_count", label: "Projects Completed", min: 0, max: 20, step: 1, unit: "", icon: FaLaptopCode },
  { name: "internships_count", label: "Internships Completed", min: 0, max: 10, step: 1, unit: "", icon: FaBriefcase },
  { name: "mock_interview_score", label: "Mock Interview Score", min: 0, max: 100, step: 1, unit: "/100", icon: FaCheckCircle },
  { name: "communication_skill_score", label: "Communication Skill Score", min: 0, max: 100, step: 1, unit: "/100", icon: FaComments },
  { name: "logical_reasoning_score", label: "Logical Reasoning Score", min: 0, max: 100, step: 1, unit: "/100", icon: FaBrain },
  { name: "backlogs", label: "Active Backlogs", min: 0, max: 10, step: 1, unit: "", icon: FaExclamationTriangle },
];

export default function WhatIfSimulator({ currentProfile, currentResult }) {
  const [simulatedProfile, setSimulatedProfile] = useState({ ...currentProfile });
  const [simulatedResult, setSimulatedResult] = useState(currentResult);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Sync if currentProfile changes
  useEffect(() => {
    setSimulatedProfile({ ...currentProfile });
    setSimulatedResult(currentResult);
  }, [currentProfile, currentResult]);

  // Debounced API call whenever simulatedProfile changes
  const handleSliderChange = (field, value) => {
    const parsed = value === "" ? 0 : parseFloat(value);
    const updated = { ...simulatedProfile, [field]: parsed };
    setSimulatedProfile(updated);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await predictPlacement(updated);
        setSimulatedResult(res);
      } catch (err) {
        console.error("Simulation prediction error:", err);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const applyScenario = (patch) => {
    const updated = { ...simulatedProfile, ...patch };
    setSimulatedProfile(updated);
    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await predictPlacement(updated);
        setSimulatedResult(res);
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        setLoading(false);
      }
    }, 150);
  };

  const resetToCurrent = () => {
    setSimulatedProfile({ ...currentProfile });
    setSimulatedResult(currentResult);
  };

  const currentProb = currentResult ? currentResult.placement_probability : 50;
  const simProb = simulatedResult ? simulatedResult.placement_probability : currentProb;
  const delta = Math.round((simProb - currentProb) * 100) / 100;
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  return (
    <div className="w-full mt-10 space-y-8 animate-fadeIn">
      {/* Header & Feature Title */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/70 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              <FaSlidersH />
              <span>Interactive Sensitivity Analysis</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What-If Placement Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Simulate hypothetical improvements in your skills, internships, and academics to explore how the model's prediction changes in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={resetToCurrent}
            className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center space-x-2 cursor-pointer"
          >
            <FaRedoAlt className="text-[10px]" />
            <span>Reset to Current Profile</span>
          </button>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center space-x-1">
            <FaMagic className="text-indigo-400 text-xs" />
            <span>Quick Scenarios:</span>
          </span>
          <button
            type="button"
            onClick={() => applyScenario({ coding_skill_score: Math.min(simulatedProfile.coding_skill_score + 15, 100) })}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 transition"
          >
            +15 Coding Skill
          </button>
          <button
            type="button"
            onClick={() => applyScenario({ internships_count: simulatedProfile.internships_count + 1 })}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700/80 transition"
          >
            +1 Internship
          </button>
          <button
            type="button"
            onClick={() => applyScenario({ projects_count: Math.min(simulatedProfile.projects_count + 2, 20) })}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700/80 transition"
          >
            +2 Projects
          </button>
          <button
            type="button"
            onClick={() => applyScenario({ backlogs: 0 })}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700/80 transition"
          >
            Clear All Backlogs (0)
          </button>
          <button
            type="button"
            onClick={() => applyScenario({ mock_interview_score: 85, coding_skill_score: 85, aptitude_score: 85 })}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/80 transition"
          >
            Target 85+ All Tests
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Current Profile Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/60 text-center relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Current Profile
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-200 tracking-tight my-2 font-mono">
            {currentProb.toFixed(2)}%
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 bg-slate-800 text-slate-300 border border-slate-700">
            Status: {currentResult.placement_status}
          </span>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div
              className="bg-slate-400 h-full rounded-full"
              style={{ width: `${currentProb}%` }}
            />
          </div>
        </div>

        {/* Delta Comparison Box */}
        <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 to-indigo-950/40 text-center flex flex-col items-center justify-center relative shadow-xl shadow-indigo-950/40">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Model Prediction Delta
          </span>

          <div className="flex items-center justify-center space-x-2 my-2">
            {loading ? (
              <FaSpinner className="text-3xl text-indigo-400 animate-spin" />
            ) : isPositive ? (
              <div className="flex items-center space-x-2 text-emerald-400">
                <FaArrowUp className="text-2xl animate-bounce" />
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                  +{delta.toFixed(2)}%
                </span>
              </div>
            ) : isNegative ? (
              <div className="flex items-center space-x-2 text-rose-400">
                <FaArrowDown className="text-2xl animate-bounce" />
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                  {delta.toFixed(2)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-slate-400">
                <FaEquals className="text-xl" />
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                  0.00%
                </span>
              </div>
            )}
          </div>

          <span className={`text-xs font-bold px-3 py-0.5 rounded-full mt-1 ${
            isPositive
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : isNegative
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}>
            {isPositive ? `+${delta.toFixed(2)} percentage points` : isNegative ? `${delta.toFixed(2)} percentage points` : "Baseline Match"}
          </span>

          {/* Mandatory Formal Wording */}
          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed max-w-xs">
            The model's predicted probability changed by{" "}
            <strong className="text-white font-mono">{Math.abs(delta).toFixed(2)} percentage points</strong> for this simulated profile.
          </p>
        </div>

        {/* What-If Profile Card */}
        <div className={`glass-card p-6 rounded-3xl border text-center relative overflow-hidden transition ${
          isPositive
            ? "border-emerald-500/40 bg-emerald-950/15"
            : isNegative
            ? "border-rose-500/40 bg-rose-950/15"
            : "border-slate-800 bg-slate-900/60"
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 block mb-1">
            What-If Profile
          </span>
          <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight my-2 font-mono ${
            isPositive ? "text-emerald-400" : isNegative ? "text-rose-400" : "text-white"
          }`}>
            {simProb.toFixed(2)}%
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 border ${
            simulatedResult && simulatedResult.placement_status === "Placed"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
          }`}>
            Status: {simulatedResult ? simulatedResult.placement_status : currentResult.placement_status}
          </span>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isPositive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-rose-500 to-amber-500"
              }`}
              style={{ width: `${simProb}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Input Sliders Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FaSlidersH className="text-cyan-400" />
            <h4 className="text-base sm:text-lg font-bold text-white">
              Adjust Simulated Parameters
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Real-time inference with trained Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIMULATED_FIELDS.map((field) => {
            const Icon = field.icon;
            const currentVal = currentProfile[field.name];
            const simVal = simulatedProfile[field.name];
            const diff = Math.round((simVal - currentVal) * 10) / 10;

            return (
              <div
                key={field.name}
                className="glass-card p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Icon className="text-xs" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {field.label}
                    </span>
                  </div>

                  {/* Value and Delta Indicator */}
                  <div className="text-right flex items-center space-x-1.5">
                    {diff !== 0 && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        diff > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                      }`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                    <span className="text-xs font-mono font-extrabold text-cyan-300">
                      {simVal}{field.unit}
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={simVal}
                  onChange={(e) => handleSliderChange(field.name, e.target.value)}
                  className="w-full cursor-pointer accent-indigo-500 mt-2"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>Baseline: {currentVal}{field.unit}</span>
                  <span>Range: {field.min}–{field.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
"""
with open("frontend/src/components/WhatIfSimulator.jsx", "w", encoding="utf-8") as f:
    f.write(content.strip())
print("Saved frontend/src/components/WhatIfSimulator.jsx cleanly")
