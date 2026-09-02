import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../services/apiService';
import StudentClassroomHeader from '../../components/Student/StudentClassroomHeader';
import StudentAssignmentList from '../../components/Student/StudentAssignmentList';
import StudentQuestionViewer from '../../components/Student/StudentQuestionViewer';
import Scorecard from '../../components/Dashboard/Scorecard';
import buildAggregatedSubmission from '../../components/Dashboard/gradingAggregator';
import { BookOpen, FileCheck, Loader2 } from 'lucide-react';

/**
 * Mobile-first Student Dashboard with real-time polling and auto-refresh on tab change.
 */
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(true);

  const fetchClassroomAndAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const cRes = await fetch(`${API_BASE_URL}/student/my-classroom`, { credentials: 'include' });
      if (!cRes.ok) return;
      const cData = await cRes.json();
      setClassroom(cData);

      const aRes = await fetch(`${API_BASE_URL}/admin/classroom/${cData.id}/assignments`, { credentials: 'include' });
      if (aRes.ok) {
        const aData = await aRes.json();
        setAssignments(aData);
        if (aData.length > 0) setSelectedAssignment(aData[0]);
      }
    } catch (e) { console.error('Student fetch error:', e); } finally { setLoading(false); }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/student/${user.id}/submissions`, { credentials: 'include' });
      if (res.ok) setSubmissions(await res.json());
    } catch (e) { console.error('Submissions fetch error:', e); }
  }, [user?.id]);

  useEffect(() => { fetchClassroomAndAssignments(); fetchSubmissions(); }, [fetchClassroomAndAssignments, fetchSubmissions]);

  // Real-time polling every 5s + auto-fetch on window focus
  useEffect(() => {
    const timer = setInterval(fetchSubmissions, 5000);
    const onFocus = () => fetchSubmissions();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(timer); window.removeEventListener('focus', onFocus); };
  }, [fetchSubmissions]);

  useEffect(() => {
    if (!selectedAssignment?.id) return;
    fetch(`${API_BASE_URL}/admin/assignment/${selectedAssignment.id}/questions`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setQuestions(data))
      .catch(e => console.error('Questions error:', e));
  }, [selectedAssignment]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'scorecard') fetchSubmissions();
  };

  const assignmentSubs = submissions.filter(s => s.assignment_id === selectedAssignment?.id);
  const aggregated = selectedAssignment ? buildAggregatedSubmission(selectedAssignment, assignmentSubs, questions) : null;

  return (
    <div className="min-h-screen pt-5 sm:pt-20 pb-12 bg-slate-50">
      <div className="container mx-auto px-3.5 sm:px-4 max-w-4xl">
        <StudentClassroomHeader user={user} classroom={classroom} assignmentCount={assignments.length} logout={logout} />
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2"><Loader2 className="w-5 h-5 animate-spin text-emerald-600" /><span>Đang tải dữ liệu lớp học...</span></div>
        ) : (
          <>
            <StudentAssignmentList assignments={assignments} selectedAssignment={selectedAssignment} onSelect={setSelectedAssignment} submissions={submissions} currentQuestions={questions} />
            {selectedAssignment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/70 rounded-2xl text-xs font-bold shadow-2xs">
                  <button onClick={() => handleTabChange('questions')} className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all ${activeTab === 'questions' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}><BookOpen className="w-3.5 h-3.5" /><span>Đề Bài</span></button>
                  <button onClick={() => handleTabChange('scorecard')} className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all ${activeTab === 'scorecard' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}><FileCheck className="w-3.5 h-3.5" /><span>Kết Quả</span></button>
                </div>
                {activeTab === 'questions' && <StudentQuestionViewer questions={questions} assignmentId={selectedAssignment.id} />}
                {activeTab === 'scorecard' && (aggregated?.feedback?.questions?.length > 0 ? <Scorecard submission={aggregated} studentName={user?.email?.split('@')[0]} onClose={() => setActiveTab('questions')} /> : <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs font-medium">Giáo viên chưa chấm bài cho bạn. Hãy nộp ảnh bài làm ở tab "Đề Bài" và đợi giáo viên chấm nhé!</div>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
