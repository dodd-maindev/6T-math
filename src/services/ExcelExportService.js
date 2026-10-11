import ExcelJS from 'exceljs';
import { MathFormulaNormalizer } from '../utils/MathFormulaNormalizer';

/**
 * Service to generate and download formatted Excel report files matching Bao_Cao_Hoc_Tap_Toan_9NC.xlsx.
 */
export class ExcelExportService {
  /**
   * Generates and downloads the assessment Excel spreadsheet.
   * @param {import('../models/StudentReportModel').ClassroomReportDocument} reportDocument - Report document data.
   * @param {string} [fileName='Bao_Cao_Hoc_Tap.xlsx'] - Download filename.
   */
  static async exportToExcel(reportDocument, fileName = 'Bao_Cao_Hoc_Tap.xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('BaoCaoHocTap');

    sheet.columns = [
      { width: 8 }, { width: 22 }, { width: 95 }, { width: 16 }, { width: 42 }
    ];

    const titleRow = sheet.getRow(1);
    titleRow.values = [reportDocument.bannerTitle];
    titleRow.height = 36;
    titleRow.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1F4E78' } };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells('A1:E1');

    const subRow = sheet.getRow(2);
    subRow.values = [`Đề thi: ${reportDocument.assignmentTitle}`];
    subRow.height = 20;
    subRow.font = { name: 'Arial', size: 10.5, italic: true, color: { argb: 'FF595959' } };
    subRow.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.mergeCells('A2:E2');

    const headerRow = sheet.getRow(3);
    headerRow.values = ['STT', 'Họ và tên', 'Nhận xét các câu thành phần', 'Tổng điểm', 'Nhận xét chung'];
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
      cell.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin', color: { argb: 'FFD9D9D9' } }, left: { style: 'thin', color: { argb: 'FFD9D9D9' } }, bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } }, right: { style: 'thin', color: { argb: 'FFD9D9D9' } } };
    });

    const borderStyle = {
      top: { style: 'thin', color: { argb: 'FFD9D9D9' } }, left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } }, right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
    };

    reportDocument.rows.forEach((row, idx) => {
      const dataRow = sheet.getRow(4 + idx);
      const questionCommentText = row.questionReports.map((q) => {
        const cleanComment = MathFormulaNormalizer.normalize(q.comment);
        return `• ${q.questionTitle} ${q.formatScoreText()}: ${cleanComment}`;
      }).join('\n');

      dataRow.values = [row.indexNumber, row.studentName, questionCommentText, row.formatTotalScore(), row.generalComment];
      dataRow.getCell(1).alignment = { vertical: 'top', horizontal: 'center' };
      dataRow.getCell(2).alignment = { vertical: 'top', horizontal: 'center' };
      dataRow.getCell(2).font = { name: 'Arial', size: 11, bold: true };
      dataRow.getCell(3).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      dataRow.getCell(3).font = { name: 'Arial', size: 10.5 };
      dataRow.getCell(4).alignment = { vertical: 'top', horizontal: 'center' };
      dataRow.getCell(4).font = { name: 'Arial', size: 11, bold: true };
      dataRow.getCell(5).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      dataRow.getCell(5).font = { name: 'Arial', size: 10.5 };

      for (let c = 1; c <= 5; c++) { dataRow.getCell(c).border = borderStyle; }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export default ExcelExportService;
