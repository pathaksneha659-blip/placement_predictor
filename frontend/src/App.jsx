import React, { useState, useEffect } from "react";
import {
  Header,
  Navigation,
  Footer,
  TextCursor,
  PlacementPredictor,
  WhatIfSimulator,
  CareerAssistant,
  JobMatcher,
  ResumeAnalyzer,
  ProgressDashboard,
} from "./components";
import { DEFAULT_FORM_VALUES, PRESETS } from "./constants/predictorConfig";
import { predictPlacement } from "./services/api";
import { syncSkillScores, getProgressData } from "./utils/progressStorage";

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
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} streak={streak} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-10">
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
            <PlacementPredictor
              formData={formData}
              result={result}
              error={error}
              loading={loading}
              onInputChange={handleInputChange}
              onSelectPreset={applyPreset}
              onResetForm={resetForm}
              onSubmit={handleSubmit}
              onResetResult={() => setResult(null)}
            />
          )}
        </main>

        <Footer />
      </div>
    </TextCursor>
  );
}