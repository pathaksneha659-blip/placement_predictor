import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedo, 
  FaLightbulb, 
  FaShieldAlt
} from "react-icons/fa";
import WhatIfSimulator from "./WhatIfSimulator";
import SkillGapAnalysis from "./SkillGapAnalysis";
import DailyGoals from "./DailyGoals";
import ProgressDashboard from "./ProgressDashboard";
import { evaluateSkillGap } from "../utils/skillGap";
import { generateDailyGoals } from "../utils/goalEngine";
import { getProgressData } from "../utils/progressStorage";

export default function ResultCard({ result, formData, onReset }) {
  const [progressRefresh, setProgressRefresh] = useState(0);
  const isPlaced = result.placement_status === "Placed";
  const placedProb = result.placement_probability;
  const notPlacedProb = result.not_placed_probability;

  // Trigger celebratory confetti on high placement probability or Placed status
  useEffect(() => {
    if (isPlaced) {
      const duration = 2.0 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 40 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.6 } });
        confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.6 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isPlaced]);

  // Radius and circumference for SVG circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (placedProb / 100) * circumference;

  // Skill gap analysis data
  const skillGapData = result.skill_gap_analysis && result.skill_gap_analysis.length > 0
    ? result.skill_gap_analysis
    : evaluateSkillGap(formData).skillData;

  const topPriorities = result.top_priorities && result.top_priorities.length > 0
    ? result.top_priorities
    : evaluateSkillGap(formData).topPriorities;

  // Adaptive goals data
  const progressData = getProgressData();
  const fallbackGoals = generateDailyGoals(formData, progressData);

  const dailyGoalsList = result.daily_goals && result.daily_goals.length > 0
    ? result.daily_goals
    : fallbackGoals.daily_goals;

  const totalGoalMin = result.total_goal_minutes !== undefined && result.total_goal_minutes !== null
    ? result.total_goal_minutes
    : fallbackGoals.total_goal_minutes;

  const availableStudyMin = result.available_study_minutes !== undefined && result.available_study_minutes !== null
    ? result.available_study_minutes
    : fallbackGoals.available_study_minutes;

  const adaptiveMode = result.adaptive_mode || fallbackGoals.adaptive_mode || "Balanced Pace";
  const adaptiveMessage = result.adaptive_recommendation_message || fallbackGoals.adaptive_recommendation_message || "Consistent habit pace. Maintaining steady daily preparation workload.";

  // Dynamic recommendation insights
  const getInsights = () => {
    const insights = [];
    if (formData.cgpa >= 8.0) {
      insights.push("Strong academic foundation (CGPA >= 8.0) clears top company cutoff criteria.");
    } else if (formData.cgpa < 7.0) {
      insights.push("Target elevating your CGPA above 7.0 to prevent resume filtering at initial screening.");
    }

    if (formData.coding_skill_score >= 75) {
      insights.push("High coding proficiency is a major positive factor in the model's high confidence.");
    } else {
      insights.push("Consistent LeetCode / DSA problem solving will significantly raise your placement odds.");
    }

    if (formData.internships_count >= 2) {
      insights.push("Practical internship experience provides a competitive edge over peer candidates.");
    } else if (formData.internships_count === 0) {
      insights.push("Securing at least 1 internship or open-source contribution will boost candidate profile strength.");
    }

    if (formData.backlogs > 0) {
      insights.push(`Clearing ${formData.backlogs} active backlog(s) should be prioritized before placement season.`);
    }

    if (formData.mock_interview_score >= 80) {
      insights.push("Excellent interview readiness will translate to high conversion rates in HR & Tech rounds.");
    }

    return insights.slice(0, 3);
  };

  const insightsList = getInsights();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* 1. Main Placement Assessment Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#FBF8F2] border border-[#D8C8B5] text-xs font-bold uppercase tracking-wider text-[#9F595B] mb-3">
            <FaShieldAlt className="text-[#9F595B]" />
            <span>ML Inference Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#30241D] tracking-tight font-serif">
            Placement Prediction Assessment
          </h2>
          <p className="text-[#756354] text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Evaluated through our trained Logistic Regression & Feature Selection Pipeline.
          </p>
        </div>

        {/* Main Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
          {/* Placement Probability Card */}
          <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] text-center relative order-2 md:order-1 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#71856B] mb-1">
              Placement Probability
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#71856B] tracking-tight my-2">
              {placedProb.toFixed(2)}%
            </div>
            <div className="w-full bg-[#F5EFE6] h-2 rounded-full overflow-hidden mt-3 border border-[#D8C8B5]">
              <div 
                className="bg-[#71856B] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${placedProb}%` }}
              />
            </div>
            <span className="text-xs text-[#756354] mt-2 block">
              Likelihood of campus offer
            </span>
          </div>

          {/* Central Circular Gauge & Status */}
          <div className="glass-card p-6 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] text-center flex flex-col items-center justify-center relative order-1 md:order-2 shadow-card">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-[#F5EFE6]"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isPlaced ? "#71856B" : "#A65D5D"}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-[#756354] tracking-wider">
                  Status
                </span>
                <span className={`text-xl font-extrabold tracking-tight mt-0.5 ${
                  isPlaced ? "text-[#71856B]" : "text-[#A65D5D]"
                }`}>
                  {result.placement_status.toUpperCase()}
                </span>
                {isPlaced ? (
                  <FaCheckCircle className="text-[#71856B] text-base mt-1" />
                ) : (
                  <FaTimesCircle className="text-[#A65D5D] text-base mt-1" />
                )}
              </div>
            </div>
          </div>

          {/* Not Placed Probability Card */}
          <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] text-center relative order-3 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A65D5D] mb-1">
              Not Placed Probability
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#A65D5D] tracking-tight my-2">
              {notPlacedProb.toFixed(2)}%
            </div>
            <div className="w-full bg-[#F5EFE6] h-2 rounded-full overflow-hidden mt-3 border border-[#D8C8B5]">
              <div 
                className="bg-[#A65D5D] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${notPlacedProb}%` }}
              />
            </div>
            <span className="text-xs text-[#756354] mt-2 block">
              Risk & improvement margin
            </span>
          </div>
        </div>

        {/* AI Key Insights & Actionable Feedback */}
        <div className="p-4 rounded-xl bg-[#FBF8F2] border border-[#D8C8B5] mb-6">
          <div className="flex items-center space-x-2 text-[#9F595B] font-bold text-xs sm:text-sm mb-2.5">
            <FaLightbulb className="text-[#B9935A] text-sm" />
            <span>Profile Analysis & Interpretation:</span>
          </div>
          <div className="space-y-2">
            {insightsList.map((insight, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#30241D]">
                <span className="text-[#9F595B] font-bold">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#9F595B] hover:bg-[#824647] text-white transition flex items-center space-x-2 cursor-pointer shadow-card"
          >
            <FaRedo className="text-xs" />
            <span>Predict Again / Test Another Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive What-If Placement Simulator */}
      <WhatIfSimulator currentProfile={formData} currentResult={result} />

      {/* 3. Personalized Daily Goal Engine Section (Adaptive) */}
      <DailyGoals 
        initialGoals={dailyGoalsList} 
        totalMinutes={totalGoalMin} 
        availableMinutes={availableStudyMin}
        studyHours={formData.study_hours_per_day}
        adaptiveMode={adaptiveMode}
        adaptiveMessage={adaptiveMessage}
        onGoalChange={() => setProgressRefresh((prev) => prev + 1)}
      />

      {/* 4. Skill Gap Analysis Section */}
      <SkillGapAnalysis skillData={skillGapData} topPriorities={topPriorities} />

      {/* 5. Progress Tracking Dashboard & Recharts Section */}
      <ProgressDashboard refreshTrigger={progressRefresh} />
    </div>
  );
}