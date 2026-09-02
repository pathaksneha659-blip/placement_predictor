import React, { useState } from "react";
import { 
  FaFilePdf, 
  FaCloudUploadAlt, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaCode, 
  FaRedoAlt
} from "react-icons/fa";
import { analyzeResume } from "../services/api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeResume(file);
      setResult(res);
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError("Failed to analyze resume PDF. Ensure the file is not password-protected.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden shadow-luxury">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B]">
            <FaFilePdf className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#30241D] tracking-tight font-serif">
              Resume Analyzer
            </h3>
            <p className="text-xs text-[#756354] mt-0.5">
              Upload your PDF resume to extract technical skills, section completeness, and transparent rule-based scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Card if no result */}
      {!result ? (
        <div className="glass-panel p-8 sm:p-12 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] text-center space-y-6 shadow-luxury">
          <div className="border-2 border-dashed border-[#D8C8B5] hover:border-[#9F595B] rounded-xl p-8 transition bg-[#FBF8F2] flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-[#F5EFE6] border border-[#D8C8B5] text-[#9F595B]">
              <FaCloudUploadAlt className="text-3xl text-[#9F595B]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#30241D]">
                {file ? file.name : "Drag & drop your PDF resume here, or click to browse"}
              </p>
              <p className="text-xs text-[#756354] mt-1">
                Supports PDF format up to 10MB
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload-input"
            />

            <label
              htmlFor="resume-upload-input"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#EDE3D4] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] cursor-pointer transition shadow-card"
            >
              {file ? "Change File" : "Select PDF File"}
            </label>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-[#A65D5D]/15 border border-[#A65D5D] text-[#A65D5D] text-xs flex items-center justify-center space-x-2">
              <FaExclamationTriangle className="text-sm flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || loading}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-[#9F595B] hover:bg-[#824647] text-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center space-x-2 cursor-pointer shadow-card"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Parsing PDF & Evaluating Sections...</span>
                </>
              ) : (
                <>
                  <FaFilePdf className="text-sm" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Top Score Summary Banner */}
          <div className="glass-panel p-6 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] flex flex-col md:flex-row items-center justify-between gap-6 shadow-luxury">
            <div className="flex items-center space-x-6">
              {/* Radial Score Meter */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" className="stroke-[#F5EFE6]" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={result.resume_score >= 75 ? "#71856B" : "#9F595B"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={(2 * Math.PI * 50) - (result.resume_score / 100) * (2 * Math.PI * 50)}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#30241D]">
                    {result.resume_score}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#756354]">
                    / 100
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#30241D] font-serif">
                  Resume Score Summary
                </h4>
                <p className="text-xs text-[#756354] mt-1 max-w-md">
                  Transparent rule-based evaluation across technical skills, sections present, and project details.
                </p>
                <span className="inline-block text-[10px] text-[#9F595B] bg-[#FBF8F2] border border-[#D8C8B5] px-2 py-0.5 rounded mt-2 font-medium">
                  Not an industry-standard accreditation score
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAnalyzer}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition flex items-center space-x-1.5 cursor-pointer shadow-card"
            >
              <FaRedoAlt className="text-xs" />
              <span>Upload Another Resume</span>
            </button>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Found */}
            <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
              <div className="flex items-center space-x-2 text-[#9F595B] font-bold text-sm pb-2 border-b border-[#D8C8B5]">
                <FaCode className="text-base" />
                <span className="text-[#30241D]">Technical Skills Found ({result.skills_found ? result.skills_found.length : 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.skills_found && result.skills_found.length > 0 ? (
                  result.skills_found.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-[#F5EFE6] border border-[#D8C8B5] text-[#30241D] text-xs font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#756354]">No standard tech skills detected</span>
                )}
              </div>
            </div>

            {/* Missing Sections */}
            <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
              <div className="flex items-center space-x-2 text-[#A65D5D] font-bold text-sm pb-2 border-b border-[#D8C8B5]">
                <FaExclamationTriangle className="text-base" />
                <span className="text-[#30241D]">Missing Key Sections</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {result.missing_sections && result.missing_sections.length > 0 ? (
                  result.missing_sections.map((sec, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-[#A65D5D]">
                      <FaExclamationTriangle className="text-[10px]" />
                      <span>{sec} section missing</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-[#71856B]">
                    <FaCheckCircle className="text-xs" />
                    <span>All standard resume sections are present!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="glass-card p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] space-y-3 shadow-card">
            <div className="flex items-center space-x-2 text-[#B9935A] font-bold text-sm pb-2 border-b border-[#D8C8B5]">
              <FaLightbulb className="text-base" />
              <span className="text-[#30241D]">Improvement Suggestions</span>
            </div>
            <div className="space-y-2 pt-1">
              {result.suggestions && result.suggestions.length > 0 ? (
                result.suggestions.map((sug, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-[#30241D]">
                    <span className="text-[#9F595B] font-bold">•</span>
                    <span>{sug}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#756354]">Resume meets baseline structural criteria!</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}