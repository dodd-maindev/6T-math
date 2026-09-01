import React from 'react';
import { LogOut, School, Sparkles } from 'lucide-react';

/**
 * Shared dark-theme dashboard header with top-level tabs and profile info.
 */
export const DashboardHeader = ({ title, user, currentTab, onTabChange, logout }) => {
  return (
    <header className="w-full h-16 bg-[#121217] border-b border-zinc-800 flex items-center justify-between px-6 select-none shrink-0">
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-sm font-bold text-zinc-100 leading-tight">{title}</h1>
          <p className="text-[10px] text-zinc-500">{user?.email}</p>
        </div>

        <div className="flex items-center bg-[#0d0d11] p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onTabChange('classrooms')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'classrooms'
                ? 'bg-[#1a1a24] text-amber-500 border border-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Quản lý lớp học</span>
          </button>
          <button
            onClick={() => onTabChange('grading')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'grading'
                ? 'bg-[#1a1a24] text-amber-500 border border-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chấm điểm bài tập</span>
          </button>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center space-x-1.5 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 font-medium py-1.5 px-3 rounded-lg text-xs transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Đăng xuất</span>
      </button>
    </header>
  );
};

export default DashboardHeader;
