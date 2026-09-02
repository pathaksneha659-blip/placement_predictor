import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import WhatIfSimulator from "./components/WhatIfSimulator";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import JobMatcher from "./components/JobMatcher";
import CareerAssistant from "./components/CareerAssistant";
import ProgressDashboard from "./components/ProgressDashboard";
import InfiniteSpiral from "./components/InfiniteSpiral";
import TextCursor from "./components/TextCursor";
import { predictPlacement } from "./services/api";
import { syncSkillScores, getProgressData } from "./utils/progressStorage";
import { 
  FaGraduationCap, 
  FaLaptopCode, 
  FaBriefcase, 
  FaComments, 
  FaRocket, 
  FaSpinner, 
  FaExclamationTriangle,
  FaMagic,
  FaRedoAlt,
  FaChartLine,
  FaCheckCircle,
  FaFire,
  FaSlidersH,
  FaFileAlt,
  FaBullseye,
  FaRobot,
  FaBolt
} from "react-icons/fa";

const DEFAULT_FORM_VALUES = {
  cgpa: 7.5,
  internships_count: 1,
  projects_count: 3,
  coding_skill_score: 70,
  aptitude_score: 65,
  communication_skill_score: 68,
  logical_reasoning_score: 66,
  mock_interview_score: 70,
  backlogs: 0,
  study_hours_per_day: 3.5,
};

const PRESETS = {
  top: {
    label: "🌟 High Achiever",
    values: {
      cgpa: 9.2,
      internships_count: 3,
      projects_count: 5,
      coding_skill_score: 92,
      aptitude_score: 88,
      communication_skill_score: 85,
      logical_reasoning_score: 90,
      mock_interview_score: 86,
      backlogs: 0,
      study_hours_per_day: 5.5,
    },
  },
  average: {
    label: "⚖️ Average Candidate",
    values: {
      cgpa: 7.5,
      internships_count: 1,
      projects_count: 3,
      coding_skill_score: 70,
      aptitude_score: 65,
      communication_skill_score: 68,
      logical_reasoning_score: 66,
      mock_interview_score: 70,
      backlogs: 0,
      study_hours_per_day: 3.5,
    },
  },
  needsImprovement: {
    label: "⚠️ Needs Growth",
    values: {
      cgpa: 5.8,
      internships_count: 0,
      projects_count: 1,
      coding_skill_score: 42,
      aptitude_score: 45,
      communication_skill_score: 48,
      logical_reasoning_score: 44,
      mock_interview_score: 40,
      backlogs: 3,
      study_hours_per_day: 1.5,
    },
  },
};

