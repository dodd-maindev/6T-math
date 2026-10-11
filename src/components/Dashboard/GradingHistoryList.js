import React from 'react';
import { History, Calendar } from 'lucide-react';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Renders the submission history list for the selected student.
 * @param {object} props - Component properties.
 * @param {Array} props.history - List of historical submissions.
 * @param {Function} props.onSelectSubmission - Callback when a submission is clicked.
 */
export const GradingHistoryList = ({ history, onSelectSubmission }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="mt-5 pt-4 border-t border-slate-200">
      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <History className="w-3.5 h-3.5 text-amber-600" />
        <span>Lịch sử các lần chấm:</span>
      </h4>
      <div className="space-y-1.5">
        {history.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSubmission(s)}
            className="p-2.5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700 font-medium">
                {new Date(s.created_at).toLocaleString('vi-VN')}
              </span>
              <span className="text-slate-900 font-bold ml-2 bg-slate-200 px-2 py-0.5 rounded text-[10px]">
                {s.feedback?.questions?.[0]?.question_title || 'Câu hỏi'}
              </span>
            </div>
            <span className="font-black text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm text-[11px]">
              {formatScore(s.score)} điểm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradingHistoryList;
