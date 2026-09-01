import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { X, UserPlus, Plus } from 'lucide-react';

/**
 * Modal dialog for registering a new student with extended profile.
 */
export const StudentModal = ({ isOpen, onClose, classroomId, onStudentCreated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setSubmitting(true);
    setError('');
    try {
      await apiService.post('/admin/student', {
        email: username.trim(),
        password,
        classroom_id: classroomId,
        full_name: fullName.trim() || null,
        school: school.trim() || null,
        address: address.trim() || null,
      });
      setUsername(''); setPassword(''); setFullName(''); setSchool(''); setAddress('');
      onStudentCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể tạo học sinh');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><UserPlus className="w-4 h-4" /></div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Đăng Ký Học Sinh Mới</h3>
              <p className="text-[10px] text-slate-500">Tạo tài khoản và hồ sơ học sinh</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        {error && <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên đăng nhập / Email *</label>
              <input type="text" required placeholder="dodao2005" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mật khẩu *</label>
              <input type="password" required placeholder="Mật khẩu" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh</label>
            <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trường học</label>
              <input type="text" placeholder="THCS Hòa Xá" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={school} onChange={e => setSchool(e.target.value)} />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ</label>
              <input type="text" placeholder="Hà Nội" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Hủy</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" /><span>{submitting ? 'Đang tạo...' : 'Lưu học sinh'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