const SPIRAL_FEATURE_ITEMS = [
  { id: "feat-1", title: "Placement Forecast", subtitle: "ML Model Pipeline", icon: <FaRocket /> },
  { id: "feat-2", title: "What-If Simulator", subtitle: "Parameter Sliders", icon: <FaSlidersH /> },
  { id: "feat-3", title: "AI Career Coach", subtitle: "Contextual Chat", icon: <FaRobot /> },
  { id: "feat-4", title: "Job Description Match", subtitle: "TF-IDF + Cosine Sim", icon: <FaBullseye /> },
  { id: "feat-5", title: "Resume Analyzer", subtitle: "Local PDF Parser", icon: <FaFileAlt /> },
  { id: "feat-6", title: "Adaptive Goals", subtitle: "Dynamic Difficulty", icon: <FaBolt /> },
  { id: "feat-7", title: "Habit Tracker", subtitle: "Recharts & Streaks", icon: <FaFire /> },
  { id: "feat-8", title: "Skill Gap Readiness", subtitle: "Benchmark Rules", icon: <FaChartLine /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("PREDICT");
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [streak, setStreak] = useState(5);

  useEffect(() => {
    const data = getProgressData();
    if (data && data.streak) setStreak(data.streak);
  }, [result]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : parseFloat(value),
    }));
    if (error) setError(null);
  };

  const applyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].values);
    setError(null);
    setResult(null);
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictPlacement(formData);
      setResult(data);
      syncSkillScores(formData);
    } catch (err) {
      console.error("Prediction error:", err);
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map((d) => d.msg || JSON.stringify(d)).join(", "));
        } else {
          setError(detail.toString());
        }
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check if the FastAPI server is running on http://127.0.0.1:8000.");
      } else {
        setError("Failed to connect to FastAPI backend at http://127.0.0.1:8000. Ensure the server is running with uvicorn.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextCursor text="✨" spacing={90} followMouseDirection={true} randomFloat={true} exitDuration={0.4} maxPoints={5}>
      <div className="min-h-screen flex flex-col bg-[#E8DCC8] text-[#4A3D30]">
        <Header />

        <div className="w-full border-b border-[#D4C4AC] bg-[#E8DCC8] sticky top-16 z-30 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-13 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-1.5 py-2">
              <button
                type="button"
                onClick={() => setActiveTab("PREDICT")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "PREDICT"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaRocket className="text-xs" />
                <span>Placement Predictor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("WHATIF")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "WHATIF"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaSlidersH className="text-xs" />
                <span>What-If Simulator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ASSISTANT")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "ASSISTANT"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaRobot className="text-xs" />
                <span>AI Assistant</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("JOBMATCH")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "JOBMATCH"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaBullseye className="text-xs" />
                <span>Job Matcher</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("RESUME")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "RESUME"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaFileAlt className="text-xs" />
                <span>Resume Analyzer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("PROGRESS")}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "PROGRESS"
                    ? "bg-[#B47876] text-[#F5EFE6] shadow-card"
                    : "text-[#685644] hover:text-[#4A3D30] hover:bg-[#EAE0D2]"
                }`}
              >
                <FaChartLine className="text-xs" />
                <span>Progress & Habits</span>
              </button>
            </div>

            <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#F5EFE6] border border-[#D4C4AC] text-[#A08B70] text-xs font-bold whitespace-nowrap shadow-card">
              <FaFire className="text-[#B47876] text-xs" />
              <span>{streak} Day Streak</span>
            </div>
          </div>
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {activeTab === "PROGRESS" ? (
            <div className="max-w-5xl mx-auto">
              <ProgressDashboard />
            </div>
          ) : activeTab === "RESUME" ? (
            <div className="max-w-5xl mx-auto">
              <ResumeAnalyzer />
            </div>
          ) : activeTab === "JOBMATCH" ? (
            <div className="max-w-5xl mx-auto">
              <JobMatcher currentProfile={formData} />
            </div>
          ) : activeTab === "ASSISTANT" ? (
            <div className="max-w-5xl mx-auto">
              <CareerAssistant currentProfile={formData} currentResult={result} />
            </div>
          ) : activeTab === "WHATIF" ? (
            <div className="max-w-5xl mx-auto">
              <WhatIfSimulator 
                currentProfile={formData} 
                currentResult={result || { placement_status: "Placed", placement_probability: 58.0, not_placed_probability: 42.0 }} 
              />
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="text-center max-w-4xl mx-auto mb-10 relative">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#F5EFE6] border border-[#D4C4AC] text-[#9E6260] text-xs font-semibold uppercase tracking-wider mb-3 shadow-card">
                  <FaMagic className="text-[#B47876]" />
                  <span>Real-Time Candidate Evaluation & Preparation Engine</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#4A3D30] mb-3 font-serif">
                  Predict Your Campus Placement Readiness
                </h2>
                <p className="text-[#685644] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                  Enter your academic metrics and skill test evaluations to receive instant machine learning placement forecasts, sensitivity simulations, and tailored career coaching.
                </p>

                <div className="mt-6 mb-4 relative w-full rounded-xl glass-panel p-2 border border-[#D4C4AC] overflow-hidden bg-[linear-gradient(135deg,#F5EFE6_0%,#EAE0D2_50%,#F5EFE6_100%)] shadow-luxury">
                  <div className="absolute top-2 left-4 z-10 flex items-center space-x-2 px-2.5 py-1 rounded bg-[#F5EFE6] border border-[#D4C4AC] text-[11px] font-bold text-[#9E6260] shadow-soft">
                    <span className="w-2 h-2 rounded-full bg-[#B47876]" />
                    <span>3D Interactive Feature Helix</span>
                  </div>
                  <div className="h-[260px] sm:h-[300px] relative w-full overflow-hidden">
                    <InfiniteSpiral
                      items={SPIRAL_FEATURE_ITEMS}
                      animationMode="all"
                      speed={0.5}
                      radius={150}
                      cardWidth={130}
                      cardHeight={70}
                      verticalSpacing={50}
                      perspective={1000}
                      cardsPerTurn={6}
                      centerScale={1.15}
                      edgeBlur={3}
                      pauseOnHover={true}
                    />
                  </div>
                </div>
              </div>

              {/* ResultCard or Prediction Input Form */}
              {result ? (
                <div className="transition-all duration-300">
                  <ResultCard result={result} formData={formData} onReset={() => setResult(null)} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Quick Profile Presets Bar */}
                  <div className="glass-panel p-4 rounded-xl border border-[#D4C4AC] bg-[#F5EFE6] flex flex-wrap items-center justify-between gap-3 shadow-card">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-[#4A3D30]">
                      <FaMagic className="text-[#B47876]" />
                      <span>Quick Candidate Presets:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(PRESETS).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => applyPreset(key)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#EAE0D2] hover:bg-[#E0D4C0] text-[#4A3D30] border border-[#D4C4AC] transition cursor-pointer font-medium shadow-soft"
                        >
                          {PRESETS[key].label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#F5EFE6] hover:bg-[#EAE0D2] text-[#685644] hover:text-[#4A3D30] border border-[#D4C4AC] transition flex items-center space-x-1.5 cursor-pointer shadow-soft"
                      >
                        <FaRedoAlt className="text-[10px]" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Error Toast */}
                  {error && (
                    <div className="p-4 rounded-xl bg-[#F4E8E8] border border-[#C18E8D] text-[#6A3E3C] text-xs flex items-start space-x-3 shadow-card">
                      <FaExclamationTriangle className="text-[#9E6260] text-base flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-bold block">Backend Communication Error</span>
                        <span className="text-xs text-[#6A3E3C]/90">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* 4 Input Categories Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category 1: Academic Profile */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
                        <FaGraduationCap className="text-[#B47876] text-base" />
                        <h3 className="text-sm font-bold text-[#4A3D30] tracking-tight">
                          Academic Background
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        <InputField
                          label="Cumulative GPA (CGPA)"
                          name="cgpa"
                          value={formData.cgpa}
                          onChange={handleInputChange}
                          min={0.0}
                          max={10.0}
                          step={0.1}
                          unit=""
                          helperText="Valid range: 0.0 to 10.0 scale"
                          icon={FaGraduationCap}
                        />
                        <InputField
                          label="Active / Past Backlogs"
                          name="backlogs"
                          value={formData.backlogs}
                          onChange={handleInputChange}
                          min={0}
                          max={10}
                          step={1}
                          unit=""
                          helperText="Total number of backlogs (0 for clear)"
                          icon={FaExclamationTriangle}
                        />
                        <InputField
                          label="Daily Study Hours"
                          name="study_hours_per_day"
                          value={formData.study_hours_per_day}
                          onChange={handleInputChange}
                          min={0.0}
                          max={24.0}
                          step={0.5}
                          unit="h"
                          helperText="Average daily hours dedicated to study"
                          icon={FaChartLine}
                        />
                      </div>
                    </div>

                    {/* Category 2: Practical Experience */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
                        <FaBriefcase className="text-[#9E6260] text-base" />
                        <h3 className="text-sm font-bold text-[#4A3D30] tracking-tight">
                          Practical Experience
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        <InputField
                          label="Internships Completed"
                          name="internships_count"
                          value={formData.internships_count}
                          onChange={handleInputChange}
                          min={0}
                          max={10}
                          step={1}
                          unit=""
                          helperText="Industry or research internships"
                          icon={FaBriefcase}
                        />
                        <InputField
                          label="Major Projects Completed"
                          name="projects_count"
                          value={formData.projects_count}
                          onChange={handleInputChange}
                          min={0}
                          max={20}
                          step={1}
                          unit=""
                          helperText="Substantial technical / capstone projects"
                          icon={FaLaptopCode}
                        />
                      </div>
                    </div>

                    {/* Category 3: Technical & Cognitive Skills */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
                        <FaLaptopCode className="text-[#B47876] text-base" />
                        <h3 className="text-sm font-bold text-[#4A3D30] tracking-tight">
                          Technical & Reasoning Assessments
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        <InputField
                          label="Coding Skill Score"
                          name="coding_skill_score"
                          value={formData.coding_skill_score}
                          onChange={handleInputChange}
                          min={0}
                          max={100}
                          step={1}
                          unit="/100"
                          helperText="DSA, coding test, & problem-solving performance"
                          icon={FaLaptopCode}
                        />
                        <InputField
                          label="Aptitude Test Score"
                          name="aptitude_score"
                          value={formData.aptitude_score}
                          onChange={handleInputChange}
                          min={0}
                          max={100}
                          step={1}
                          unit="/100"
                          helperText="Quantitative and analytical aptitude score"
                          icon={FaChartLine}
                        />
                        <InputField
                          label="Logical Reasoning Score"
                          name="logical_reasoning_score"
                          value={formData.logical_reasoning_score}
                          onChange={handleInputChange}
                          min={0}
                          max={100}
                          step={1}
                          unit="/100"
                          helperText="Pattern recognition & logical assessment score"
                          icon={FaMagic}
                        />
                      </div>
                    </div>

                    {/* Category 4: Interview & Communication Skills */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
                        <FaComments className="text-[#9E6260] text-base" />
                        <h3 className="text-sm font-bold text-[#4A3D30] tracking-tight">
                          Interview & Communication
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-3.5">
                        <InputField
                          label="Communication Skill Score"
                          name="communication_skill_score"
                          value={formData.communication_skill_score}
                          onChange={handleInputChange}
                          min={0}
                          max={100}
                          step={1}
                          unit="/100"
                          helperText="Verbal fluency, presentation, & articulation"
                          icon={FaComments}
                        />
                        <InputField
                          label="Mock Interview Score"
                          name="mock_interview_score"
                          value={formData.mock_interview_score}
                          onChange={handleInputChange}
                          min={0}
                          max={100}
                          step={1}
                          unit="/100"
                          helperText="Comprehensive mock HR and technical evaluation"
                          icon={FaCheckCircle}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Action Bar */}
                  <div className="pt-4 flex flex-col items-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto min-w-[260px] px-8 py-3.5 rounded-xl font-bold text-sm text-[#F5EFE6] bg-[linear-gradient(135deg,#CEA4A3_0%,#B47876_100%)] hover:bg-[linear-gradient(135deg,#B47876_0%,#9E6260_100%)] shadow-card disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin text-sm text-white" />
                          <span>Analyzing Candidate Metrics...</span>
                        </>
                      ) : (
                        <>
                          <FaRocket className="text-sm text-white" />
                          <span>Run Placement Prediction</span>
                        </>
                      )}
                    </button>
                    <span className="text-xs text-[#685644] mt-2.5">
                      Securely queries <code className="text-[#9E6260] font-mono">http://127.0.0.1:8000/predict</code>
                    </span>
                  </div>
                </form>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#D4C4AC] bg-[#F5EFE6] py-5 text-center text-xs text-[#685644]">
          <p>PlaceIQ • AI Career Intelligence Platform • Powered by FastAPI & React</p>
        </footer>
      </div>
    </TextCursor>
  );
}