import React, { useState, useEffect, useCallback } from 'react';
import { Eye, HelpCircle, ZoomIn, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { API_HOST, API_BASE_URL } from '../../services/apiService';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Displays question cards with integrated per-question image upload for students.
 */
export const StudentQuestionViewer = ({ questions = [], assignmentId }) => {
  const [activeImage, setActiveImage] = useState(null);
  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState(null);

  const fetchUploads = useCallback(async () => {
    if (!assignmentId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/student/uploads/${assignmentId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const map = {};
        data.forEach(u => { map[u.question_number] = u.image_urls || []; });
        setUploads(map);
      }
    } catch (_) {}
  }, [assignmentId]);

  useEffect(() => { fetchUploads(); }, [fetchUploads]);

  const handleUpload = async (questionNumber, files) => {
    if (!files || files.length === 0) return;
    setUploading(questionNumber);
    const form = new FormData();
    form.append('assignment_id', assignmentId);
    form.append('question_number', questionNumber);
    Array.from(files).forEach(f => form.append('image', f));
    try {
      const res = await fetch(`${API_BASE_URL}/student/upload`, { method: 'POST', body: form, credentials: 'include' });
      if (res.ok) await fetchUploads();
    } catch (_) {}
    setUploading(null);
  };

  const uploadedCount = Object.keys(uploads).length;
  const totalCount = questions.length;

  if (questions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs font-medium mb-5">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        Chưa có câu hỏi nào trong bài tập này.
      </div>
    );
  }

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Đề Bài Thi & Nộp Bài</span>
        </h3>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${uploadedCount === totalCount && totalCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          Đã nộp {uploadedCount}/{totalCount} câu
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => {
          const qImages = Array.isArray(q.question_image_urls) ? q.question_image_urls : [];
          const uploaded = uploads[q.question_number] || [];
          const isUploading = uploading === q.question_number;

          return (
            <div key={q.id || q.question_number} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm text-slate-900">Bài {q.question_number}</span>
                  <span className="text-[11px] font-bold text-amber-800 bg-[#fff8ea] border border-amber-300 px-2.5 py-0.5 rounded-lg">
                    {formatScore(q.max_score)} điểm
                  </span>
                </div>
                <label className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${uploaded.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'}`}>
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : uploaded.length > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploaded.length > 0 ? 'Nộp lại' : 'Nộp bài'}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(q.question_number, e.target.files)} disabled={isUploading} />
                </label>
              </div>

              {qImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Đề bài:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {qImages.map((img, idx) => (
                      <div key={idx} onClick={() => setActiveImage(`${API_HOST}${img}`)} className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={`${API_HOST}${img}`} alt={`Đề bài ${q.question_number}`} className="w-full h-auto max-h-64 object-contain mx-auto" />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-6 h-6 drop-shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploaded.length > 0 && (
                <div className="pt-2.5 border-t border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" /><span>Bài làm đã nộp ({uploaded.length} ảnh):</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uploaded.map((img, idx) => (
                      <div key={idx} onClick={() => setActiveImage(`${API_HOST}${img}`)} className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/30">
                        <img src={`${API_HOST}${img}`} alt={`Bài làm câu ${q.question_number}`} className="w-full h-auto max-h-40 object-contain mx-auto" />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-5 h-5 drop-shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeImage && (
        <div onClick={() => setActiveImage(null)} className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <img src={activeImage} alt="Phóng to" className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default StudentQuestionViewer;
