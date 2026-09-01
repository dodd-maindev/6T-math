import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

/**
 * Responsive view rendering student learning profile, score KPIs, and submission history.
 */
export const StudentProfileView = ({ student, submissions, onBack, onSelectSubmission }) => {
  const scores = submissions.map((s) => parseFloat(s.score || 0));
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
  const highest = scores.length ? Math.max(...scores).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col h-full text-slate-800 overflow-y-auto shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 sm:mb-6">
        <button onClick={onBack} className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> <span>Quay lại</span>
        </button>
        <span className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[200px] sm:max-w-none">Học sinh: <span className="text-amber-600 font-bold">{student.email}</span></span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-amber-50/70 border border-amber-200 p-2.5 sm:p-4 rounded-xl text-center shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-amber-700">{avg}</p>
          <p className="text-[9px] sm:text-[10px] text-amber-800 font-bold uppercase mt-0.5">ĐIỂM TB</p>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 sm:p-4 rounded-xl text-center shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-emerald-700">{highest}</p>
          <p className="text-[9px] sm:text-[10px] text-emerald-800 font-bold uppercase mt-0.5">CAO NHẤT</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 sm:p-4 rounded-xl text-center shadow-sm">
          <p className="text-xl sm:text-2xl font-black text-slate-700">{submissions.length}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase mt-0.5">ĐÃ CHẤM</p>
        </div>
      </div>

      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">Lịch sử bài nộp</h3>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {submissions.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6">Chưa nộp bài tập nào</p>
        ) : (
          submissions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSubmission(s)}
              className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm"
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate max-w-[180px] sm:max-w-md">{s.assignment_title}</p>
                  <p className="text-[10px] text-slate-400">{new Date(s.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <span className="font-black text-amber-700 text-xs sm:text-sm bg-white px-2.5 sm:px-3 py-1 rounded-lg border border-amber-200 shadow-sm shrink-0">
                {s.score}đ
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentProfileView;
