import React, { useState } from 'react';
import { School, Plus } from 'lucide-react';
import { apiService } from '../../services/apiService';

/**
 * Sidebar component managing and displaying the list of classrooms with light theme styling.
 */
export const ClassroomSidebar = ({ classrooms, selectedClassroom, onSelectClassroom, onClassroomCreated }) => {
  const [newClassName, setNewClassName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!newClassName.trim()) return;
    setSubmitting(true);
    try {
      const data = await apiService.post('/admin/classroom', { name: newClassName.trim() });
      setNewClassName('');
      onClassroomCreated(data);
    } catch (_) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-2 text-slate-700 mb-3">
          <School className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Danh sách lớp học</h2>
        </div>
        
        <form onSubmit={handleCreate} className="relative">
          <input
            type="text"
            required
            disabled={submitting}
            placeholder="Thêm lớp mới..."
            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-sm"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button type="submit" className="absolute right-2.5 top-2.5 text-slate-400 hover:text-amber-600">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {classrooms.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6">Chưa có lớp nào</p>
        ) : (
          classrooms.map((cls) => (
            <div
              key={cls.id}
              onClick={() => onSelectClassroom(cls)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                selectedClassroom?.id === cls.id
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="truncate">{cls.name}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default ClassroomSidebar;
