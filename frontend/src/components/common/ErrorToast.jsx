import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorToast({ title = "Backend Communication Error", message }) {
  if (!message) return null;

  return (
    <div className="p-4 rounded-xl bg-[#F4E8E8] border border-[#C18E8D] text-[#6A3E3C] text-xs flex items-start space-x-3 shadow-card">
      <FaExclamationTriangle className="text-[#9E6260] text-base flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <span className="font-bold block">{title}</span>
        <span className="text-xs text-[#6A3E3C]/90">{message}</span>
      </div>
    </div>
  );
}
