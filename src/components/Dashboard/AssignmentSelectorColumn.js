import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

/**
 * Renders the assignment selector column with loading states.
 * @param {object} props - Component properties.
 */
export const AssignmentSelectorColumn = ({ assignments, selectedAssignment, loading, onSelectAssignment }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
        <BookOpen className="w-4 h-4 text-amber-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider">
          1. Chọn đề thi {loading ? '' : `(${assignments.length})`}
        </h3>
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {loading ? (
          [1, 2, 3].map((n) => <div key={n} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)
        ) : assignments.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6">Chưa có đề thi nào trong lớp</p>
        ) : (
          assignments.map((a) => (
            <div
              key={a.id}
              onClick={() => onSelectAssignment(a)}
              className={`p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between shadow-sm ${
                selectedAssignment?.id === a.id
                  ? 'bg-amber-50 text-amber-900 border border-amber-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="truncate pr-2">{a.title}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentSelectorColumn;
