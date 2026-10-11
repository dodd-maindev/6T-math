import html2pdf from 'html2pdf.js';

/**
 * Service responsible for exporting printable DOM elements to PDF documents.
 */
export class PdfExportService {
  /**
   * Generates and downloads a PDF file directly from a DOM element.
   * @param {HTMLElement} element - Target HTML element to render into PDF.
   * @param {string} fileName - Destination filename.
   * @returns {Promise<void>} Resolves when download commences.
   */
  static async exportToPdf(element, fileName = 'Bao_Cao_Hoc_Tap.pdf') {
    if (!element) throw new Error('Target element is null');

    const options = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    return html2pdf().set(options).from(element).save();
  }

  /**
   * Initiates native browser print dialog with landscape formatting.
   * @param {HTMLElement} element - Printable DOM element.
   * @param {string} documentTitle - Document title for the print job.
   */
  static printViaBrowser(element, documentTitle = 'Báo Cáo Học Tập') {
    if (!element) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #D9D9D9; padding: 10px; }
            th { background-color: #1F4E78 !important; color: white !important; font-weight: bold; }
            .text-center { text-align: center; }
            .align-top { vertical-align: top; }
            .font-bold { font-weight: bold; }
            h2 { color: #1F4E78; text-align: center; margin-bottom: 4px; }
            p.sub { text-align: center; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 20px; font-size: 13px; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
