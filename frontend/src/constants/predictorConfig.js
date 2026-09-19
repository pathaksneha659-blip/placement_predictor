import { 
  FaRocket, 
  FaSlidersH, 
  FaRobot, 
  FaBullseye, 
  FaFileAlt, 
  FaChartLine, 
  FaBolt, 
  FaFire 
} from "react-icons/fa";

export const DEFAULT_FORM_VALUES = {
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

export const PRESETS = {
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

export const SPIRAL_FEATURE_ITEMS = [
  { id: "feat-1", title: "Placement Forecast", subtitle: "ML Model Pipeline", icon: FaRocket },
  { id: "feat-2", title: "What-If Simulator", subtitle: "Parameter Sliders", icon: FaSlidersH },
  { id: "feat-3", title: "AI Career Coach", subtitle: "Contextual Chat", icon: FaRobot },
  { id: "feat-4", title: "Job Description Match", subtitle: "TF-IDF + Cosine Sim", icon: FaBullseye },
  { id: "feat-5", title: "Resume Analyzer", subtitle: "Local PDF Parser", icon: FaFileAlt },
  { id: "feat-6", title: "Adaptive Goals", subtitle: "Dynamic Difficulty", icon: FaBolt },
  { id: "feat-7", title: "Habit Tracker", subtitle: "Recharts & Streaks", icon: FaFire },
  { id: "feat-8", title: "Skill Gap Readiness", subtitle: "Benchmark Rules", icon: FaChartLine },
];

export const NAV_TABS = [
  { id: "PREDICT", label: "Placement Predictor", icon: FaRocket },
  { id: "WHATIF", label: "What-If Simulator", icon: FaSlidersH },
  { id: "ASSISTANT", label: "AI Assistant", icon: FaRobot },
  { id: "JOBMATCH", label: "Job Matcher", icon: FaBullseye },
  { id: "RESUME", label: "Resume Analyzer", icon: FaFileAlt },
  { id: "PROGRESS", label: "Progress & Habits", icon: FaChartLine },
];
