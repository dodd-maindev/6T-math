import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import Scorecard from './Scorecard';
import { buildAggregatedSubmission } from './gradingAggregator';
import FullExamGradingForm from './FullExamGradingForm';
import SingleQuestionGradingForm from './SingleQuestionGradingForm';
import { ArrowLeft, History, Calendar, Award, FileText, CheckCircle2 } from 'lucide-react';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Grading workspace supporting both full exam PDF parallel grading and single question grading.
 */
export const GradingWorkspace = ({ classroom, assignment, student, questions, onBack }) => {
  const [gradingMode, setGradingMode] = useState('full');
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]?.question_number?.toString() || '1');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await apiService.get(`/admin/student/${student.id}/submissions`);
      setHistory((data || []).filter(s => s.assignment_id === assignment.id));
    } catch (_) { setHistory([]); }
  }, [student.id, assignment.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleFullExamComplete = (newSubmissions) => {
    fetchHistory();
    const allSubs = [...(Array.isArray(newSubmissions) ? newSubmissions : [newSubmissions]), ...history];
    setSubmissionResult(buildAggregatedSubmission(assignment, allSubs, questions));
  };

  const handleSingleQuestionComplete = (sub) => {
    fetchHistory();
    setSubmissionResult(sub);
  };

  if (submissionResult) {
    return <Scorecard submission={submissionResult} studentName={student.email} onClose={() => setSubmissionResult(null)} />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col h-full text-slate-800 max-w-2xl w-full mx-auto overflow-y-auto shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2 sm:gap-0">
        <button onClick={onBack} className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-semibold self-start"><ArrowLeft className="w-3.5 h-3.5" /> <span>Quay lại</span></button>
        <span className="text-[11px] sm:text-xs text-slate-500">Lớp: <b className="text-slate-900">{classroom.name}</b> | Đề: <b className="text-amber-600">{assignment.title}</b></span>
      </div>

      <div className="mb-4 bg-amber-50/70 p-3.5 sm:p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm">
        <div><h3 className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider mb-0.5">Chấm bài cho học sinh</h3><p className="text-base sm:text-lg font-black text-slate-900 truncate max-w-xs">{student.email}</p></div>
        {history.length > 0 && (
          <button onClick={() => setSubmissionResult(buildAggregatedSubmission(assignment, history, questions))} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5 self-start sm:self-auto transition-transform hover:scale-105 cursor-pointer">
            <Award className="w-4 h-4" /><span>Tổng Hợp Điểm Toàn Đề</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
        <button type="button" onClick={() => setGradingMode('full')} className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${gradingMode === 'full' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><FileText className="w-3.5 h-3.5" /><span>Chấm toàn bộ đề (1 File PDF)</span></button>
        <button type="button" onClick={() => setGradingMode('single')} className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${gradingMode === 'single' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>Chấm từng câu lẻ</span></button>
      </div>

      {gradingMode === 'full' ? (
        <FullExamGradingForm assignment={assignment} student={student} questions={questions} onGradingComplete={handleFullExamComplete} />
      ) : (
        <SingleQuestionGradingForm assignment={assignment} student={student} questions={questions} selectedQuestion={selectedQuestion} onQuestionChange={setSelectedQuestion} onGradingComplete={handleSingleQuestionComplete} />
      )}

      {history.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5"><History className="w-3.5 h-3.5 text-amber-600" /> <span>Lịch sử các lần chấm:</span></h4>
          <div className="space-y-1.5">{history.map(s => (
            <div key={s.id} onClick={() => setSubmissionResult(s)} className="p-2.5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center space-x-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span className="text-slate-700 font-medium">{new Date(s.created_at).toLocaleString('vi-VN')}</span><span className="text-slate-900 font-bold ml-2 bg-slate-200 px-2 py-0.5 rounded text-[10px]">{s.feedback?.questions?.[0]?.question_title || 'Câu hỏi'}</span></div>
              <span className="font-black text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm text-[11px]">{formatScore(s.score)} điểm</span>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
};

export default GradingWorkspace;
