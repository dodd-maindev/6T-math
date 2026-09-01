import React from 'react';
import { School, Sparkles, GraduationCap, BookOpen, Plus, LogOut, ChevronDown } from 'lucide-react';

/**
 * Responsive top navigation bar adapting to mobile and desktop screen sizes.
 */
export const AppTopNav = ({
  classrooms = [], selectedClassroom, onSelectClassroom, onOpenCreateClassroom,
  currentTab, onTabChange, user, logout
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between shrink-0 shadow-sm z-30 gap-2 sm:gap-4">
      <div className="flex items-center justify-between w-full sm:w-auto space-x-3">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500 text-slate-950 px-2 py-1 rounded-lg font-black text-xs shadow">6T</div>
          <span className="text-xs font-black text-slate-900 hidden xs:inline">6T MATH</span>
        </div>

        <div className="flex items-center space-x-1.5 flex-1 sm:flex-initial justify-end sm:justify-start">
          <div className="relative flex items-center max-w-[150px] sm:max-w-[200px]">
            <select
              value={selectedClassroom?.id || ''}
              onChange={(e) => {
                const cls = classrooms.find((c) => c.id === e.target.value);
                if (cls) onSelectClassroom(cls);
              }}
              className="appearance-none w-full bg-slate-50 border border-slate-300 text-slate-900 text-[11px] sm:text-xs font-bold py-1.5 pl-6 pr-6 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm truncate"
            >
              {classrooms.map((cls) => (<option key={cls.id} value={cls.id}>{cls.name}</option>))}
            </select>
            <School className="w-3.5 h-3.5 text-amber-600 absolute left-2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          <button onClick={onOpenCreateClassroom} title="Tạo thêm lớp" className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-300 text-slate-600 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button onClick={logout} title="Đăng xuất" className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-rose-600 shadow-sm sm:hidden">
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-center overflow-x-auto">
        <button onClick={() => onTabChange('students')} className={`flex items-center space-x-1 sm:space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${currentTab === 'students' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          <GraduationCap className="w-3.5 h-3.5 text-purple-600" /><span>Học sinh</span>
        </button>
        <button onClick={() => onTabChange('exams')} className={`flex items-center space-x-1 sm:space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${currentTab === 'exams' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
          <BookOpen className="w-3.5 h-3.5 text-amber-600" /><span>Đề thi</span>
        </button>
        <button onClick={() => onTabChange('grading')} className={`flex items-center space-x-1 sm:space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${currentTab === 'grading' ? 'bg-white text-amber-800 shadow-sm font-black' : 'text-slate-600'}`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /><span>Chấm bài</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center space-x-3">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{user?.email}</p>
          <p className="text-[9px] text-emerald-600 font-bold uppercase">Giáo viên</p>
        </div>
        <button onClick={logout} title="Đăng xuất" className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-rose-600 shadow-sm">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default AppTopNav;
