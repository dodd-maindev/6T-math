import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import GradingWorkspace from './GradingWorkspace';
import { BookOpen, Sparkles, ChevronRight, UserCheck } from 'lucide-react';

/**
 * Responsive grading selector tab linking assignments and enrolled students.
 */
export const GradingTab = ({ defaultClassroom }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [questions, setQuestions] = useState([]);

  const loadData = useCallback(async () => {
    if (!defaultClassroom) return;
    try {
      const [assData, stdData] = await Promise.all([
        apiService.get(`/admin/classroom/${defaultClassroom.id}/assignments`),
        apiService.get(`/admin/classroom/${defaultClassroom.id}/students`),
      ]);
      setAssignments(assData || []);
      setStudents(stdData || []);
    } catch (_) {}
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
      const qData = await apiService.get(`/admin/assignment/${ass.id}/questions`);
      setQuestions(qData || []);
    } catch (_) { setQuestions([]); }
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

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-sm sm:text-base font-black text-slate-900">Không Gian Chấm Bài AI</h2>
        <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{defaultClassroom?.name}</span> • Chọn Đề thi $\rightarrow$ Chọn Học sinh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">1. Chọn đề thi ({assignments.length})</h3>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {assignments.length === 0 ? (<p className="text-slate-400 text-xs text-center py-6">Chưa có đề thi nào trong lớp</p>) : (
              assignments.map(a => (
                <div key={a.id} onClick={() => handleSelectAssignment(a)} className={`p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between shadow-sm ${selectedAssignment?.id === a.id ? 'bg-amber-50 text-amber-900 border border-amber-300' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>
                  <span className="truncate pr-2">{a.title}</span><ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 text-slate-700 mb-3 border-b border-slate-100 pb-2.5">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">2. Chọn học sinh ({students.length})</h3>
          </div>
          {!selectedAssignment ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2 py-8"><BookOpen className="w-8 h-8 text-slate-300" /><p>Vui lòng chọn 1 đề thi trước</p></div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {students.length === 0 ? (<p className="text-slate-400 text-xs text-center py-6">Lớp chưa có học sinh</p>) : (
                students.map(s => (
                  <div key={s.id} onClick={() => setSelectedStudent(s)} className="p-3 sm:p-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between bg-slate-50 text-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-200 shadow-sm group">
                    <span className="truncate pr-2">{s.email}</span>
                    <span className="text-[10px] bg-white group-hover:bg-slate-950 group-hover:text-amber-400 text-amber-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors flex items-center space-x-1 shrink-0"><Sparkles className="w-3 h-3" /><span>Chấm bài</span></span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingTab;
