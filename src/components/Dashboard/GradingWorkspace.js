import React, { useState, useEffect, useCallback } from 'react';
import { apiService, API_BASE_URL } from '../../services/apiService';
import Scorecard from './Scorecard';
import { buildAggregatedSubmission } from './gradingAggregator';
import FullExamGradingForm from './FullExamGradingForm';
import GradingHistoryList from './GradingHistoryList';
import GradingModeSwitcher from './GradingModeSwitcher';
import GradingStudentHeader from './GradingStudentHeader';
import StudentReportModal from './StudentReportModal';
import { StudentReportBuilder } from '../../services/StudentReportBuilder';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * Grading workspace component managing evaluations, history, and PDF export.
 */
export const GradingWorkspace = ({ classroom, assignment, student, questions, onBack }) => {
  const [gradingMode, setGradingMode] = useState('uploads');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [reportDocument, setReportDocument] = useState(null);
  const [history, setHistory] = useState([]);
  const [grading, setGrading] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await apiService.get(`/admin/student/${student.id}/submissions`);
      setHistory((data || []).filter((s) => s.assignment_id === assignment.id));
    } catch (_) { setHistory([]); }
  }, [student.id, assignment.id]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleGradeUploads = async () => {
    setGrading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/grade-uploads`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: student.id, assignment_id: assignment.id }),
      });
      if (res.ok) {
        const newSubs = await res.json();
        fetchHistory();
        const allSubs = [...(Array.isArray(newSubs) ? newSubs : [newSubs]), ...history];
        setSubmissionResult(buildAggregatedSubmission(assignment, allSubs, questions));
      }
    } catch (_) {}
    setGrading(false);
  };

  const handleOpenPdfExport = () => {
    const aggregated = buildAggregatedSubmission(assignment, history, questions);
    const studentRow = StudentReportBuilder.buildSingleStudentRow(student, aggregated, 1);
    setReportDocument(StudentReportBuilder.buildDocument(classroom, assignment, [studentRow]));
  };

  if (submissionResult) {
    return (
      <>
        <Scorecard submission={submissionResult} studentName={student.full_name || student.email} onClose={() => setSubmissionResult(null)} onExportPdf={handleOpenPdfExport} />
        {reportDocument && <StudentReportModal document={reportDocument} onClose={() => setReportDocument(null)} />}
      </>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col h-full text-slate-800 max-w-2xl w-full mx-auto overflow-y-auto shadow-md">
      <GradingStudentHeader
        classroom={classroom}
        assignment={assignment}
        student={student}
        hasHistory={history.length > 0}
        onBack={onBack}
        onAggregate={() => setSubmissionResult(buildAggregatedSubmission(assignment, history, questions))}
        onExportPdf={handleOpenPdfExport}
      />

      <GradingModeSwitcher mode={gradingMode} onChangeMode={setGradingMode} />

      {gradingMode === 'uploads' ? (
        <div className="space-y-4">
          <button onClick={handleGradeUploads} disabled={grading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 cursor-pointer">
            {grading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Gemini đang chấm bài...</span></> : <><Sparkles className="w-4 h-4" /><span>🤖 Chấm bài học sinh này</span></>}
          </button>
        </div>
      ) : (
        <FullExamGradingForm assignment={assignment} student={student} questions={questions} onGradingComplete={(newSubs) => {
          fetchHistory();
          const allSubs = [...(Array.isArray(newSubs) ? newSubs : [newSubs]), ...history];
          setSubmissionResult(buildAggregatedSubmission(assignment, allSubs, questions));
        }} />
      )}

      <GradingHistoryList history={history} onSelectSubmission={setSubmissionResult} />
      {reportDocument && <StudentReportModal document={reportDocument} onClose={() => setReportDocument(null)} />}
    </div>
  );
};

export default GradingWorkspace;
