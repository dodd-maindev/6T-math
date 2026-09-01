import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { UserPlus } from 'lucide-react';

/**
 * Component representing the student registration form for Administrators.
 */
export const StudentForm = ({ classrooms }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    
    if (!classroomId) {
      setError('Vui lòng chọn một lớp học');
      return;
    }

    try {
      await apiService.post('/admin/student', {
        email: username,
        password,
        classroom_id: classroomId,
      });
      setMessage(`Đã tạo học sinh: ${username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message.includes('already in use') ? 'Tên đăng nhập hoặc Email đã được sử dụng!' : err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-800">Tạo Tài Khoản Học Sinh</h3>
      </div>
      {message && <p className="text-green-600 text-sm mb-3 bg-green-50 p-2 rounded-lg">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Tên đăng nhập học sinh"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Mật khẩu tài khoản"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
        >
          <option value="">-- Chọn lớp học --</option>
          {classrooms.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 rounded-xl text-sm transition-all"
        >
          Tạo Học Sinh
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
