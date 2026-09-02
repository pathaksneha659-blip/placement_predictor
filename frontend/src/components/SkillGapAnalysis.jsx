import React, { useState } from "react";
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaLightbulb, 
  FaFire, 
  FaChartBar,
  FaFilter,
  FaGraduationCap,
  FaLaptopCode,
  FaBriefcase,
  FaComments,
  FaBookOpen,
  FaBrain
} from "react-icons/fa";

const SKILL_ICONS = {
  "CGPA": FaGraduationCap,
  "Coding Skill": FaLaptopCode,
  "Aptitude": FaChartBar,
  "Communication": FaComments,
  "Logical Reasoning": FaBrain,
  "Mock Interview": FaCheckCircle,
  "Internships": FaBriefcase,
  "Projects": FaLaptopCode,
  "Backlogs": FaExclamationTriangle,
  "Study Hours": FaBookOpen,
};

export default function SkillGapAnalysis({ skillData = [], topPriorities = [] }) {
  const [filter, setFilter] = useState("ALL");

  if (!skillData || skillData.length === 0) return null;

  const strongCount = skillData.filter(s => s.status === "Strong").length;
  const moderateCount = skillData.filter(s => s.status === "Moderate").length;
  const needsImpCount = skillData.filter(s => s.status === "Needs Improvement").length;

  const filteredSkills = skillData.filter(s => {
    if (filter === "NEEDS_IMP") return s.status === "Needs Improvement";
    if (filter === "MODERATE") return s.status === "Moderate";
    if (filter === "STRONG") return s.status === "Strong";
    return true;
  });

  const getProgressPercentage = (item) => {
    const raw = item.raw_score;
    if (item.skill === "CGPA") return Math.min(Math.max((raw / 10) * 100, 0), 100);
    if (item.skill === "Internships") return Math.min(Math.max((raw / 3) * 100, 0), 100);
    if (item.skill === "Projects") return Math.min(Math.max((raw / 5) * 100, 0), 100);
    if (item.skill === "Backlogs") return raw === 0 ? 100 : Math.max(100 - raw * 30, 10);
    if (item.skill === "Study Hours") return Math.min(Math.max((raw / 6) * 100, 0), 100);
    return Math.min(Math.max(raw, 0), 100);
  };

  return (
    <div className="w-full mt-8 space-y-6">
      {/* Section Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9F595B] mb-1">
              <FaChartBar />
              <span>Readiness Diagnostic</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#30241D] tracking-tight font-serif">
              Skill Gap & Preparation Analysis
            </h3>
            <p className="text-xs text-[#756354] mt-1 max-w-2xl">
              Rule-based evaluation comparing candidate metrics against standard campus placement readiness benchmarks.
            </p>
          </div>

          {/* Metrics Summary Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1 rounded bg-[#FBF8F2] border border-[#D8C8B5] text-[#71856B] text-xs font-semibold flex items-center space-x-1.5 shadow-card">
              <span className="h-2 w-2 rounded-full bg-[#71856B]"></span>
              <span>{strongCount} Strong</span>
            </div>
            <div className="px-3 py-1 rounded bg-[#FBF8F2] border border-[#D8C8B5] text-[#B9935A] text-xs font-semibold flex items-center space-x-1.5 shadow-card">
              <span className="h-2 w-2 rounded-full bg-[#B9935A]"></span>
              <span>{moderateCount} Moderate</span>
            </div>
            <div className="px-3 py-1 rounded bg-[#FBF8F2] border border-[#D8C8B5] text-[#A65D5D] text-xs font-semibold flex items-center space-x-1.5 shadow-card">
              <span className="h-2 w-2 rounded-full bg-[#A65D5D]"></span>
              <span>{needsImpCount} Needs Imp.</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-4 pt-3 border-t border-[#D8C8B5] flex items-start space-x-2 text-xs text-[#756354] leading-relaxed">
          <FaInfoCircle className="text-[#9F595B] text-xs mt-0.5 flex-shrink-0" />
          <span>
            <strong>Readiness Benchmark Note:</strong> These evaluations represent rule-based placement readiness heuristics designed for candidate self-assessment, not guaranteed outcomes.
          </span>
        </div>
      </div>

      {/* Top Priorities Callout Card */}
      {topPriorities && topPriorities.length > 0 && (
        <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-[#F5EFE6] border border-[#D8C8B5] text-[#B9935A]">
                <FaFire className="text-base" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#30241D]">
                  Top Priority Improvement Areas
                </h4>
                <p className="text-xs text-[#756354]">
                  Focusing on these weakest competencies will yield the highest boost in placement readiness:
                </p>
              </div>
            </div>

            {/* Top Priorities List */}
            <div className="flex flex-wrap items-center gap-2">
              {topPriorities.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-xs font-bold text-[#B9935A] flex items-center space-x-1.5"
                >
                  <span className="h-4 w-4 rounded-full bg-[#EDE3D4] text-[#30241D] flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
        <div className="flex items-center space-x-2 text-xs text-[#756354] font-semibold">
          <FaFilter className="text-[#9F595B]" />
          <span>Filter by Status:</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#EDE3D4] border border-[#D8C8B5]">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              filter === "ALL" ? "bg-[#9F595B] text-white" : "text-[#756354] hover:text-[#30241D]"
            }`}
          >
            All ({skillData.length})
          </button>
          <button
            onClick={() => setFilter("NEEDS_IMP")}
            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              filter === "NEEDS_IMP" ? "bg-[#A65D5D]/20 text-[#A65D5D] border border-[#A65D5D]/30" : "text-[#756354] hover:text-[#30241D]"
            }`}
          >
            Needs Improvement ({needsImpCount})
          </button>
          <button
            onClick={() => setFilter("MODERATE")}
            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              filter === "MODERATE" ? "bg-[#B9935A]/20 text-[#B9935A] border border-[#B9935A]/30" : "text-[#756354] hover:text-[#30241D]"
            }`}
          >
            Moderate ({moderateCount})
          </button>
          <button
            onClick={() => setFilter("STRONG")}
            className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
              filter === "STRONG" ? "bg-[#71856B]/20 text-[#71856B] border border-[#71856B]/30" : "text-[#756354] hover:text-[#30241D]"
            }`}
          >
            Strong ({strongCount})
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((item, idx) => {
          const Icon = SKILL_ICONS[item.skill] || FaCheckCircle;
          const isNeedsImp = item.status === "Needs Improvement";
          const isModerate = item.status === "Moderate";
          const isStrong = item.status === "Strong";
          const progress = getProgressPercentage(item);

          return (
            <div
              key={idx}
              className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg border ${
                    isNeedsImp
                      ? "bg-[#A65D5D]/10 border-[#A65D5D]/20 text-[#A65D5D]"
                      : isModerate
                      ? "bg-[#B9935A]/10 border-[#B9935A]/20 text-[#B9935A]"
                      : "bg-[#71856B]/10 border-[#71856B]/20 text-[#71856B]"
                  }`}>
                    <Icon className="text-sm" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#30241D] tracking-tight">
                      {item.skill}
                    </h5>
                    <span className="text-[10px] text-[#756354] font-mono">
                      Target: {item.benchmark}
                    </span>
                  </div>
                </div>

                {/* Score & Status Badge */}
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#30241D] font-mono block">
                    {item.score_display}
                  </span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded inline-block mt-0.5 ${
                    isNeedsImp
                      ? "bg-[#A65D5D]/10 text-[#A65D5D] border border-[#A65D5D]/30"
                      : isModerate
                      ? "bg-[#B9935A]/10 text-[#B9935A] border border-[#B9935A]/30"
                      : "bg-[#71856B]/10 text-[#71856B] border border-[#71856B]/30"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 my-2">
                <div className="w-full bg-[#F5EFE6] h-2 rounded-full overflow-hidden border border-[#D8C8B5]">
                  <div
                    className={`h-full rounded-full ${
                      isNeedsImp
                        ? "bg-[#A65D5D]"
                        : isModerate
                        ? "bg-[#B9935A]"
                        : "bg-[#71856B]"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div className="p-3 rounded-lg bg-[#F5EFE6] border border-[#D8C8B5] flex items-start space-x-2">
                <FaLightbulb className={`text-xs mt-0.5 flex-shrink-0 ${
                  isNeedsImp ? "text-[#A65D5D]" : isModerate ? "text-[#B9935A]" : "text-[#71856B]"
                }`} />
                <p className="text-xs text-[#30241D] leading-snug">
                  {item.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}