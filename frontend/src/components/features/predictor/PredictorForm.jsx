import React from "react";
import InputField from "../../common/InputField";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaBriefcase,
  FaComments,
  FaRocket,
  FaSpinner,
  FaExclamationTriangle,
  FaMagic,
  FaChartLine,
  FaCheckCircle
} from "react-icons/fa";

export default function PredictorForm({ formData, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
      {/* 4 Input Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category 1: Academic Background */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
            <FaGraduationCap className="text-[#B47876] text-sm sm:text-base flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-[#4A3D30] tracking-tight">
              Academic Background
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
            <InputField
              label="Cumulative GPA (CGPA)"
              name="cgpa"
              value={formData.cgpa}
              onChange={onChange}
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
              onChange={onChange}
              min={0}
              max={10}
              step={1}
              unit=""
              helperText="Total backlogs (0 for clear)"
              icon={FaExclamationTriangle}
            />
            <InputField
              label="Daily Study Hours"
              name="study_hours_per_day"
              value={formData.study_hours_per_day}
              onChange={onChange}
              min={0.0}
              max={24.0}
              step={0.5}
              unit="h"
              helperText="Average daily study time"
              icon={FaChartLine}
            />
          </div>
        </div>

        {/* Category 2: Practical Experience */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
            <FaBriefcase className="text-[#9E6260] text-sm sm:text-base flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-[#4A3D30] tracking-tight">
              Practical Experience
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
            <InputField
              label="Internships Completed"
              name="internships_count"
              value={formData.internships_count}
              onChange={onChange}
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
              onChange={onChange}
              min={0}
              max={20}
              step={1}
              unit=""
              helperText="Technical / capstone projects"
              icon={FaLaptopCode}
            />
          </div>
        </div>

        {/* Category 3: Technical & Cognitive Skills */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
            <FaLaptopCode className="text-[#B47876] text-sm sm:text-base flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-[#4A3D30] tracking-tight">
              Technical & Reasoning Assessments
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
            <InputField
              label="Coding Skill Score"
              name="coding_skill_score"
              value={formData.coding_skill_score}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              unit="/100"
              helperText="DSA & problem-solving performance"
              icon={FaLaptopCode}
            />
            <InputField
              label="Aptitude Test Score"
              name="aptitude_score"
              value={formData.aptitude_score}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              unit="/100"
              helperText="Quantitative and analytical aptitude"
              icon={FaChartLine}
            />
            <InputField
              label="Logical Reasoning Score"
              name="logical_reasoning_score"
              value={formData.logical_reasoning_score}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              unit="/100"
              helperText="Pattern recognition & logic test"
              icon={FaMagic}
            />
          </div>
        </div>

        {/* Category 4: Interview & Communication Skills */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#D4C4AC]">
            <FaComments className="text-[#9E6260] text-sm sm:text-base flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-[#4A3D30] tracking-tight">
              Interview & Communication
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
            <InputField
              label="Communication Skill Score"
              name="communication_skill_score"
              value={formData.communication_skill_score}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              unit="/100"
              helperText="Verbal fluency & articulation"
              icon={FaComments}
            />
            <InputField
              label="Mock Interview Score"
              name="mock_interview_score"
              value={formData.mock_interview_score}
              onChange={onChange}
              min={0}
              max={100}
              step={1}
              unit="/100"
              helperText="Mock HR and technical evaluation"
              icon={FaCheckCircle}
            />
          </div>
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="pt-2 sm:pt-4 flex flex-col items-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto min-w-full sm:min-w-[280px] px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#F5EFE6] bg-[linear-gradient(135deg,#CEA4A3_0%,#B47876_100%)] hover:bg-[linear-gradient(135deg,#B47876_0%,#9E6260_100%)] shadow-card disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 cursor-pointer"
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
        <span className="text-[11px] sm:text-xs text-[#685644] mt-2 text-center">
          Securely queries <code className="text-[#9E6260] font-mono">/predict</code> endpoint
        </span>
      </div>
    </form>
  );
}
