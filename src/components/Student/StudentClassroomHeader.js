import React from 'react';
import { GraduationCap, LogOut, BookOpen, Sparkles } from 'lucide-react';

/**
 * Mobile-first header displaying student profile, classroom badge, and logout.
 */
export const StudentClassroomHeader = ({ user, classroom, assignmentCount, logout }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm mb-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {user?.email?.split('@')[0] || 'Học sinh'}
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                6T Math Member
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>

      {classroom && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Lớp học:</span>
            <span className="font-extrabold text-[#024c3d] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {classroom.name}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{assignmentCount || 0} bài tập</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClassroomHeader;
