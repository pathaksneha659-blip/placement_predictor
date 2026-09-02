import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaFire,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import { getProgressData } from "../utils/progressStorage";

export default function ProgressDashboard({ refreshTrigger = 0 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loaded = getProgressData();
    setData(loaded);
  }, [refreshTrigger]);

  if (!data) return null;

  const todayHistory = data.history.find((h) => h.day === "Today") || data.history[data.history.length - 1];
  const totalCompletedGoals = data.history.reduce((sum, h) => sum + (h.completedGoals || 0), 0);
  const totalWeeklyStudyHours = data.history.reduce((sum, h) => sum + (h.studyHours || 0), 0);
  const avgCompletionRate = Math.round(
    data.history.reduce((sum, h) => sum + (h.completionPct || 0), 0) / (data.history.length || 1)
  );

  return (
    <div className="w-full mt-8 space-y-6 animate-fadeIn">
      {/* Dashboard Section Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#9F595B] mb-1">
              <FaChartLine />
              <span>Continuous Habit Tracker</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#30241D] tracking-tight font-serif">
              Progress & Habit Dashboard
            </h3>
            <p className="text-xs text-[#756354] mt-1 max-w-xl">
              Daily goal completion rates, current streaks, and skill trajectories recorded in your browser.
            </p>
          </div>

          {/* Current Streak Badge */}
          <div className="flex items-center space-x-3 px-4 py-2.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] shadow-card">
            <div className="p-2 rounded bg-[#F5EFE6] text-[#B9935A]">
              <FaFire className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#756354] tracking-wider block">
                Current Streak
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#30241D] tracking-tight">
                🔥 {data.streak} Days
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Today's Progress */}
          <div className="glass-card p-4 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
            <span className="text-[11px] font-semibold text-[#756354] block mb-1">Today's Progress</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-[#30241D] font-mono">
                {todayHistory.completedGoals}/{todayHistory.totalGoals}
              </span>
              <span className="text-xs font-bold text-[#9F595B] font-mono">
                ({todayHistory.completionPct}%)
              </span>
            </div>
            <div className="w-full bg-[#F5EFE6] h-1.5 rounded-full overflow-hidden mt-2.5 border border-[#D8C8B5]">
              <div
                className="bg-[#9F595B] h-full rounded-full transition-all duration-500"
                style={{ width: `${todayHistory.completionPct}%` }}
              />
            </div>
          </div>

          {/* Card 2: Weekly Completed Goals */}
          <div className="glass-card p-4 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
            <span className="text-[11px] font-semibold text-[#756354] block mb-1">Goals Completed</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-[#71856B] font-mono">
                {totalCompletedGoals}
              </span>
              <span className="text-xs text-[#756354]">this week</span>
            </div>
            <span className="text-[10px] text-[#71856B] mt-2 block font-medium">
              Avg. {avgCompletionRate}% completion rate
            </span>
          </div>

          {/* Card 3: Study Hours Logged */}
          <div className="glass-card p-4 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
            <span className="text-[11px] font-semibold text-[#756354] block mb-1">Study Hours (7 Days)</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-[#B96F70] font-mono">
                {totalWeeklyStudyHours.toFixed(1)}h
              </span>
              <span className="text-xs text-[#756354]">logged</span>
            </div>
            <span className="text-[10px] text-[#756354] mt-2 block">
              ~{(totalWeeklyStudyHours / 7).toFixed(1)}h / day pace
            </span>
          </div>

          {/* Card 4: Persistence */}
          <div className="glass-card p-4 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
            <span className="text-[11px] font-semibold text-[#756354] block mb-1">Persistence</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-extrabold text-[#30241D]">
                Active Sync
              </span>
            </div>
            <span className="text-[10px] text-[#756354] mt-2 block">
              Persisted in localStorage
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Breakdown Bar Display */}
      <div className="glass-panel p-6 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] shadow-luxury">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaCalendarCheck className="text-[#9F595B]" />
            <h4 className="text-base font-bold text-[#30241D] font-serif">
              Weekly Progress
            </h4>
          </div>
          <span className="text-xs text-[#756354] font-mono">7-Day Completion Rate</span>
        </div>

        <div className="space-y-2.5">
          {data.history.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-xs">
              <span className="w-12 font-mono font-bold text-[#30241D] text-right">
                {item.day}
              </span>
              <div className="flex-1 bg-[#F5EFE6] h-3 rounded-full overflow-hidden border border-[#D8C8B5] relative">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.completionPct >= 80
                      ? "bg-[#71856B]"
                      : item.completionPct >= 50
                      ? "bg-[#9F595B]"
                      : "bg-[#B9935A]"
                  }`}
                  style={{ width: `${Math.max(item.completionPct, 5)}%` }}
                />
              </div>
              <span className="w-12 font-mono font-bold text-[#30241D]">
                {item.completionPct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Goal Completion Rate (%) */}
        <div className="glass-card p-5 sm:p-6 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#30241D]">
                Weekly Goal Completion Trend (%)
              </h4>
              <p className="text-[11px] text-[#756354]">
                Percentage of daily goals completed
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#F5EFE6] text-[#9F595B] border border-[#D8C8B5] font-mono font-bold">
              Target: 80%+
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9F595B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#9F595B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8C8B5" vertical={false} />
                <XAxis dataKey="day" stroke="#756354" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#756354" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FBF8F2",
                    borderColor: "#D8C8B5",
                    borderRadius: "8px",
                    color: "#30241D",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val}%`, "Completion Rate"]}
                />
                <Area
                  type="monotone"
                  dataKey="completionPct"
                  stroke="#9F595B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goalGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Study Hours Per Day */}
        <div className="glass-card p-5 sm:p-6 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#30241D]">
                Study Hours Per Day
              </h4>
              <p className="text-[11px] text-[#756354]">
                Daily preparation hours logged
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-[#F5EFE6] text-[#9F595B] border border-[#D8C8B5] font-mono font-bold">
              Total: {totalWeeklyStudyHours.toFixed(1)}h
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8C8B5" vertical={false} />
                <XAxis dataKey="day" stroke="#756354" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 8]} stroke="#756354" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FBF8F2",
                    borderColor: "#D8C8B5",
                    borderRadius: "8px",
                    color: "#30241D",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val} hrs`, "Study Time"]}
                />
                <Bar dataKey="studyHours" fill="#B96F70" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Skill Score Progress */}
      <div className="glass-card p-6 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="text-base font-bold text-[#30241D]">
              Skill Score Progress & Improvement
            </h4>
            <p className="text-xs text-[#756354]">
              Comparing your current evaluated scores against your baseline benchmark.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5 text-[#756354]">
              <span className="h-3 w-3 rounded bg-[#D8C8B5]"></span>
              <span>Baseline</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#30241D] font-bold">
              <span className="h-3 w-3 rounded bg-[#9F595B]"></span>
              <span>Current Score</span>
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.skillScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8C8B5" vertical={false} />
              <XAxis dataKey="skill" stroke="#756354" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#756354" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FBF8F2",
                  borderColor: "#D8C8B5",
                  borderRadius: "8px",
                  color: "#30241D",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="baseline" name="Baseline" fill="#D8C8B5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="score" name="Current Score" fill="#9F595B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}