import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { API_BASE_URL } from '../../services/apiService';
import QuestionImageGradingCard from './QuestionImageGradingCard';

/**
 * Form for grading individual questions concurrently using uploaded images.
 */
export const ByQuestionGradingForm = ({ assignment, student, questions = [], onGradingComplete }) => {
  const [filesByQuestion, setFilesByQuestion] = useState({});
  const [statusByQuestion, setStatusByQuestion] = useState({});
  const [grading, setGrading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleAddFiles = (qNum, files) => setFilesByQuestion((p) => ({ ...p, [qNum]: [...(p[qNum] || []), ...files] }));
  const handleRemoveFile = (qNum, idx) => setFilesByQuestion((p) => ({ ...p, [qNum]: (p[qNum] || []).filter((_, i) => i !== idx) }));

  const targetQuestions = questions.filter((q) => (filesByQuestion[q.question_number] || []).length > 0);

  const gradeSingle = async (q) => {
    const qNum = q.question_number;
    const formData = new FormData();
    formData.append('student_id', student.id);
    formData.append('assignment_id', assignment.id);
    formData.append('question_number', qNum.toString());
    (filesByQuestion[qNum] || []).forEach((f) => formData.append('images', f));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/student/submission`, {
        method: 'POST', credentials: 'include', body: formData,
      });
      if (!res.ok) throw new Error('Grading failed');
      const data = await res.json();
      setStatusByQuestion((p) => ({ ...p, [qNum]: { state: 'done', score: data.score } }));
      return data;
    } catch (_) {
      setStatusByQuestion((p) => ({ ...p, [qNum]: { state: 'error' } }));
      return null;
    }
  };

  const handleParallelGrade = async () => {
    if (targetQuestions.length === 0 || grading) return;
    setGrading(true);
    setStatusByQuestion((p) => {
      const next = { ...p };
      targetQuestions.forEach((q) => { next[q.question_number] = { state: 'grading' }; });
      return next;
    });

    const results = await Promise.all(targetQuestions.map(gradeSingle));
    const valid = results.filter(Boolean);
    setGrading(false);
    if (valid.length > 0 && onGradingComplete) onGradingComplete(valid);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {questions.map((q) => (
          <QuestionImageGradingCard
            key={q.question_number}
            question={q}
            files={filesByQuestion[q.question_number] || []}
            status={statusByQuestion[q.question_number]}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onPreviewImage={setPreviewImage}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={grading || targetQuestions.length === 0}
        onClick={handleParallelGrade}
        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer"
      >
        {grading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang chấm song song Gemini...</span></> : <><Sparkles className="w-4 h-4" /><span>⚡ Chấm song song ({targetQuestions.length} bài)</span></>}
      </button>

      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-xl p-2 overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setPreviewImage(null)} className="absolute top-3 right-3 bg-slate-800 text-white p-1 rounded-full cursor-pointer hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="preview" className="max-w-full max-h-[85vh] object-contain rounded-lg mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ByQuestionGradingForm;
