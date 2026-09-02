import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  FaCalendarCheck, 
  FaClock, 
  FaCheckCircle, 
  FaRegCircle, 
  FaTrophy, 
  FaRedoAlt,
  FaLaptopCode,
  FaChartBar,
  FaComments,
  FaBriefcase,
  FaGraduationCap,
  FaBolt
} from "react-icons/fa";
import { updateTodayProgress } from "../utils/progressStorage";

const CATEGORY_ICONS = {
  "Coding": FaLaptopCode,
  "Aptitude": FaChartBar,
  "Communication": FaComments,
  "Projects": FaLaptopCode,
  "Interview Prep": FaCheckCircle,
  "Career": FaBriefcase,
  "Academics": FaGraduationCap,
};

export default function DailyGoals({ 
  initialGoals = [], 
  totalMinutes = 0, 
  availableMinutes = 0,
  studyHours = 3.5,
  adaptiveMode = "Balanced Pace",
  adaptiveMessage = "Consistent habit pace. Maintaining steady daily preparation workload.",
  onGoalChange = null
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    setGoals(initialGoals);
    setCelebrated(false);
  }, [initialGoals]);

  const toggleGoal = (id) => {
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
      const completedCount = updated.filter((g) => g.completed).length;
      updateTodayProgress(completedCount, updated.length, studyHours);
      if (onGoalChange) onGoalChange();
      return updated;
    });
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount && !celebrated) {
      setCelebrated(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#71856B", "#9F595B", "#B9935A"],
      });
    }
  }, [completedCount, totalCount, celebrated]);

  const resetAll = () => {
    setGoals((prev) => {
      const resetGoals = prev.map((g) => ({ ...g, completed: false }));
      updateTodayProgress(0, resetGoals.length, studyHours);
      if (onGoalChange) onGoalChange();
      return resetGoals;
    });
    setCelebrated(false);
  };

  if (!goals || goals.length === 0) return null;

  return (
    <div className="w-full mt-8 space-y-6">
      {/* Adaptive Recommendation Callout Banner */}
      <div className="p-5 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] mt-0.5">
              <FaBolt className="text-base" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-[#30241D]">
                  Adaptive Recommendation Engine
                </h4>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${
                  adaptiveMode === "Increased Difficulty"
                    ? "bg-[#9F595B]/15 text-[#9F595B] border-[#9F595B]/40"
                    : adaptiveMode === "Reduced Workload"
                    ? "bg-[#B9935A]/15 text-[#B9935A] border-[#B9935A]/40"
                    : "bg-[#71856B]/15 text-[#71856B] border-[#71856B]/40"
                }`}>
                  {adaptiveMode}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#30241D] mt-1 font-medium leading-relaxed">
                "{adaptiveMessage}"
              </p>
              <span className="text-[11px] text-[#756354] mt-1 block">
                Rule-based workload scaling derived from your recent goal completion rate and skill progress.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Progress Summary Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9F595B] mb-1">
              <FaCalendarCheck />
              <span>Tailored Study Plan</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#30241D] tracking-tight font-serif">
              Personalized Daily Goals
            </h3>
            <p className="text-xs text-[#756354] mt-1 max-w-xl">
              Targeted daily tasks designed for your weakest competencies, carefully capped to fit your daily study budget.
            </p>
          </div>

          {/* Time Budget Indicator */}
          <div className="flex items-center space-x-3 px-4 py-2.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] shadow-card">
            <div className="p-2 rounded bg-[#F5EFE6] text-[#9F595B]">
              <FaClock className="text-sm" />
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#756354] block tracking-wider">
                Study Budget
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#30241D] font-mono">
                {totalMinutes} min <span className="text-[#756354] font-normal">/ {availableMinutes} min max</span>
              </span>
            </div>
          </div>
        </div>

        {/* Today's Progress Box */}
        <div className="mt-6 p-5 rounded-xl bg-[#FBF8F2] border border-[#D8C8B5] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#756354] block">
                Today's Progress
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-extrabold text-[#30241D] font-mono">
                  {completedCount} / {totalCount}
                </span>
                <span className="text-xs text-[#756354]">goals completed</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${
                progressPercent === 100 ? "text-[#71856B]" : "text-[#9F595B]"
              }`}>
                {progressPercent}%
              </span>
              {progressPercent === 100 && (
                <div className="px-3 py-1 rounded bg-[#71856B]/15 border border-[#71856B]/30 text-[#71856B] text-xs font-bold flex items-center space-x-1.5">
                  <FaTrophy className="text-[#B9935A] text-xs" />
                  <span>All Done!</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#F5EFE6] h-2.5 rounded-full overflow-hidden border border-[#D8C8B5]">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressPercent === 100 ? "bg-[#71856B]" : "bg-[#9F595B]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goal Items List */}
      <div className="space-y-3">
        {goals.map((goal, idx) => {
          const CategoryIcon = CATEGORY_ICONS[goal.category] || FaCheckCircle;
          const isHigh = goal.priority === "High";

          return (
            <div
              key={goal.id || idx}
              onClick={() => toggleGoal(goal.id)}
              className={`glass-card p-4 sm:p-5 rounded-xl border transition cursor-pointer select-none flex items-start space-x-4 shadow-card ${
                goal.completed
                  ? "border-[#71856B]/40 bg-[#FBF8F2]"
                  : "border-[#D8C8B5] bg-[#FBF8F2] hover:border-[#CBB69D]"
              }`}
            >
              <div className="pt-0.5 flex-shrink-0">
                {goal.completed ? (
                  <FaCheckCircle className="text-lg text-[#71856B]" />
                ) : (
                  <FaRegCircle className="text-lg text-[#756354]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-[11px] font-semibold text-[#30241D]">
                    <CategoryIcon className="text-[10px] text-[#9F595B]" />
                    <span>{goal.category}</span>
                  </span>

                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                    isHigh
                      ? "bg-[#B9935A]/15 text-[#B9935A] border border-[#B9935A]/30"
                      : "bg-[#F5EFE6] text-[#756354] border border-[#D8C8B5]"
                  }`}>
                    {goal.priority} Priority
                  </span>

                  {goal.adaptive_note && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#9F595B]/10 text-[#9F595B] border border-[#9F595B]/30 font-semibold">
                      {goal.adaptive_note}
                    </span>
                  )}

                  <span className="text-[11px] font-mono font-medium text-[#756354] ml-auto flex items-center space-x-1">
                    <FaClock className="text-[10px] text-[#756354]" />
                    <span>{goal.estimated_minutes} min</span>
                  </span>
                </div>

                <h5 className={`text-sm sm:text-base font-bold transition ${
                  goal.completed ? "line-through text-[#756354]" : "text-[#30241D]"
                }`}>
                  {goal.title}
                </h5>

                <p className={`text-xs mt-1 leading-relaxed transition ${
                  goal.completed ? "text-[#968576] line-through" : "text-[#756354]"
                }`}>
                  {goal.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-[#756354]">
          Click any goal card to toggle completion. Automatically saved to localStorage.
        </span>
        <button
          type="button"
          onClick={resetAll}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition flex items-center space-x-1.5 cursor-pointer shadow-card"
        >
          <FaRedoAlt className="text-[10px]" />
          <span>Reset Progress</span>
        </button>
      </div>
    </div>
  );
}