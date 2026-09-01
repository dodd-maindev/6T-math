import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, School, MapPin, Phone, Edit3 } from 'lucide-react';
import EditStudentModal from './EditStudentModal';

/**
 * Responsive view rendering student profile details, KPIs, and submission history.
 */
export const StudentProfileView = ({ student, submissions, onBack, onSelectSubmission, onStudentUpdated }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);

  const scores = submissions.map((s) => parseFloat(s.score || 0));
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';
  const highest = scores.length ? Math.max(...scores).toFixed(1) : '0.0';

  const handleUpdated = (updated) => {
    setCurrentStudent(updated);
    if (onStudentUpdated) onStudentUpdated(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col h-full text-slate-800 overflow-y-auto shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button onClick={onBack} className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 text-xs font-semibold cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> <span>Quay lại danh sách</span>
        </button>
        <button onClick={() => setIsEditOpen(true)} className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-sm transition-all cursor-pointer">
          <Edit3 className="w-3.5 h-3.5" /> <span>Sửa thông tin / Đổi MK</span>
        </button>
      </div>

      {/* Student Details Card */}
      <div className="p-4 bg-gradient-to-r from-purple-50/60 to-indigo-50/60 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white font-black text-base flex items-center justify-center shadow-md shrink-0">
            {currentStudent.full_name ? currentStudent.full_name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">{currentStudent.full_name || currentStudent.email}</h2>
            <p className="text-xs text-purple-700 font-semibold">Tài khoản: <span className="font-bold">{currentStudent.email}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 border-t sm:border-t-0 sm:border-l border-purple-200 pt-2 sm:pt-0 sm:pl-4">
          <div className="flex items-center space-x-1.5"><School className="w-3.5 h-3.5 text-purple-600 shrink-0" /><span>{currentStudent.school || 'Chưa có trường'}</span></div>
          <div className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" /><span>{currentStudent.address || 'Chưa có địa chỉ'}</span></div>
          <div className="flex items-center space-x-1.5"><Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" /><span>{currentStudent.phone_number || 'Chưa có SĐT'}</span></div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-amber-50/70 border border-amber-200 p-2.5 sm:p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-lg sm:text-xl font-black text-amber-700">{avg}</p>
          <p className="text-[9px] sm:text-[10px] text-amber-800 font-bold uppercase mt-0.5">ĐIỂM TB</p>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 sm:p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-lg sm:text-xl font-black text-emerald-700">{highest}</p>
          <p className="text-[9px] sm:text-[10px] text-emerald-800 font-bold uppercase mt-0.5">CAO NHẤT</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 sm:p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-lg sm:text-xl font-black text-slate-700">{submissions.length}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase mt-0.5">ĐÃ CHẤM</p>
        </div>
      </div>

      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lịch sử bài nộp</h3>
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {submissions.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6">Chưa nộp bài tập nào</p>
        ) : (
          submissions.map((s) => (
            <div key={s.id} onClick={() => onSelectSubmission(s)} className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate max-w-[180px] sm:max-w-md">{s.assignment_title}</p>
                  <p className="text-[10px] text-slate-400">{new Date(s.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <span className="font-black text-amber-700 text-xs sm:text-sm bg-white px-2.5 sm:px-3 py-1 rounded-lg border border-amber-200 shadow-sm shrink-0">{s.score}đ</span>
            </div>
          ))
        )}
      </div>

      <EditStudentModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} student={currentStudent} onStudentUpdated={handleUpdated} />
    </div>
  );
};

export default StudentProfileView;
