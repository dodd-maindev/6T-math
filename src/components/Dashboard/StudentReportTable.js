import React from 'react';
import MathText from '../Common/MathText';

/**
 * Renders the assessment report table matching Bao_Cao_Hoc_Tap_Toan_9NC.xlsx.
 * @param {object} props - Component properties.
 * @param {import('../../models/StudentReportModel').ClassroomReportDocument} props.document - Report document.
 * @param {React.Ref} props.tableRef - Reference to the printable container.
 */
export const StudentReportTable = ({ document: reportDocument, tableRef }) => {
  if (!reportDocument) return null;

  return (
    <div ref={tableRef} className="bg-white p-6 sm:p-8 text-slate-800 font-sans max-w-5xl mx-auto shadow-sm print:shadow-none print:p-0">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-[#1F4E78] mb-1">
          {reportDocument.bannerTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
          Đề thi: {reportDocument.assignmentTitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#D9D9D9] text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#1F4E78] text-white">
              <th className="border border-[#D9D9D9] p-2.5 text-center font-bold w-[6%]">STT</th>
              <th className="border border-[#D9D9D9] p-2.5 text-center font-bold w-[16%]">Họ và tên</th>
              <th className="border border-[#D9D9D9] p-2.5 text-center font-bold w-[50%]">Nhận xét các câu thành phần</th>
              <th className="border border-[#D9D9D9] p-2.5 text-center font-bold w-[10%]">Tổng điểm</th>
              <th className="border border-[#D9D9D9] p-2.5 text-center font-bold w-[18%]">Nhận xét chung</th>
            </tr>
          </thead>
          <tbody>
            {reportDocument.rows.map((row) => (
              <tr key={row.indexNumber} className="hover:bg-slate-50/50">
                <td className="border border-[#D9D9D9] p-3 text-center align-top font-medium text-slate-700">
                  {row.indexNumber}
                </td>
                <td className="border border-[#D9D9D9] p-3 text-center align-top font-bold text-slate-900">
                  {row.studentName}
                </td>
                <td className="border border-[#D9D9D9] p-3 text-left align-top leading-relaxed text-slate-800 space-y-2">
                  {row.questionReports.map((q, idx) => (
                    <div key={idx} className="mb-2 last:mb-0">
                      <span className="font-bold text-slate-900">• {q.questionTitle} {q.formatScoreText()}:</span>{' '}
                      <span className="text-slate-700 inline">
                        <MathText text={q.comment} />
                      </span>
                    </div>
                  ))}
                </td>
                <td className="border border-[#D9D9D9] p-3 text-center align-top font-black text-slate-900 text-sm">
                  {row.formatTotalScore()}
                </td>
                <td className="border border-[#D9D9D9] p-3 text-left align-top leading-relaxed text-slate-700 whitespace-pre-line text-xs">
                  {row.generalComment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentReportTable;
