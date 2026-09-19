import React, { useState } from "react";
import { 
  FaBullseye, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaInfoCircle, 
  FaRedoAlt
} from "react-icons/fa";
import { matchJob } from "../../../services/api";

const PRESET_JOBS = [
  {
    title: "💻 Full-Stack Web Developer",
    jd: "Required Skills: Python, JavaScript, React, SQL, FastAPI, Docker, Git. Build scalable web applications, REST APIs, and responsive frontends.",
  },
  {
    title: "🤖 AI / Machine Learning Engineer",
    jd: "Required Skills: Python, Machine Learning, Scikit-Learn, Pandas, SQL, Git, Deep Learning. Train ML models, clean datasets, and deploy inference endpoints.",
  },
  {
    title: "☁️ DevOps & Cloud Engineer",
    jd: "Required Skills: AWS, Docker, Linux, CI/CD, Python, Shell Scripting, Git. Automate infrastructure deployment and monitor cloud servers.",
  },
];

export default function JobMatcher({ currentProfile }) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription || !jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await matchJob(jobDescription);
      setResult(res);
    } catch (err) {
      console.error("Job match error:", err);
      setError("Failed to run TF-IDF job matching query. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (jdText) => {
    setJobDescription(jdText);
    setError(null);
  };

  const resetMatcher = () => {
    setJobDescription("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header Panel */}
      <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="p-2 sm:p-3 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] flex-shrink-0">
            <FaBullseye className="text-xl sm:text-2xl" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#30241D] tracking-tight font-serif">
              Job Description Matcher
            </h3>
            <p className="text-[11px] sm:text-xs text-[#756354] mt-0.5">
              Compare target job requirements against your profile using TF-IDF text vectorization and cosine similarity heuristics.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] space-y-4 sm:space-y-6 shadow-luxury">
        {/* Preset Buttons */}
        <div className="space-y-2">
          <label className="text-[10px] sm:text-xs font-semibold text-[#756354] uppercase tracking-wider block">
            Quick Job Description Presets:
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PRESET_JOBS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset.jd)}
                className="text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition cursor-pointer font-semibold shadow-card"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="jd-input" className="text-xs sm:text-sm font-semibold text-[#30241D] block">
            Target Job Description Text
          </label>
          <textarea
            id="jd-input"
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description or key requirements here (e.g., 'Looking for a Software Engineer with Python, SQL, Docker, AWS...')"
            className="w-full bg-[#F5EFE6] border border-[#D8C8B5] rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-[#30241D] placeholder-[#756354] focus:outline-none focus:border-[#9F595B] transition"
          />
          <div className="flex justify-between text-[10px] sm:text-[11px] text-[#756354]">
            <span>Character count: {jobDescription.length}</span>
            {result && (
              <button type="button" onClick={resetMatcher} className="text-[#9F595B] hover:underline flex items-center space-x-1 cursor-pointer">
                <FaRedoAlt className="text-[9px]" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 sm:p-3.5 rounded-lg bg-[#A65D5D]/15 border border-[#A65D5D] text-[#A65D5D] text-xs flex items-center space-x-2">
            <FaExclamationTriangle className="text-sm flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleMatch}
            disabled={!jobDescription.trim() || loading}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#9F595B] hover:bg-[#824647] text-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2 cursor-pointer shadow-card"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Computing TF-IDF & Cosine Similarity...</span>
              </>
            ) : (
              <>
                <FaBullseye className="text-sm" />
                <span>Calculate Job Match Score</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Match Results Output */}
      {result && (
        <div className="space-y-4 sm:space-y-6 animate-fadeIn">
          {/* Score Header Card */}
          <div className="glass-panel p-4 sm:p-6 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-luxury">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" className="stroke-[#F5EFE6]" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={result.job_match_score >= 70 ? "#71856B" : "#9F595B"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={(2 * Math.PI * 50) - (result.job_match_score / 100) * (2 * Math.PI * 50)}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#30241D]">
                    {result.job_match_score}%
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#756354]">
                    Match Score
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#30241D] font-serif">
                  Job Alignment Evaluation
                </h4>
                <p className="text-[11px] sm:text-xs text-[#756354] mt-1 max-w-md">
                  Calculated using TF-IDF term frequency vectorization and cosine angle similarity across job requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Matched Skills */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
              <div className="flex items-center space-x-2 text-[#71856B] font-bold text-xs sm:text-sm pb-2 border-b border-[#D8C8B5]">
                <FaCheckCircle className="text-sm sm:text-base flex-shrink-0" />
                <span className="text-[#30241D] truncate">Matched Skills ({result.matched_skills ? result.matched_skills.length : 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.matched_skills && result.matched_skills.length > 0 ? (
                  result.matched_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-[#71856B] text-[11px] sm:text-xs font-semibold">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#756354]">No direct skill overlaps detected</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
              <div className="flex items-center space-x-2 text-[#A65D5D] font-bold text-xs sm:text-sm pb-2 border-b border-[#D8C8B5]">
                <FaExclamationTriangle className="text-sm sm:text-base flex-shrink-0" />
                <span className="text-[#30241D] truncate">Missing Skills ({result.missing_skills ? result.missing_skills.length : 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.missing_skills && result.missing_skills.length > 0 ? (
                  result.missing_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-[#A65D5D] text-[11px] sm:text-xs font-semibold">
                      ✕ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#71856B]">All key job skills matched!</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="glass-card p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
            <div className="flex items-center space-x-2 text-[#B9935A] font-bold text-xs sm:text-sm pb-2 border-b border-[#D8C8B5]">
              <FaLightbulb className="text-sm sm:text-base flex-shrink-0" />
              <span className="text-[#30241D]">Recommended Action Steps</span>
            </div>
            <div className="space-y-2 pt-1">
              {result.recommended_actions && result.recommended_actions.length > 0 ? (
                result.recommended_actions.map((act, idx) => (
                  <div key={idx} className="flex items-start space-x-2 sm:space-x-2.5 text-xs text-[#30241D]">
                    <span className="h-5 w-5 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-[#9F595B] font-bold flex items-center justify-center text-[10px] sm:text-[11px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 leading-snug">{act}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#756354]">Maintain current preparation routine!</span>
              )}
            </div>
          </div>

          {/* Non-Guaranty Disclaimer */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[11px] sm:text-xs text-[#756354] flex items-start space-x-2 leading-relaxed">
            <FaInfoCircle className="text-[#9F595B] text-xs sm:text-sm flex-shrink-0 mt-0.5" />
            <span>{result.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
