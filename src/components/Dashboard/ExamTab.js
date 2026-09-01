import React, { useState, useEffect, useCallback } from 'react';
import { apiService, API_BASE_URL } from '../../services/apiService';
import QuestionList from './QuestionList';
import ExamModal from './ExamModal';
import { BookOpen, Plus, Calendar, ChevronRight, FileText, Trash2 } from 'lucide-react';

/**
 * Responsive assignment & exam management grid with creation & deletion.
 */
export const ExamTab = ({ classroom }) => {
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = useCallback(async () => {
    try {
      const data = await apiService.get(`/admin/classroom/${classroom.id}/assignments`);
      setAssignments(data || []);
    } catch (_) { setAssignments([]); }
  }, [classroom.id]);

  const fetchQuestions = useCallback(async (assId) => {
    try {
      const data = await apiService.get(`/admin/assignment/${assId}/questions`);
      setQuestions(data || []);
    } catch (_) { setQuestions([]); }
  }, []);

  useEffect(() => {
    fetchAssignments();
    setActiveAssignment(null);
  }, [classroom.id, fetchAssignments]);

  const handleDeleteAssignment = async (e, assId, assTitle) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xoá đề thi "${assTitle}" cùng tất cả câu hỏi và bài nộp liên quan?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/assignment/${assId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) fetchAssignments();
    } catch (_) {}
  };

  if (activeAssignment) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionList
          assignment={activeAssignment}
          questions={questions}
          onBack={() => setActiveAssignment(null)}
          onQuestionUpdated={() => fetchQuestions(activeAssignment.id)}
          onAssignmentDeleted={() => { setActiveAssignment(null); fetchAssignments(); }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900">Quản Lý Đề Thi & BTVN</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{classroom.name}</span> ({assignments.length} đề thi)</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 self-start sm:self-auto"><Plus className="w-4 h-4" /><span>+ Tạo đề thi mới</span></button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 sm:p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
            <p className="text-xs text-slate-400">Lớp chưa có đề thi nào. Bấm nút phía trên để tạo đề đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {assignments.map(ass => (
              <div key={ass.id} onClick={() => { setActiveAssignment(ass); fetchQuestions(ass.id); }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-amber-400 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-3.5 group">
                <div className="flex items-start justify-between">
                  <div className="p-2 sm:p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-600 group-hover:scale-105 transition-transform"><FileText className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md"><Calendar className="w-3 h-3" /><span>{new Date(ass.created_at).toLocaleDateString('vi-VN')}</span></span>
                    <button onClick={(e) => handleDeleteAssignment(e, ass.id, ass.title)} title="Xoá đề thi này" className="p-1 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div><h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">{ass.title}</h3><p className="text-[11px] text-slate-500 mt-0.5">Bấm để quản lý câu hỏi & đáp án mẫu</p></div>
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600"><span>Quản lý câu hỏi</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} classroomId={classroom.id} onExamCreated={fetchAssignments} />
    </div>
  );
};

export default ExamTab;
