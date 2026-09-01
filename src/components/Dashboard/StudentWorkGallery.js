import React, { useState } from 'react';
import { API_HOST } from '../../services/apiService';
import { Image as ImageIcon, ExternalLink, X } from 'lucide-react';

/**
 * Responsive student work gallery component with mobile-friendly thumbnails and lightbox modal.
 */
export const StudentWorkGallery = ({ imageUrls = [] }) => {
  const [selectedImg, setSelectedImg] = useState(null);
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 sm:space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] sm:text-xs font-black text-amber-800 flex items-center space-x-1.5 uppercase tracking-wider">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          <span>Ảnh bài làm ({imageUrls.length}):</span>
        </h4>
        <span className="text-[10px] sm:text-[11px] text-slate-400 italic">Bấm để phóng to</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {imageUrls.map((url, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImg(url)}
            className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:border-amber-400 transition-all shadow-sm"
          >
            <img
              src={`${API_HOST}${url}`}
              alt={`Bài làm ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <ExternalLink className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 bg-slate-900/80 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] text-white font-black shadow">
              Trang {idx + 1}
            </div>
          </div>
        ))}
      </div>

      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl border border-slate-300 shadow-2xl">
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute -top-3 -right-3 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={`${API_HOST}${selectedImg}`}
              alt="Chi tiết bài làm"
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentWorkGallery;
