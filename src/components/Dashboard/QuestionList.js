import React, { useState } from 'react';
import { API_HOST, API_BASE_URL } from '../../services/apiService';
import QuestionModal from './QuestionModal';
import BaremEditorModal from './BaremEditorModal';
import { ArrowLeft, Plus, HelpCircle, FileCheck, Trash2, Pencil, Sparkles, HelpCircle as HelpIcon, X } from 'lucide-react';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Question list with image previews, CRUD, and Barem editor modal support.
 */
export const QuestionList = ({ assignment, questions, onBack, onQuestionUpdated, onAssignmentDeleted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [baremQuestion, setBaremQuestion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openAddModal = () => { setEditQuestion(null); setIsModalOpen(true); };
  const openEditModal = (q) => { setEditQuestion(q); setIsModalOpen(true); };
  const closeModal = () => { setEditQuestion(null); setIsModalOpen(false); };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá câu hỏi này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/question/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok && onQuestionUpdated) onQuestionUpdated();
    } catch (_) {}
  };

  const handleDeleteAssignment = async () => {
    if (!window.confirm(`Xoá toàn bộ đề thi "${assignment.title}"?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/assignment/${assignment.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok && onAssignmentDeleted) onAssignmentDeleted();
    } catch (_) {}
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button onClick={onBack} className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 shadow-sm"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 truncate max-w-[220px] sm:max-w-md">{assignment.title}</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Ngân hàng câu hỏi ({questions.length} câu)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button onClick={handleDeleteAssignment} className="px-2.5 py-2 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1"><Trash2 className="w-3.5 h-3.5" /><span>Xoá đề</span></button>
          <button onClick={openAddModal} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5"><Plus className="w-4 h-4" /><span>+ Thêm câu</span></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <HelpIcon className="w-8 h-8 text-slate-300" /><p className="text-xs text-slate-400">Đề này chưa có câu hỏi nào. Bấm nút phía trên để thêm câu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {questions.map((q) => {
              const qImgs = Array.isArray(q.question_image_urls) ? q.question_image_urls : [];
              const solImgs = Array.isArray(q.solution_image_urls) ? q.solution_image_urls : [q.reference_image_url].filter(Boolean);
              const hasBarem = q.barem_json && q.barem_json.steps && q.barem_json.steps.length > 0;
              return (
                <div key={q.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900">Câu {q.question_number}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-[#fff8ea] px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">{formatScore(q.max_score)} điểm</span>
                      <button onClick={() => openEditModal(q)} className="p-1 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {qImgs.length > 0 && (
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 mb-1 flex items-center"><HelpCircle className="w-3 h-3 mr-1 text-amber-600" /> Ảnh Đề bài ({qImgs.length} ảnh):</p>
                      <div className="grid grid-cols-3 gap-1.5">{qImgs.map((img, i) => (<div key={i} onClick={() => setSelectedImage(img)} className="h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm cursor-pointer hover:border-amber-400"><img src={`${API_HOST}${img}`} alt="" className="w-full h-full object-cover" /></div>))}</div>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-emerald-800 mb-1 flex items-center"><FileCheck className="w-3 h-3 mr-1 text-emerald-600" /> Ảnh Lời giải mẫu ({solImgs.length} ảnh):</p>
                    <div className="grid grid-cols-3 gap-1.5">{solImgs.map((img, i) => (<div key={i} onClick={() => setSelectedImage(img)} className="h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm cursor-pointer hover:border-emerald-400"><img src={`${API_HOST}${img}`} alt="" className="w-full h-full object-cover" /></div>))}</div>
                  </div>

                  {/* Barem Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${hasBarem ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                      {hasBarem ? `✅ Barem (${q.barem_json.steps.length} bước)` : '⚠️ Chưa có Barem'}
                    </span>
                    <button onClick={() => setBaremQuestion(q)} className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center space-x-1 cursor-pointer transition-transform hover:scale-105">
                      <Sparkles className="w-3 h-3" /><span>{hasBarem ? 'Xem & Sửa Barem' : 'Quét Barem AI'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 cursor-zoom-out animate-fadeIn">
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl border border-slate-300 shadow-2xl">
            <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-lg"><X className="w-4 h-4" /></button>
            <img src={`${API_HOST}${selectedImage}`} alt="Xem trước" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
          </div>
        </div>
      )}

      <QuestionModal isOpen={isModalOpen} onClose={closeModal} assignmentId={assignment.id} onQuestionAdded={onQuestionUpdated} editQuestion={editQuestion} />
      <BaremEditorModal isOpen={!!baremQuestion} onClose={() => setBaremQuestion(null)} question={baremQuestion} onBaremUpdated={onQuestionUpdated} />
    </div>
  );
};

export default QuestionList;
