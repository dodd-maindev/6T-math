import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { FolderPlus } from 'lucide-react';

/**
 * Component representing the classroom creation form for Administrators.
 */
export const ClassroomForm = ({ onClassroomCreated }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const data = await apiService.post('/admin/classroom', { name });
      setMessage(`Đã tạo lớp: ${data.name}`);
      setName('');
      onClassroomCreated(data);
    } catch (err) {
      setError(err.message || 'Failed to create classroom');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <FolderPlus className="w-5 h-5 text-pink-500" />
        <h3 className="text-lg font-bold text-gray-800">Tạo Lớp Học Mới</h3>
      </div>
      {message && <p className="text-green-600 text-sm mb-3 bg-green-50 p-2 rounded-lg">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Tên lớp học (ví dụ: Toán 6 - Nâng cao)"
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-xl text-sm transition-all"
        >
          Tạo Lớp
        </button>
      </form>
    </div>
  );
};

export default ClassroomForm;
