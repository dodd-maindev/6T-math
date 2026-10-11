import React, { useRef, useState } from 'react';
import { Download, Printer, X, Loader2, FileSpreadsheet } from 'lucide-react';
import StudentReportTable from './StudentReportTable';
import { PdfExportService } from '../../services/PdfExportService';
import { ExcelExportService } from '../../services/ExcelExportService';

/**
 * Modal dialog for previewing and exporting assessment reports to Excel and PDF.
 * @param {object} props - Component properties.
 */
export const StudentReportModal = ({ document: reportDocument, onClose }) => {
  const tableRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const getCleanFileName = (ext) => {
    const studentName = reportDocument?.rows?.[0]?.studentName || 'HocSinh';
    const cleanName = studentName.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_');
    return `Bao_Cao_Hoc_Tap_${cleanName}.${ext}`;
  };

  const handleDownloadExcel = async () => {
    setExportingExcel(true);
    try {
      await ExcelExportService.exportToExcel(reportDocument, getCleanFileName('xlsx'));
    } catch (err) {
      console.error('Excel export failed:', err);
    } finally {
      setExportingExcel(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!tableRef.current) return;
    setDownloadingPdf(true);
    try {
      await PdfExportService.exportToPdf(tableRef.current, getCleanFileName('pdf'));
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-[#107c41]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Xuất Báo Cáo Học Tập (Excel & PDF)</h3>
              <p className="text-[11px] text-slate-500">Chuẩn theo mẫu Bao_Cao_Hoc_Tap_Toan_9NC.xlsx</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleDownloadExcel} disabled={exportingExcel} className="px-3.5 py-1.5 bg-[#107c41] hover:bg-[#0d6535] text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors">
              {exportingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
              <span>{exportingExcel ? 'Đang xuất Excel...' : 'Tải File Excel (.xlsx)'}</span>
            </button>
            <button onClick={handleDownloadPdf} disabled={downloadingPdf} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors">
              {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Tải PDF</span>
            </button>
            <button onClick={() => PdfExportService.printViaBrowser(tableRef.current, reportDocument.bannerTitle)} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /><span>In</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <StudentReportTable document={reportDocument} tableRef={tableRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReportModal;
