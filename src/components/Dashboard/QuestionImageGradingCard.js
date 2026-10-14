import React from 'react';
import { Eye, Plus, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { API_HOST } from '../../services/apiService';

/**
 * Card component for previewing question assets and picking student work photos.
 */
export const QuestionImageGradingCard = ({ question, files = [], onAddFiles, onRemoveFile, status, onPreviewImage }) => {
  const qNum = question.question_number;
  const qImgs = (question.question_image_urls || []).concat(question.reference_image_url ? [question.reference_image_url] : []);
  const solImgs = question.solution_image_urls || [];
  const qImg = qImgs[0];
  const solImg = solImgs[0] || (qImgs.length > 1 ? qImgs[1] : null);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-sm text-slate-800">Bài {qNum}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{question.max_score || 2.5}đ</span>
        </div>
        <div>
          {status?.state === 'grading' && <span className="flex items-center text-xs text-amber-600 font-bold space-x-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Đang chấm...</span></span>}
          {status?.state === 'done' && <span className="flex items-center text-xs text-emerald-600 font-bold space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>{status.score}đ</span></span>}
          {status?.state === 'error' && <span className="flex items-center text-xs text-rose-600 font-bold space-x-1"><AlertCircle className="w-3.5 h-3.5" /><span>Lỗi</span></span>}
          {!status?.state && <span className="text-[11px] text-slate-400">{files.length > 0 ? `Đã chọn ${files.length} ảnh` : 'Chờ chọn ảnh'}</span>}
        </div>
      </div>

      <div className="flex items-center space-x-3 text-[11px]">
        {qImg && (
          <button type="button" onClick={() => onPreviewImage(`${API_HOST}${qImg}`)} className="flex items-center space-x-1 px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer shadow-2xs">
            <Eye className="w-3 h-3 text-slate-400" /><span>Ảnh đề</span>
          </button>
        )}
        {solImg && (
          <button type="button" onClick={() => onPreviewImage(`${API_HOST}${solImg}`)} className="flex items-center space-x-1 px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 cursor-pointer shadow-2xs">
            <Eye className="w-3 h-3 text-slate-400" /><span>Ảnh đáp án</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="flex items-center justify-center space-x-1.5 p-2.5 rounded-lg border-2 border-dashed border-slate-300 bg-white hover:bg-slate-100 hover:border-teal-400 cursor-pointer text-xs font-bold text-slate-600 transition-all">
          <Plus className="w-4 h-4 text-teal-600" />
          <span>{files.length > 0 ? 'Thêm ảnh bài làm học sinh...' : 'Chọn ảnh bài làm học sinh...'}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onAddFiles(qNum, Array.from(e.target.files || []))} />
        </label>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {files.map((file, idx) => (
              <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => onRemoveFile(qNum, idx)} className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionImageGradingCard;
