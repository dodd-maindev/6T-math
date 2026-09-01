import React, { useState } from 'react';
import { School, Sparkles, LogOut, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Left-side navigation sidebar supporting expansion and collapse with bright theme styling.
 */
export const NavigationSidebar = ({ currentTab, onTabChange, user, logout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className={`${collapsed ? 'w-16' : 'w-56'} bg-white border-r border-slate-200 flex flex-col justify-between p-3 shrink-0 transition-all duration-300 shadow-sm`}>
      <div className="space-y-6">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {!collapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-200 text-amber-600 shadow-sm">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xs font-black text-slate-900 tracking-tight">CLB 6T MATH</h1>
                <p className="text-[9px] text-slate-500 truncate max-w-[100px]">{user?.email}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-amber-600 transition-colors shadow-sm"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-1.5">
          {!collapsed && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Menu chính</p>}
          
          <button
            onClick={() => onTabChange('classrooms')}
            title="Quản lý lớp học"
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-2.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'classrooms'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Quản lý lớp học</span>}
          </button>

          <button
            onClick={() => onTabChange('grading')}
            title="Chấm điểm bài tập"
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-2.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'grading'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">Chấm điểm bài tập</span>}
          </button>
        </div>
      </div>

      <button
        onClick={logout}
        title="Đăng xuất"
        className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-2 justify-center'} border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold py-2 px-2.5 rounded-xl text-xs transition-all shadow-sm`}
      >
        <LogOut className="w-3.5 h-3.5 shrink-0" />
        {!collapsed && <span>Đăng xuất</span>}
      </button>
    </nav>
  );
};

export default NavigationSidebar;
