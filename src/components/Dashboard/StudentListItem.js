import React from 'react';
import { School, ChevronRight } from 'lucide-react';

/**
 * Single student row in classroom roster.
 */
export const StudentListItem = ({ student, index, onClick }) => {
  return (
    <div onClick={onClick} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-purple-50/40 cursor-pointer transition-colors group">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-xs flex items-center justify-center shadow-sm shrink-0">
          {index + 1}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 group-hover:text-purple-900 truncate max-w-[180px] sm:max-w-md">
            {student.full_name || student.email}
          </p>
          <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-400">
            <span>TK: {student.email}</span>
            {student.school && (
              <span className="flex items-center space-x-0.5 text-purple-600 font-medium">
                <School className="w-3 h-3" />
                <span>{student.school}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 text-xs font-bold text-purple-600 shrink-0">
        <span className="hidden sm:inline">Xem hồ sơ & sửa</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default StudentListItem;
