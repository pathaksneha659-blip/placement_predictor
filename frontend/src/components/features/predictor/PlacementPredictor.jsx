import React from "react";
import { FaMagic } from "react-icons/fa";
import PresetsBar from "./PresetsBar";
import PredictorForm from "./PredictorForm";
import ResultCard from "./ResultCard";
import InfiniteSpiral from "../../common/InfiniteSpiral/InfiniteSpiral";
import ErrorToast from "../../common/ErrorToast";
import { SPIRAL_FEATURE_ITEMS } from "../../../constants/predictorConfig";

export default function PlacementPredictor({
  formData,
  result,
  error,
  loading,
  onInputChange,
  onSelectPreset,
  onResetForm,
  onSubmit,
  onResetResult,
}) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-10 relative px-1">
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1 rounded-md bg-[#F5EFE6] border border-[#D4C4AC] text-[#9E6260] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-card">
          <FaMagic className="text-[#B47876] text-xs" />
          <span>Real-Time Candidate Evaluation & Preparation Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#4A3D30] mb-2 sm:mb-3 font-serif leading-tight">
          Predict Your Campus Placement Readiness
        </h2>
        <p className="text-[#685644] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto px-2">
          Enter your academic metrics and skill test evaluations to receive instant machine learning placement forecasts, sensitivity simulations, and tailored career coaching.
        </p>

        {/* 3D Interactive Feature Helix */}
        <div className="mt-4 sm:mt-6 mb-4 relative w-full rounded-xl glass-panel p-2 border border-[#D4C4AC] overflow-hidden bg-[linear-gradient(135deg,#F5EFE6_0%,#EAE0D2_50%,#F5EFE6_100%)] shadow-luxury">
          <div className="absolute top-2 left-3 sm:left-4 z-10 flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#F5EFE6] border border-[#D4C4AC] text-[10px] sm:text-[11px] font-bold text-[#9E6260] shadow-soft">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#B47876]" />
            <span>3D Interactive Feature Helix</span>
          </div>
          <div className="h-[220px] xs:h-[260px] sm:h-[300px] relative w-full overflow-hidden">
            <InfiniteSpiral
              items={SPIRAL_FEATURE_ITEMS}
              animationMode="all"
              speed={0.5}
              radius={140}
              cardWidth={120}
              cardHeight={65}
              verticalSpacing={48}
              perspective={1000}
              cardsPerTurn={6}
              centerScale={1.12}
              edgeBlur={3}
              pauseOnHover={true}
            />
          </div>
        </div>
      </div>

      {/* ResultCard or Prediction Input Form */}
      {result ? (
        <div className="transition-all duration-300">
          <ResultCard result={result} formData={formData} onReset={onResetResult} />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Quick Profile Presets Bar */}
          <PresetsBar onSelectPreset={onSelectPreset} onReset={onResetForm} />

          {/* Error Toast */}
          <ErrorToast message={error} />

          {/* Form */}
          <PredictorForm
            formData={formData}
            onChange={onInputChange}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
