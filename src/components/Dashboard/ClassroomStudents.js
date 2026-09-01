import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { ArrowLeft, User, RefreshCw } from 'lucide-react';

/**
 * Component to display the list of students enrolled in a specific classroom.
 */
export const ClassroomStudents = ({ classroom, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.get(`/admin/classroom/${classroom.id}/students`);
      setStudents(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [classroom.id]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center space-x-1 text-gray-500 hover:text-pink-500 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
        <button
          onClick={fetchStudents}
          className="p-2 text-gray-400 hover:text-pink-500 transition-colors rounded-lg"
          title="Tải lại"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Lớp: <span className="text-pink-500">{classroom.name}</span>
      </h3>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      )}

      {!loading && error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {students.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Chưa có học sinh nào trong lớp này.</p>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100"
              >
                <div className="bg-pink-100 p-2 rounded-full">
                  <User className="w-4 h-4 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{student.email}</p>
                  <p className="text-xs text-gray-400">
                    Đăng ký: {new Date(student.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClassroomStudents;
