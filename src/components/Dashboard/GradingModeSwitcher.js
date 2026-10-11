import React from 'react';
import { Upload, FileText } from 'lucide-react';

/**
 * Switcher component for toggling between photo uploads and full PDF grading modes.
 * @param {object} props - Component properties.
 * @param {string} props.mode - Current active grading mode ('uploads' or 'full').
 * @param {Function} props.onChangeMode - Mode change callback handler.
 */
export const GradingModeSwitcher = ({ mode, onChangeMode }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
      <button
        type="button"
        onClick={() => onChangeMode('uploads')}
        className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
          mode === 'uploads' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Upload className="w-3.5 h-3.5" />
        <span>Chấm từ ảnh đã nộp</span>
      </button>
      <button
        type="button"
        onClick={() => onChangeMode('full')}
        className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
          mode === 'full' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <FileText className="w-3.5 h-3.5" />
        <span>Chấm toàn bộ (PDF)</span>
      </button>
    </div>
  );
};

export default GradingModeSwitcher;
