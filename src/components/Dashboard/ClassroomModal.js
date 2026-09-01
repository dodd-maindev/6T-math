import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { X, School, Plus } from 'lucide-react';

/**
 * Modal dialog for creating a new classroom.
 */
export const ClassroomModal = ({ isOpen, onClose, onClassroomCreated }) => {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await apiService.post('/admin/classroom', { name: name.trim() });
      setName('');
      onClassroomCreated(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể tạo lớp học');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-600">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Tạo Lớp Học Mới</h3>
              <p className="text-[11px] text-slate-500">Thêm lớp học vào hệ thống CLB 6T MATH</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên lớp học:</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Toán 6 - Lớp Nâng Cao A1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Đang tạo...' : 'Tạo lớp học'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassroomModal;
