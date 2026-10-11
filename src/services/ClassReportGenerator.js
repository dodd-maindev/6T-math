import { buildAggregatedSubmission } from '../components/Dashboard/gradingAggregator';
import { StudentReportBuilder } from './StudentReportBuilder';

/**
 * Service to aggregate and generate classroom-wide assessment report documents.
 */
export class ClassReportGenerator {
  /**
   * Fetches submissions and builds full report document for all graded students in classroom.
   * @param {object} apiService - Centralized API service.
   * @param {Array} students - List of classroom students.
   * @param {object} assignment - Active assignment metadata.
   * @param {Array} questions - Assignment questions.
   * @param {object} classroom - Active classroom metadata.
   * @returns {Promise<import('../models/StudentReportModel').ClassroomReportDocument|null>} Constructed document.
   */
  static async generateClassReport(apiService, students, assignment, questions, classroom) {
    const submissionPromises = students.map(async (st) => {
      try {
        const subs = await apiService.get(`/admin/student/${st.id}/submissions`);
        const matching = (subs || []).filter((s) => s.assignment_id === assignment.id);
        return { student: st, matching };
      } catch (_) {
        return { student: st, matching: [] };
      }
    });

    const results = await Promise.all(submissionPromises);
    const graded = results.filter((r) => r.matching.length > 0);

    if (graded.length === 0) return null;

    const rows = graded.map((g, idx) => {
      const aggregated = buildAggregatedSubmission(assignment, g.matching, questions);
      return StudentReportBuilder.buildSingleStudentRow(g.student, aggregated, idx + 1);
    });

    return StudentReportBuilder.buildDocument(classroom, assignment, rows);
  }
}

export default ClassReportGenerator;
