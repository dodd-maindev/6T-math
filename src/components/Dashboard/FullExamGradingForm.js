import React, { useState } from 'react';
import { API_BASE_URL } from '../../services/apiService';
import { FileText, Sparkles, AlertCircle, Layers } from 'lucide-react';

/**
 * Form component for full-exam automated grading via a single PDF or multiple images.
 */
export const FullExamGradingForm = ({ assignment, student, questions = [], onGradingComplete, onError }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFullGrade = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) { setErrorMessage('Vui lòng chọn 1 file PDF hoặc các ảnh bài làm'); return; }
    setSubmitting(true); setErrorMessage('');
    const form = new FormData();
    form.append('student_id', student.id);
    form.append('assignment_id', assignment.id);
    Array.from(selectedFiles).forEach(f => form.append('pdf', f));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/student/grade-full-exam`, { method: 'POST', body: form, credentials: 'include' });
      if (!res.ok) {
        const errorText = await res.text();
        setErrorMessage(`Lỗi từ máy chủ: ${errorText}`);
        if (onError) onError(errorText);
        return;
      }
      const data = await res.json();
      if (onGradingComplete) onGradingComplete(data);
    } catch (err) {
      setErrorMessage(`Lỗi kết nối: ${err.message}`);
      if (onError) onError(err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleFullGrade} className="space-y-4 text-xs">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 shadow-sm">
        <div className="flex items-center space-x-2 text-emerald-900 font-bold">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Chấm tự động toàn bộ {questions.length} câu hỏi của đề thi</span>
        </div>
        <p className="text-[11px] text-emerald-700">
          Hệ thống sẽ gửi {questions.length} request song song tới Gemini để tìm và chấm từng câu một cách độc lập từ toàn bộ tài liệu bài làm.
        </p>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1.5 flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Tải lên File PDF bài làm hoặc Tập ảnh (Toàn bộ bài thi):</span>
        </label>
        <input
          type="file"
          required
          multiple
          accept=".pdf,image/*"
          className="w-full text-[11px] text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-amber-100 file:text-amber-900 file:font-bold hover:file:bg-amber-200 cursor-pointer shadow-sm"
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || questions.length === 0}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>{submitting ? `Gemini đang chấm song song ${questions.length} câu hỏi...` : `🚀 Bắt đầu Chấm Tự Động Toàn Đề (${questions.length} câu)`}</span>
      </button>
    </form>
  );
};

export default FullExamGradingForm;
