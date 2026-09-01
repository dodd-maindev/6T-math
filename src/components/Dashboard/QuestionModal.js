import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/apiService';
import { X, HelpCircle, FileCheck, Plus, AlertCircle, Save } from 'lucide-react';

/**
 * Modal dialog for adding or editing a question in an assignment.
 */
export const QuestionModal = ({ isOpen, onClose, assignmentId, onQuestionAdded, editQuestion = null }) => {
  const [qNum, setQNum] = useState('');
  const [qPrompt, setQPrompt] = useState('');
  const [qScore, setQScore] = useState('2.5');
  const [qImages, setQImages] = useState([]);
  const [solImages, setSolImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isEditMode = !!editQuestion;

  useEffect(() => {
    if (editQuestion) {
      setQNum(editQuestion.question_number?.toString() || '');
      setQPrompt(editQuestion.native_prompt || '');
      setQScore(editQuestion.max_score?.toString() || '2.5');
      setQImages([]); setSolImages([]);
    } else {
      setQNum(''); setQPrompt(''); setQScore('2.5'); setQImages([]); setSolImages([]);
    }
    setErrorMessage('');
  }, [editQuestion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!qNum) { setErrorMessage('Vui lòng nhập số câu hỏi'); return; }
    if (!isEditMode && solImages.length === 0) { setErrorMessage('Vui lòng chọn ít nhất 1 ảnh lời giải mẫu'); return; }
    setSubmitting(true);
    const form = new FormData();
    form.append('question_number', qNum);
    form.append('native_prompt', qPrompt);
    form.append('max_score', qScore);
    Array.from(qImages).forEach(f => form.append('question_images', f));
    Array.from(solImages).forEach(f => form.append('solution_images', f));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/assignment/${assignmentId}/question`, { method: 'POST', body: form, credentials: 'include' });
      if (!res.ok) { setErrorMessage(`Lỗi: ${await res.text()}`); return; }
      onQuestionAdded();
      onClose();
    } catch (err) { setErrorMessage('Lỗi kết nối: ' + err.message); } finally { setSubmitting(false); }
  };

  const title = isEditMode ? `Sửa Câu ${editQuestion.question_number}` : 'Thêm Câu Hỏi Vào Đề Thi';
  const btnLabel = isEditMode ? 'Lưu thay đổi' : 'Thêm câu hỏi';
  const BtnIcon = isEditMode ? Save : Plus;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>

        {errorMessage && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2"><AlertCircle className="w-4 h-4 shrink-0 text-red-500" /><span>{errorMessage}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số thứ tự câu:</label>
              <input type="number" required placeholder="Ví dụ: 1" disabled={isEditMode} className={`w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`} value={qNum} onChange={e => setQNum(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Điểm tối đa:</label>
              <input type="number" step="0.01" required placeholder="2.5" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm" value={qScore} onChange={e => setQScore(e.target.value)} />
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5 shadow-sm">
            <label className="flex items-center space-x-1.5 font-bold text-amber-800"><HelpCircle className="w-3.5 h-3.5 text-amber-600" /> <span>1. Ảnh Đề bài {isEditMode && '(Chọn để thay thế)'}</span></label>
            <input type="file" multiple accept="image/*" className="w-full text-[11px] text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-slate-800 file:shadow-sm cursor-pointer" onChange={e => setQImages(e.target.files)} />
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5 shadow-sm">
            <label className="flex items-center space-x-1.5 font-bold text-emerald-800"><FileCheck className="w-3.5 h-3.5 text-emerald-600" /> <span>2. Ảnh Lời giải mẫu {isEditMode ? '(Chọn để thay thế)' : '(Bắt buộc)'}</span></label>
            <input type="file" required={!isEditMode} multiple accept="image/*" className="w-full text-[11px] text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-slate-800 file:shadow-sm cursor-pointer" onChange={e => setSolImages(e.target.files)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lưu ý cho Gemini (tùy chọn):</label>
            <textarea placeholder="Ví dụ: Chấm gắt bước phá ngoặc dấu trừ..." className="w-full h-16 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 resize-none shadow-sm" value={qPrompt} onChange={e => setQPrompt(e.target.value)} />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Hủy</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center space-x-1.5"><BtnIcon className="w-4 h-4" /> <span>{submitting ? 'Đang lưu...' : btnLabel}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
