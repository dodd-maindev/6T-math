import React, { useState } from 'react';
import { apiService } from '../../services/apiService';
import { X, UserCheck, KeyRound, Save } from 'lucide-react';

/**
 * Modal dialog for updating a student's profile information and changing password.
 */
export const EditStudentModal = ({ isOpen, onClose, student, onStudentUpdated }) => {
  const [fullName, setFullName] = useState(student?.full_name || '');
  const [school, setSchool] = useState(student?.school || '');
  const [address, setAddress] = useState(student?.address || '');
  const [phone, setPhone] = useState(student?.phone_number || '');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const updated = await apiService.put(`/admin/student/${student.id}`, {
        full_name: fullName.trim() || null,
        school: school.trim() || null,
        address: address.trim() || null,
        phone_number: phone.trim() || null,
        new_password: newPassword.trim() || null,
      });
      if (onStudentUpdated) onStudentUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể cập nhật thông tin học sinh');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><UserCheck className="w-4 h-4" /></div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Sửa Thông Tin & Đổi Mật Khẩu</h3>
              <p className="text-[10px] text-slate-500">Tài khoản: <span className="font-bold text-amber-700">{student.email}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        {error && <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-2.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh:</label>
            <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trường học:</label>
              <input type="text" placeholder="THCS Hòa Xá" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={school} onChange={e => setSchool(e.target.value)} />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Địa chỉ:</label>
              <input type="text" placeholder="Hà Nội" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Số điện thoại phụ huynh/học sinh:</label>
            <input type="text" placeholder="0987654321" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <label className="block font-bold text-amber-900 flex items-center space-x-1"><KeyRound className="w-3.5 h-3.5 text-amber-700" /><span>Đổi mật khẩu mới (Để trống nếu không đổi):</span></label>
            <input type="password" placeholder="Nhập mật khẩu mới..." className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Hủy</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center space-x-1">
              <Save className="w-3.5 h-3.5" /><span>{submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
