import React from 'react';
import { Upload, Images, FileText } from 'lucide-react';

/**
 * Switcher component for toggling grading modes: student uploads, by-question images, and full PDF.
 */
export const GradingModeSwitcher = ({ mode, onChangeMode }) => {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-[11px] font-bold">
      <button
        type="button"
        onClick={() => onChangeMode('uploads')}
        className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
          mode === 'uploads' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Upload className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Ảnh đã nộp</span>
      </button>
      <button
        type="button"
        onClick={() => onChangeMode('by_question')}
        className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
          mode === 'by_question' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Images className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Chấm theo file ảnh</span>
      </button>
      <button
        type="button"
        onClick={() => onChangeMode('full')}
        className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
          mode === 'full' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Toàn bộ (PDF)</span>
      </button>
    </div>
  );
};

export default GradingModeSwitcher;
