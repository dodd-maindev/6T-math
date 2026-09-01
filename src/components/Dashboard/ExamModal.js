import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { X, BookOpen, Plus } from 'lucide-react';

/**
 * Modal dialog for creating a new assignment/exam.
 */
export const ExamModal = ({ isOpen, onClose, classroomId, onExamCreated }) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await apiService.post(`/admin/classroom/${classroomId}/assignment`, { title: title.trim() });
      setTitle('');
      onExamCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể tạo đề thi');
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
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Tạo Đề Thi / BTVN Mới</h3>
              <p className="text-[11px] text-slate-500">Tạo bộ đề kiểm tra mới cho lớp học</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên đề thi / Bài tập:</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: BTVN Tuần 1 - Phương Trình Chứa Căn"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              <span>{submitting ? 'Đang tạo...' : 'Tạo đề thi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamModal;
