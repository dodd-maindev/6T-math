import * as XLSX from 'xlsx';

/**
 * Service to parse student rosters from Excel spreadsheets (.xlsx, .xls).
 */
export class StudentExcelParser {
  /**
   * Parses an Excel file into a list of student records.
   * @param {File} file - Uploaded Excel file object.
   * @returns {Promise<{school: string, students: Array<object>}>} Parsed students.
   */
  static async parseFile(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (!rows || rows.length === 0) return { school: '', students: [] };

    const school = this.extractSchool(rows);
    const { headerIndex, colMap } = this.detectColumns(rows);
    const students = [];

    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      const rawId = row[colMap.idCol];
      const rawName = row[colMap.nameCol];
      if (!rawId || !rawName) continue;

      const identifier = String(rawId).trim();
      const fullName = String(rawName).trim();
      if (!identifier || !fullName || identifier.toLowerCase() === 'stt') continue;

      const dob = colMap.dobCol !== -1 && row[colMap.dobCol] ? String(row[colMap.dobCol]).trim() : '';
      const gender = colMap.genderCol !== -1 && row[colMap.genderCol] ? String(row[colMap.genderCol]).trim() : '';
      const details = [dob && `Ngày sinh: ${dob}`, gender && `Giới tính: ${gender}`].filter(Boolean).join(' | ');

      students.push({ email: identifier, password: '123456', full_name: fullName, address: details || null, school: school || null });
    }
    return { school, students };
  }

  static extractSchool(rows) {
    for (let r = 0; r < Math.min(rows.length, 6); r++) {
      const rowText = (rows[r] || []).join(' ');
      if (/thcs|tiểu học|thpt|trường/i.test(rowText)) return rowText.trim();
    }
    return '';
  }

  static detectColumns(rows) {
    let headerIndex = -1;
    let colMap = { idCol: 1, nameCol: 2, dobCol: 3, genderCol: 4 };

    for (let r = 0; r < Math.min(rows.length, 12); r++) {
      const row = rows[r] || [];
      const hasId = row.some((c) => /định danh|tài khoản|mã hs|email|username/i.test(String(c)));
      const hasName = row.some((c) => /họ và tên|họ tên|tên học sinh/i.test(String(c)));
      if (hasId || hasName) {
        headerIndex = r;
        row.forEach((cell, idx) => {
          const str = String(cell || '').toLowerCase();
          if (/định danh|tài khoản|mã hs|email|username/.test(str)) colMap.idCol = idx;
          if (/họ và tên|họ tên|tên học sinh/.test(str)) colMap.nameCol = idx;
          if (/ngày sinh|năm sinh|dob/.test(str)) colMap.dobCol = idx;
          if (/giới tính|phái/.test(str)) colMap.genderCol = idx;
        });
        break;
      }
    }
    if (headerIndex === -1) headerIndex = 6;
    return { headerIndex, colMap };
  }
}

export default StudentExcelParser;
