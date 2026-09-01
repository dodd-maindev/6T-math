import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import Scorecard from './Scorecard';
import StudentProfileView from './StudentProfileView';
import StudentModal from './StudentModal';
import { UserPlus, Search, ChevronRight, GraduationCap, School } from 'lucide-react';

/**
 * Responsive full-width student management table with search, profile view, and edit.
 */
export const StudentTab = ({ classroom }) => {
  const [students, setStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await apiService.get(`/admin/classroom/${classroom.id}/students`);
      setStudents(data || []);
    } catch (_) { setStudents([]); }
  }, [classroom.id]);

  const fetchSubmissions = useCallback(async (studentId) => {
    try {
      const data = await apiService.get(`/admin/student/${studentId}/submissions`);
      setSubmissions(data || []);
    } catch (_) { setSubmissions([]); }
  }, []);

  useEffect(() => {
    fetchStudents();
    setActiveStudent(null);
    setActiveSubmission(null);
  }, [classroom.id, fetchStudents]);

  if (activeSubmission) {
    return <Scorecard submission={activeSubmission} studentName={activeStudent?.full_name || activeStudent?.email} onClose={() => setActiveSubmission(null)} />;
  }

  if (activeStudent) {
    return (
      <StudentProfileView
        student={activeStudent}
        submissions={submissions}
        onBack={() => setActiveStudent(null)}
        onSelectSubmission={setActiveSubmission}
        onStudentUpdated={(updated) => {
          setActiveStudent(updated);
          setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
        }}
      />
    );
  }

  const filtered = students.filter(s =>
    (s.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.school?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900">Danh Sách Học Sinh</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{classroom.name}</span> ({students.length} học sinh)</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Tìm tên, tài khoản, trường..." className="w-full sm:w-56 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 shrink-0"><UserPlus className="w-4 h-4" /><span className="hidden xs:inline">+ Thêm học sinh</span><span className="xs:hidden">+ Thêm</span></button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2"><GraduationCap className="w-8 h-8 text-slate-300" /><p>Chưa tìm thấy học sinh nào</p></div>
          ) : (
            filtered.map((std, idx) => (
              <div key={std.id} onClick={() => { setActiveStudent(std); fetchSubmissions(std.id); }} className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-purple-50/40 cursor-pointer transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 font-black text-xs flex items-center justify-center shadow-sm shrink-0">{idx + 1}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-purple-900 truncate max-w-[180px] sm:max-w-md">{std.full_name || std.email}</p>
                    <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-400">
                      <span>TK: {std.email}</span>
                      {std.school && <span className="flex items-center space-x-0.5 text-purple-600 font-medium"><School className="w-3 h-3" /><span>{std.school}</span></span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs font-bold text-purple-600 shrink-0"><span className="hidden sm:inline">Xem hồ sơ & sửa</span><ChevronRight className="w-4 h-4" /></div>
              </div>
            ))
          )}
        </div>
      </div>

      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} classroomId={classroom.id} onStudentCreated={fetchStudents} />
    </div>
  );
};

export default StudentTab;
