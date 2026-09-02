import React, { useState } from 'react';
import { Eye, HelpCircle, ZoomIn } from 'lucide-react';
import { API_HOST } from '../../services/apiService';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

/**
 * Mobile-first question viewer showing exam problem statements and images only.
 */
export const StudentQuestionViewer = ({ questions = [] }) => {
  const [activeImage, setActiveImage] = useState(null);

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
          <span>Đề Bài Thi & Câu Hỏi</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-semibold">{questions.length} câu</span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => {
          const qImages = Array.isArray(q.question_image_urls) ? q.question_image_urls : [];

          return (
            <div key={q.id || q.question_number} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <span className="font-black text-sm text-slate-900">Bài {q.question_number}</span>
                <span className="text-[11px] font-bold text-amber-800 bg-[#fff8ea] border border-amber-300 px-2.5 py-0.5 rounded-lg">
                  {formatScore(q.max_score)} điểm
                </span>
              </div>

              {qImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {qImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(`${API_HOST}${img}`)}
                      className="group relative cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img src={`${API_HOST}${img}`} alt={`Đề bài ${q.question_number}`} className="w-full h-auto max-h-64 object-contain mx-auto" />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-6 h-6 drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Đang cập nhật ảnh đề bài...</p>
              )}
            </div>
          );
        })}
      </div>

      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <img src={activeImage} alt="Phóng to đề bài" className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default StudentQuestionViewer;
