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
    <div className="p-4 sm:p-5 rounded-xl border border-[#D8C8B5] bg-[#FBF8F2] relative overflow-hidden transition shadow-card">
      {/* Header with Icon, Label, and Current Value Input */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          {Icon && (
            <div className="p-2 rounded-lg bg-[#EDE3D4] border border-[#D8C8B5] text-[#9F595B]">
              <Icon className="text-sm" />
            </div>
          )}
          <div>
            <label htmlFor={name} className="text-sm font-semibold text-[#30241D] block">
              {label}
            </label>
            {helperText && (
              <span className="text-xs text-[#756354] block leading-tight">
                {helperText}
              </span>
            )}
          </div>
        </div>

        {/* Numeric Direct Input */}
        <div className="flex items-center space-x-1 bg-[#F5EFE6] border border-[#D8C8B5] px-2.5 py-1 rounded-lg focus-within:border-[#9F595B] transition">
          <input
            type="number"
            id={name}
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-16 bg-transparent text-right font-mono font-bold text-sm text-[#30241D] focus:outline-none"
          />
          {unit && <span className="text-xs font-medium text-[#756354]">{unit}</span>}
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1 mt-3">
        <div className="relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full cursor-pointer accent-[#9F595B]"
            style={{
              background: `linear-gradient(to right, #9F595B 0%, #B96F70 ${percentage}%, #D8C8B5 ${percentage}%, #D8C8B5 100%)`
            }}
          />
        </div>

        {/* Min / Max Labels */}
        <div className="flex justify-between text-[10px] text-[#756354] font-mono">
          <span>Min: {min}{unit}</span>
          <span>Max: {max}{unit}</span>
        </div>
      </div>
    </div>
  );
}