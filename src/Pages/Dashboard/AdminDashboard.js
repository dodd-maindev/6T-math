import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import AppTopNav from '../../components/Dashboard/AppTopNav';
import ClassroomModal from '../../components/Dashboard/ClassroomModal';
import StudentTab from '../../components/Dashboard/StudentTab';
import ExamTab from '../../components/Dashboard/ExamTab';
import GradingTab from '../../components/Dashboard/GradingTab';
import { School, Plus } from 'lucide-react';

/**
 * Main dashboard container with responsive layout across all device screens.
 */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState('students');
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);

  const fetchClassrooms = useCallback(async () => {
    try {
      const data = await apiService.get('/admin/classroom');
      const list = Array.isArray(data) ? data : [];
      setClassrooms(list);
      if (list.length > 0) {
        setSelectedClassroom((prev) => {
          if (prev && list.some((c) => c.id === prev.id)) return prev;
          return list[0];
        });
      }
    } catch (_) {
      setClassrooms([]);
    }
  }, []);

  const handleClassroomCreated = useCallback((newClassroom) => {
    if (!newClassroom) return;
    setClassrooms((prev) => [...prev, newClassroom].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedClassroom(newClassroom);
  }, []);

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  return (
    <div className="w-full min-h-screen sm:h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <AppTopNav
        classrooms={classrooms}
        selectedClassroom={selectedClassroom}
        onSelectClassroom={setSelectedClassroom}
        onOpenCreateClassroom={() => setIsClassroomModalOpen(true)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        user={user}
        logout={logout}
      />

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-3 sm:p-6 overflow-y-auto">
        {selectedClassroom ? (
          <div className="flex-1 flex flex-col w-full">
            {currentTab === 'students' && <StudentTab classroom={selectedClassroom} />}
            {currentTab === 'exams' && <ExamTab classroom={selectedClassroom} />}
            {currentTab === 'grading' && <GradingTab defaultClassroom={selectedClassroom} />}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 py-12">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600 shadow-sm">
              <School className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="text-center px-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Chào mừng đến với CLB 6T MATH</h2>
              <p className="text-xs text-slate-500 mt-1">Chưa có lớp học nào được chọn. Hãy tạo lớp học đầu tiên để bắt đầu.</p>
            </div>
            <button
              onClick={() => setIsClassroomModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Lớp Học Đầu Tiên</span>
            </button>
          </div>
        )}
      </main>

      <ClassroomModal
        isOpen={isClassroomModalOpen}
        onClose={() => setIsClassroomModalOpen(false)}
        onClassroomCreated={handleClassroomCreated}
      />
    </div>
  );
};

export default AdminDashboard;
