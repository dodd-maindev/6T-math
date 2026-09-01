import React, { useState } from 'react';
import { API_BASE_URL } from '../../services/apiService';
import { Plus, HelpCircle, FileCheck, AlertCircle } from 'lucide-react';

/**
 * Form for adding a new question with multi-file pickers in bright light theme.
 */
export const QuestionForm = ({ assignmentId, onQuestionAdded }) => {
  const [qNum, setQNum] = useState('');
  const [qPrompt, setQPrompt] = useState('');
  const [qScore, setQScore] = useState('2.5');
  const [qImages, setQImages] = useState([]);
  const [solImages, setSolImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!qNum) { setErrorMessage('Vui lòng nhập số câu hỏi'); return; }
    if (solImages.length === 0) { setErrorMessage('Vui lòng chọn ít nhất 1 ảnh lời giải mẫu'); return; }
    
    setSubmitting(true);
    const form = new FormData();
    form.append('question_number', qNum);
    form.append('native_prompt', qPrompt);
    form.append('max_score', qScore);
    Array.from(qImages).forEach(f => form.append('question_images', f));
    Array.from(solImages).forEach(f => form.append('solution_images', f));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/assignment/${assignmentId}/question`, {
        method: 'POST', body: form, credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        setErrorMessage(`Lỗi từ máy chủ (${res.status}): ${text}`);
        return;
      }
      setQNum(''); setQPrompt(''); setQImages([]); setSolImages([]);
      onQuestionAdded();
    } catch (err) {
      setErrorMessage('Không thể kết nối đến máy chủ: ' + err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-3.5 sm:space-y-4 shadow-sm text-xs">
      <h3 className="text-xs sm:text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Thêm câu hỏi mới vào đề thi</h3>
      {errorMessage && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2"><AlertCircle className="w-4 h-4 shrink-0 text-red-500" /><span>{errorMessage}</span></div>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Số thứ tự câu:</label>
          <input type="number" required placeholder="Ví dụ: 1" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm" value={qNum} onChange={e => setQNum(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Điểm tối đa:</label>
          <input type="number" step="0.01" required placeholder="2.5" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm" value={qScore} onChange={e => setQScore(e.target.value)} />
        </div>
      </div>

      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1.5 shadow-sm">
        <label className="flex items-center space-x-1.5 font-bold text-amber-800"><HelpCircle className="w-3.5 h-3.5 text-amber-600" /> <span>1. Ảnh Đề bài (Chọn 1 hoặc nhiều ảnh)</span></label>
        <input type="file" multiple accept="image/*" className="w-full text-[11px] text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-slate-800 file:shadow-sm cursor-pointer" onChange={e => setQImages(e.target.files)} />
      </div>

      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-1.5 shadow-sm">
        <label className="flex items-center space-x-1.5 font-bold text-emerald-800"><FileCheck className="w-3.5 h-3.5 text-emerald-600" /> <span>2. Ảnh Lời giải mẫu & Thang điểm (Bắt buộc)</span></label>
        <input type="file" required multiple accept="image/*" className="w-full text-[11px] text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:bg-white file:text-slate-800 file:shadow-sm cursor-pointer" onChange={e => setSolImages(e.target.files)} />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Lưu ý cho Gemini (tùy chọn):</label>
        <textarea placeholder="Ví dụ: Chấm gắt bước phá ngoặc dấu trừ..." className="w-full h-16 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 resize-none shadow-sm" value={qPrompt} onChange={e => setQPrompt(e.target.value)} />
      </div>

      <button type="submit" disabled={submitting} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"><Plus className="w-4 h-4" /> <span>{submitting ? 'Đang thêm...' : 'Thêm câu hỏi vào đề'}</span></button>
    </form>
  );
};

export default QuestionForm;
