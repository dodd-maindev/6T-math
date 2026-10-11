import React from 'react';
import { ArrowLeft, Award, FileDown } from 'lucide-react';

/**
 * Header card for GradingWorkspace showing classroom context, student details, and action buttons.
 * @param {object} props - Component properties.
 */
export const GradingStudentHeader = ({ classroom, assignment, student, hasHistory, onBack, onAggregate, onExportPdf }) => {
  const studentDisplayName = student.full_name ? `${student.full_name} (${student.email})` : student.email;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2 sm:gap-0">
        <button onClick={onBack} className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-semibold self-start cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
        <span className="text-[11px] sm:text-xs text-slate-500">
          Lớp: <b className="text-slate-900">{classroom?.name}</b> | Đề: <b className="text-amber-600">{assignment?.title}</b>
        </span>
      </div>

      <div className="mb-4 bg-amber-50/70 p-3.5 sm:p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
        <div>
          <h3 className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">Chấm bài cho học sinh</h3>
          <p className="text-base sm:text-lg font-black text-slate-900 truncate max-w-xs">{studentDisplayName}</p>
        </div>
        {hasHistory && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onAggregate}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Tổng Hợp Điểm Toàn Đề</span>
            </button>
            <button
              onClick={onExportPdf}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer"
              title="Xuất file báo cáo theo định dạng mẫu Excel/PDF"
            >
              <FileDown className="w-4 h-4" />
              <span>Xuất PDF</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GradingStudentHeader;
