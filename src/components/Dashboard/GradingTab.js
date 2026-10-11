import React, { useState, useEffect, useCallback } from 'react';
import { apiService, API_BASE_URL } from '../../services/apiService';
import GradingWorkspace from './GradingWorkspace';
import AssignmentSelectorColumn from './AssignmentSelectorColumn';
import StudentSelectorColumn from './StudentSelectorColumn';
import StudentReportModal from './StudentReportModal';
import { ClassReportGenerator } from '../../services/ClassReportGenerator';

/**
 * Grading selector tab with assignment and student workflows, batch grading, and whole-class Excel export.
 */
export const GradingTab = ({ defaultClassroom }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [uploadSummary, setUploadSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchGrading, setBatchGrading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 });
  const [classReportDocument, setClassReportDocument] = useState(null);
  const [exportingAll, setExportingAll] = useState(false);

  const loadData = useCallback(async () => {
    if (!defaultClassroom) return;
    setLoading(true);
    try {
      const [assData, stdData] = await Promise.all([
        apiService.get(`/admin/classroom/${defaultClassroom.id}/assignments`),
        apiService.get(`/admin/classroom/${defaultClassroom.id}/students`),
      ]);
      setAssignments(assData || []);
      setStudents(stdData || []);
    } catch (_) {} finally { setLoading(false); }
  }, [defaultClassroom]);

  useEffect(() => { setSelectedAssignment(null); setSelectedStudent(null); loadData(); }, [defaultClassroom, loadData]);

  const handleSelectAssignment = async (ass) => {
    setSelectedAssignment(ass);
    setSelectedStudent(null);
    try {
      const [qData, summary] = await Promise.all([
        apiService.get(`/admin/assignment/${ass.id}/questions`),
        apiService.get(`/admin/assignment/${ass.id}/upload-summary`),
      ]);
      setQuestions(qData || []);
      setUploadSummary(summary || []);
    } catch (_) { setQuestions([]); setUploadSummary([]); }
  };

  const handleBatchGrade = async () => {
    const eligible = uploadSummary.filter((s) => s.uploaded_count > 0);
    if (eligible.length === 0) return;
    setBatchGrading(true);
    setBatchProgress({ done: 0, total: eligible.length });
    for (let i = 0; i < eligible.length; i++) {
      try {
        await fetch(`${API_BASE_URL}/admin/grade-uploads`, {
          method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: eligible[i].student_id, assignment_id: selectedAssignment.id }),
        });
      } catch (_) {}
      setBatchProgress({ done: i + 1, total: eligible.length });
    }
    setBatchGrading(false);
  };

  const handleExportAllGraded = async () => {
    setExportingAll(true);
    try {
      const doc = await ClassReportGenerator.generateClassReport(apiService, students, selectedAssignment, questions, defaultClassroom);
      if (!doc) { alert('Chưa có học sinh nào có bài chấm cho đề thi này.'); return; }
      setClassReportDocument(doc);
    } catch (err) { console.error(err); } finally { setExportingAll(false); }
  };

  if (defaultClassroom && selectedAssignment && selectedStudent) {
    return <GradingWorkspace classroom={defaultClassroom} assignment={selectedAssignment} student={selectedStudent} questions={questions} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-sm sm:text-base font-black text-slate-900">Không Gian Chấm Bài AI</h2>
        <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{defaultClassroom?.name}</span> • Chọn Đề thi → Chọn Học sinh</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1">
        <AssignmentSelectorColumn assignments={assignments} selectedAssignment={selectedAssignment} loading={loading} onSelectAssignment={handleSelectAssignment} />
        <StudentSelectorColumn selectedAssignment={selectedAssignment} students={students} uploadSummary={uploadSummary} onSelectStudent={setSelectedStudent} onBatchGrade={handleBatchGrade} batchGrading={batchGrading} batchProgress={batchProgress} onExportAllGraded={handleExportAllGraded} exportingAll={exportingAll} />
      </div>
      {classReportDocument && <StudentReportModal document={classReportDocument} onClose={() => setClassReportDocument(null)} />}
    </div>
  );
};

export default GradingTab;
