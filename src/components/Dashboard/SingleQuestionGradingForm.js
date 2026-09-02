import React, { useState } from 'react';
import { API_BASE_URL } from '../../services/apiService';
import { Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import CloudflareTurnstile from '../Security/CloudflareTurnstile';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Form component for grading a single specific question with Turnstile bot verification.
 */
export const SingleQuestionGradingForm = ({ assignment, student, questions = [], selectedQuestion, onQuestionChange, onGradingComplete, onError }) => {
  const [studentFiles, setStudentFiles] = useState([]);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSingleGrade = async (e) => {
    e.preventDefault();
    if (studentFiles.length === 0) { setErrorMessage('Vui lòng tải lên ít nhất 1 ảnh bài làm'); return; }
    setSubmitting(true); setErrorMessage('');
    const form = new FormData();
    form.append('student_id', student.id);
    form.append('assignment_id', assignment.id);
    if (turnstileToken) form.append('cf_turnstile_response', turnstileToken);
    Array.from(studentFiles).forEach(f => form.append('image', f));
    if (selectedQuestion) form.append('question_number', selectedQuestion);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/student/submission`, { method: 'POST', body: form, credentials: 'include' });
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
    <form onSubmit={handleSingleGrade} className="space-y-3.5 sm:space-y-4 text-xs">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-slate-700 font-bold mb-1">Chọn câu hỏi cần chấm:</label>
        <select
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 text-xs shadow-sm"
          value={selectedQuestion}
          onChange={(e) => onQuestionChange(e.target.value)}
        >
          {questions.map((q) => (
            <option key={q.id} value={q.question_number}>
              Câu {q.question_number} (Tối đa {formatScore(q.max_score)} điểm)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1 flex items-center space-x-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Ảnh bài làm của học sinh (cho câu này):</span>
        </label>
        <input
          type="file"
          required
          multiple
          accept="image/*"
          className="w-full text-[11px] sm:text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-800 shadow-sm cursor-pointer"
          onChange={(e) => setStudentFiles(e.target.files)}
        />
      </div>

      <CloudflareTurnstile onVerify={(token) => setTurnstileToken(token)} />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>{submitting ? 'Gemini đang phân tích & chấm câu này...' : 'Gửi Gemini Chấm điểm câu này'}</span>
      </button>
    </form>
  );
};

export default SingleQuestionGradingForm;
