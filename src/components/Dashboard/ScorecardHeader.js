import React from 'react';
import { ArrowLeft } from 'lucide-react';

/**
 * Header card component for Scorecard with 6T Math branding.
 */
export const ScorecardHeader = ({ title, studentName, score, maxScore, rating, onClose }) => {
  return (
    <div className="bg-[#033b2e] p-5 sm:p-7 rounded-3xl text-white shadow-xl relative overflow-hidden">
      <button
        onClick={onClose}
        className="flex items-center space-x-1.5 text-emerald-200 hover:text-white transition-colors text-xs font-semibold mb-3"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại giao diện chấm</span>
      </button>

      <div className="text-center space-y-1 pb-4 border-b border-emerald-800/60">
        <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-white">
          {title || 'BTVN - CLB TOÁN 6T MATH'}
        </h2>
        <p className="text-[11px] sm:text-xs font-bold text-emerald-200 tracking-wider uppercase">
          HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC — CLB TOÁN HỌC 6T MATH
        </p>
      </div>

      <div className="pt-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-1.5 shadow-md flex items-center justify-center shrink-0">
            <img src="/Logo.png" alt="6T MATH" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div className="text-sm sm:text-base">
            <span className="text-emerald-200 font-medium mr-2">Học sinh</span>
            <span className="text-base sm:text-2xl font-black text-white tracking-wide">{studentName}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-full border-4 border-[#10b981] bg-[#02281f] flex flex-col items-center justify-center shadow-lg">
            <span className="text-lg sm:text-2xl font-black text-white leading-none">{score}</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-300 font-semibold mt-0.5">/ {maxScore} điểm</span>
          </div>
          <div className="border border-amber-400/80 bg-[#02281f] px-3 py-1 rounded-full text-center mt-2 shadow-sm">
            <span className="text-[10px] sm:text-xs font-black text-amber-300 tracking-wider">XẾP LOẠI: {rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorecardHeader;
