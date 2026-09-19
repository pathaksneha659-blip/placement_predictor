import React from "react";

export default function InputField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  helperText,
  icon: Icon,
}) {
  const numValue = parseFloat(value) || 0;
  const percentage = Math.min(Math.max(((numValue - min) / (max - min)) * 100, 0), 100);

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] relative overflow-hidden transition shadow-card">
      {/* Header with Icon, Label, and Current Value Input */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          {Icon && (
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#EDE3D4] border border-[#D8C8B5] text-[#9F595B] flex-shrink-0">
              <Icon className="text-xs sm:text-sm" />
            </div>
          )}
          <div className="min-w-0">
            <label htmlFor={name} className="text-xs sm:text-sm font-semibold text-[#30241D] block truncate">
              {label}
            </label>
            {helperText && (
              <span className="text-[11px] sm:text-xs text-[#756354] block leading-tight truncate">
                {helperText}
              </span>
            )}
          </div>
        </div>

        {/* Numeric Direct Input */}
        <div className="flex items-center space-x-1 bg-[#F5EFE6] border border-[#D8C8B5] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg focus-within:border-[#9F595B] transition flex-shrink-0">
          <input
            type="number"
            id={name}
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-12 sm:w-16 bg-transparent text-right font-mono font-bold text-xs sm:text-sm text-[#30241D] focus:outline-none"
          />
          {unit && <span className="text-[11px] sm:text-xs font-medium text-[#756354]">{unit}</span>}
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1 mt-2 sm:mt-3">
        <div className="relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full h-2 cursor-pointer accent-[#9F595B]"
            style={{
              background: `linear-gradient(to right, #9F595B 0%, #B96F70 ${percentage}%, #D8C8B5 ${percentage}%, #D8C8B5 100%)`
            }}
          />
        </div>

        {/* Min / Max Labels */}
        <div className="flex justify-between text-[9px] sm:text-[10px] text-[#756354] font-mono">
          <span>Min: {min}{unit}</span>
          <span>Max: {max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
