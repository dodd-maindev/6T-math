import React from 'react';
import { FileText, ChevronRight, Award } from 'lucide-react';
import { buildAggregatedSubmission } from '../Dashboard/gradingAggregator';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Mobile-first horizontal scroll and list selector for classroom assignments.
 */
export const StudentAssignmentList = ({
  assignments = [],
  selectedAssignment,
  onSelect,
  submissions = [],
  currentQuestions = [],
}) => {
  const getAssignmentScore = (item) => {
    const itemSubs = submissions.filter(s => s.assignment_id === item.id);
    if (itemSubs.length === 0) return null;
    const qList = item.id === selectedAssignment?.id ? currentQuestions : [];
    const agg = buildAggregatedSubmission(item, itemSubs, qList);
    return agg?.score ? formatScore(agg.score) : null;
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Danh Sách Bài Tập Về Nhà
        </h3>
        <span className="text-[11px] text-slate-400 font-semibold">{assignments.length} bài</span>
      </div>

      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x">
        {assignments.map((item) => {
          const isSelected = selectedAssignment?.id === item.id;
          const score = getAssignmentScore(item);

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`snap-start shrink-0 w-[240px] sm:w-auto text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#024c3d] text-white border-[#024c3d] shadow-md scale-[1.01]'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm line-clamp-1">{item.title}</h4>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-emerald-300' : 'text-slate-300'}`} />
              </div>

              <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-white/10 w-full">
                <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>
                  {new Date(item.created_at).toLocaleDateString('vi-VN')}
                </span>
                {score != null ? (
                  <span className={`font-black flex items-center space-x-1 px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    <Award className="w-3 h-3" />
                    <span>{score}đ</span>
                  </span>
                ) : (
                  <span className={`font-medium ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>Chưa nộp</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAssignmentList;
