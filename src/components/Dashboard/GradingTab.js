import React, { useState, useEffect, useCallback } from 'react';
import { apiService, API_BASE_URL } from '../../services/apiService';
import GradingWorkspace from './GradingWorkspace';
import { BookOpen, Sparkles, ChevronRight, UserCheck, Zap, Loader2 } from 'lucide-react';

/**
 * Grading selector tab with upload summary badges and batch grading support.
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

  useEffect(() => {
    setSelectedAssignment(null);
    setSelectedStudent(null);
    loadData();
  }, [defaultClassroom, loadData]);

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

  const getStudentUploadInfo = (studentId) => {
    return uploadSummary.find(s => s.student_id === studentId);
  };

  const handleBatchGrade = async () => {
    const eligible = uploadSummary.filter(s => s.uploaded_count > 0);
    if (eligible.length === 0) return;
    setBatchGrading(true);
    setBatchProgress({ done: 0, total: eligible.length });
    for (let i = 0; i < eligible.length; i++) {
      try {
        await fetch(`${API_BASE_URL}/admin/grade-uploads`, {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: eligible[i].student_id, assignment_id: selectedAssignment.id }),
        });
      } catch (_) {}
      setBatchProgress({ done: i + 1, total: eligible.length });
    }
    setBatchGrading(false);
  };

  if (defaultClassroom && selectedAssignment && selectedStudent) {
    return (
      <GradingWorkspace
        classroom={defaultClassroom}
        assignment={selectedAssignment}
        student={selectedStudent}
        questions={questions}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  const eligibleCount = uploadSummary.filter(s => s.uploaded_count > 0).length;

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-sm sm:text-base font-black text-slate-900">Không Gian Chấm Bài AI</h2>
        <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{defaultClassroom?.name}</span> • Chọn Đề thi → Chọn Học sinh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1">
        {/* Assignment Column */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">1. Chọn đề thi {loading ? '' : `(${assignments.length})`}</h3>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {loading ? (
              [1, 2, 3].map(n => <div key={n} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)
            ) : assignments.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-6">Chưa có đề thi nào trong lớp</p>
            ) : (
              assignments.map(a => (
                <div key={a.id} onClick={() => handleSelectAssignment(a)} className={`p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between shadow-sm ${selectedAssignment?.id === a.id ? 'bg-amber-50 text-amber-900 border border-amber-300' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                  <span className="truncate pr-2">{a.title}</span><ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Column */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">2. Chọn học sinh {loading ? '' : `(${students.length})`}</h3>
          </div>
          {!selectedAssignment ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2 py-8"><BookOpen className="w-8 h-8 text-slate-300" /><p>Vui lòng chọn 1 đề thi trước</p></div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {students.map(s => {
                const info = getStudentUploadInfo(s.id);
                const hasUploads = info && info.uploaded_count > 0;
                return (
                  <div key={s.id} onClick={() => setSelectedStudent(s)} className="p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between bg-slate-50 text-slate-800 hover:bg-amber-50 border border-slate-200 shadow-sm group">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="truncate">{s.full_name ? `${s.full_name} (${s.email})` : s.email}</span>
                      {info && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 font-bold ${hasUploads ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                          {hasUploads ? `${info.uploaded_count}/${info.total_questions} câu` : 'Chưa nộp'}
                        </span>
                      )}
                    </div>
                    {hasUploads && (
                      <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center space-x-1 shrink-0">
                        <Sparkles className="w-3 h-3" /><span>Chấm bài</span>
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Batch Grade Button */}
              {eligibleCount > 0 && (
                <button onClick={handleBatchGrade} disabled={batchGrading} className="w-full mt-3 p-3 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer transition-all">
                  {batchGrading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang chấm {batchProgress.done}/{batchProgress.total}...</span></>
                  ) : (
                    <><Zap className="w-4 h-4" /><span>⚡ Chấm tất cả ({eligibleCount} HS đã nộp)</span></>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingTab;
