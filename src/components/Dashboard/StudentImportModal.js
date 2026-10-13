import React, { useState, useRef } from 'react';
import { apiService } from '../../services/apiService';
import { StudentExcelParser } from '../../services/StudentExcelParser';
import { X, Upload, FileSpreadsheet, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Modal to import student rosters from Excel files with default password 123456.
 */
export const StudentImportModal = ({ isOpen, onClose, classroomId, onSuccess }) => {
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatusMsg('');
    try {
      setParsed(await StudentExcelParser.parseFile(file));
    } catch (_) {
      setStatusMsg('Không thể đọc file Excel. Vui lòng kiểm tra định dạng.');
    } finally { setLoading(false); }
  };

  const handleStartImport = async () => {
    if (!parsed?.students?.length) return;
    setImporting(true);
    const total = parsed.students.length;
    let [successCount, skippedCount] = [0, 0];
    for (let i = 0; i < total; i++) {
      try {
        await apiService.post('/admin/student', { ...parsed.students[i], classroom_id: classroomId });
        successCount++;
      } catch (_) { skippedCount++; }
      setProgress({ current: i + 1, total });
    }
    setImporting(false);
    setStatusMsg(`Hoàn tất: ${successCount} thành công, ${skippedCount} bỏ qua/đã có.`);
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><FileSpreadsheet className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Nhập Học Sinh Từ Excel</h3>
              <p className="text-[11px] text-slate-500">Mật khẩu mặc định: <span className="font-bold text-amber-600">123456</span></p>
            </div>
          </div>
          <button onClick={onClose} disabled={importing} className="p-1 rounded-lg text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>
        {!parsed ? (
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-7 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-all">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">{loading ? 'Đang đọc...' : 'Chọn file Excel (.xlsx, .xls) mẫu điểm Bộ GD&ĐT'}</p>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">Tìm thấy {parsed.students.length} học sinh {parsed.school && `(${parsed.school})`}</span>
              <button onClick={() => { setParsed(null); setStatusMsg(''); }} className="text-emerald-700 underline text-[11px]">Đổi file</button>
            </div>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
              {parsed.students.slice(0, 8).map((s, idx) => (
                <div key={idx} className="p-2 flex justify-between items-center">
                  <span className="font-bold text-slate-800">{idx + 1}. {s.full_name}</span>
                  <span className="text-[11px] text-slate-500">TK: {s.email} | Pass: 123456</span>
                </div>
              ))}
              {parsed.students.length > 8 && <div className="p-1.5 text-center text-[10px] text-slate-400">... và {parsed.students.length - 8} học sinh khác</div>}
            </div>
          </div>
        )}
        {statusMsg && <div className="p-2.5 bg-slate-100 text-slate-800 text-xs rounded-xl border border-slate-200 font-medium">{statusMsg}</div>}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} disabled={importing} className="px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 text-xs">Đóng</button>
          {parsed && (
            <button onClick={handleStartImport} disabled={importing} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50">
              {importing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Đang nhập ({progress.current}/{progress.total})...</span></> : <><CheckCircle2 className="w-3.5 h-3.5" /><span>Nhập {parsed.students.length} học sinh</span></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentImportModal;
