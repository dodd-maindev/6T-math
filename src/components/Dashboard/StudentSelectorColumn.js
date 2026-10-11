import React from 'react';
import { UserCheck, BookOpen, Sparkles, Zap, Loader2, FileSpreadsheet } from 'lucide-react';

/**
 * Renders the student selector column with batch grading and whole-class Excel export actions.
 * @param {object} props - Component properties.
 */
export const StudentSelectorColumn = ({
  selectedAssignment, students, uploadSummary, onSelectStudent,
  onBatchGrade, batchGrading, batchProgress, onExportAllGraded, exportingAll,
}) => {
  const getStudentUploadInfo = (studentId) => (uploadSummary || []).find((s) => s.student_id === studentId);
  const eligibleCount = (uploadSummary || []).filter((s) => s.uploaded_count > 0).length;

  if (!selectedAssignment) {
    return (
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-400 text-xs space-y-2 py-12">
        <BookOpen className="w-8 h-8 text-slate-300" />
        <p>Vui lòng chọn 1 đề thi trước</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
        <UserCheck className="w-4 h-4 text-purple-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider">2. Chọn học sinh ({students.length})</h3>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {students.map((s) => {
          const info = getStudentUploadInfo(s.id);
          const hasUploads = info && info.uploaded_count > 0;
          return (
            <div
              key={s.id}
              onClick={() => onSelectStudent(s)}
              className="p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between bg-slate-50 text-slate-800 hover:bg-amber-50 border border-slate-200 shadow-sm group"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="truncate">{s.full_name ? `${s.full_name} (${s.email})` : s.email}</span>
                {info && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 font-bold ${hasUploads ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {hasUploads ? `${info.uploaded_count}/${info.total_questions} câu` : 'Chưa nộp'}
                  </span>
                )}
              </div>
              {hasUploads && (
                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0">
                  <Sparkles className="w-3 h-3" /><span>Chấm bài</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        {eligibleCount > 0 && (
          <button
            onClick={onBatchGrade}
            disabled={batchGrading}
            className="w-full p-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer transition-all"
          >
            {batchGrading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang chấm {batchProgress.done}/{batchProgress.total}...</span></> : <><Zap className="w-4 h-4" /><span>⚡ Chấm tất cả ({eligibleCount} HS đã nộp)</span></>}
          </button>
        )}
        <button
          onClick={onExportAllGraded}
          disabled={exportingAll}
          className="w-full p-2.5 rounded-xl text-xs font-black bg-[#107c41] hover:bg-[#0d6535] text-white shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer transition-all"
          title="Xuất bảng điểm Excel cho toàn bộ học sinh đã có kết quả chấm"
        >
          {exportingAll ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang tổng hợp dữ liệu lớp...</span></> : <><FileSpreadsheet className="w-4 h-4" /><span>📊 Xuất Excel Toàn Bộ HS Đã Chấm</span></>}
        </button>
      </div>
    </div>
  );
};

export default StudentSelectorColumn;
