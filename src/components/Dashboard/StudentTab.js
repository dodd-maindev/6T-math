import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import Scorecard from './Scorecard';
import StudentProfileView from './StudentProfileView';
import StudentModal from './StudentModal';
import StudentImportModal from './StudentImportModal';
import StudentListItem from './StudentListItem';
import { UserPlus, Search, GraduationCap, FileSpreadsheet, Loader2 } from 'lucide-react';

/**
 * Responsive student management tab supporting search, manual add, and Excel import.
 */
export const StudentTab = ({ classroom }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStudent, setActiveStudent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modals, setModals] = useState({ add: false, import: false });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      setStudents((await apiService.get(`/admin/classroom/${classroom.id}/students`)) || []);
    } catch (_) { setStudents([]); } finally { setLoading(false); }
  }, [classroom.id]);

  const fetchSubmissions = useCallback(async (studentId) => {
    try {
      setSubmissions((await apiService.get(`/admin/student/${studentId}/submissions`)) || []);
    } catch (_) { setSubmissions([]); }
  }, []);

  useEffect(() => { fetchStudents(); setActiveStudent(null); setActiveSubmission(null); }, [classroom.id, fetchStudents]);

  if (activeSubmission) {
    return <Scorecard submission={activeSubmission} studentName={activeStudent?.full_name || activeStudent?.email} onClose={() => setActiveSubmission(null)} />;
  }
  if (activeStudent) {
    return (
      <StudentProfileView
        student={activeStudent} submissions={submissions} onBack={() => setActiveStudent(null)}
        onSelectSubmission={setActiveSubmission}
        onStudentUpdated={(u) => { setActiveStudent(u); setStudents(prev => prev.map(s => s.id === u.id ? u : s)); }}
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
          <p className="text-[11px] sm:text-xs text-slate-500">Lớp: <span className="font-bold text-amber-700">{classroom.name}</span> {loading ? '(Đang tải...)' : `(${students.length} học sinh)`}</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input type="text" placeholder="Tìm tên, tài khoản..." className="w-full sm:w-48 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500 shadow-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setModals(m => ({ ...m, import: true }))} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 shrink-0">
            <FileSpreadsheet className="w-4 h-4" /><span className="hidden xs:inline">Nhập Excel</span>
          </button>
          <button onClick={() => setModals(m => ({ ...m, add: true }))} className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 shrink-0">
            <UserPlus className="w-4 h-4" /><span className="hidden xs:inline">+ Thêm học sinh</span><span className="xs:hidden">+ Thêm</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2"><Loader2 className="w-5 h-5 animate-spin text-purple-600" /><span>Đang tải danh sách...</span></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2"><GraduationCap className="w-8 h-8 text-slate-300" /><p>Chưa tìm thấy học sinh nào</p></div>
          ) : (
            filtered.map((std, idx) => (
              <StudentListItem key={std.id} student={std} index={idx} onClick={() => { setActiveStudent(std); fetchSubmissions(std.id); }} />
            ))
          )}
        </div>
      </div>

      <StudentModal isOpen={modals.add} onClose={() => setModals(m => ({ ...m, add: false }))} classroomId={classroom.id} onStudentCreated={fetchStudents} />
      <StudentImportModal isOpen={modals.import} onClose={() => setModals(m => ({ ...m, import: false }))} classroomId={classroom.id} onSuccess={fetchStudents} />
    </div>
  );
};

export default StudentTab;
