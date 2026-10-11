import { StudentQuestionReport, StudentRowReport, ClassroomReportDocument } from '../models/StudentReportModel';
import { StudentFeedbackEvaluator } from './StudentFeedbackEvaluator';

/**
 * Service to build structured assessment report documents.
 */
export class StudentReportBuilder {
  /**
   * Generates general qualitative feedback.
   * @param {number} score - Current total score.
   * @param {number} maxScore - Maximum possible score.
   * @param {Array} [questionReports=[]] - Evaluated question summaries.
   * @returns {string} Standard evaluation text.
   */
  static buildGeneralFeedback(score, maxScore, questionReports = []) {
    return StudentFeedbackEvaluator.buildGeneralFeedback(score, maxScore, questionReports);
  }

  /**
   * Builds question commentary.
   * @param {object} question - Evaluated question object.
   * @returns {string} Commentary string.
   */
  static buildQuestionComment(question) {
    return StudentFeedbackEvaluator.buildQuestionComment(question);
  }

  /**
   * Builds single student row report.
   * @param {object} student - Student object.
   * @param {object} aggregatedSubmission - Aggregated submission result.
   * @param {number} [indexNumber=1] - Sequence index.
   * @returns {StudentRowReport} Created report row.
   */
  static buildSingleStudentRow(student, aggregatedSubmission, indexNumber = 1) {
    const studentName = student.full_name || student.name || student.email || 'Học sinh';
    const feedbackQuestions = aggregatedSubmission?.feedback?.questions || [];
    const questionReports = feedbackQuestions.map((q) => {
      const title = q.question_title || 'Câu hỏi';
      const allocated = parseFloat(q.allocated_score || 0);
      const max = parseFloat(q.max_score || 0);
      const comment = StudentFeedbackEvaluator.buildQuestionComment(q);
      return new StudentQuestionReport(title, allocated, max, comment);
    });

    const totalScore = parseFloat(aggregatedSubmission?.score || 0);
    const totalMax = aggregatedSubmission?.totalMaxScore || 10.0;
    const generalComment = StudentFeedbackEvaluator.buildGeneralFeedback(totalScore, totalMax, questionReports);

    return new StudentRowReport(indexNumber, studentName, questionReports, totalScore, totalMax, generalComment);
  }

  /**
   * Creates the whole classroom report document.
   * @param {object} classroom - Classroom metadata.
   * @param {object} assignment - Assignment metadata.
   * @param {StudentRowReport[]} rows - List of student report rows.
   * @returns {ClassroomReportDocument} Constructed report document.
   */
  static buildDocument(classroom, assignment, rows) {
    const rawClassName = classroom?.name ? classroom.name.toUpperCase() : 'TOÁN 9NC';
    const bannerTitle = `BẢNG BÁO CÁO HỌC TẬP - ${rawClassName} - CÔ HỒNG XUÂN`;
    const assignmentTitle = assignment?.title || 'BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC';
    return new ClassroomReportDocument(bannerTitle, assignmentTitle, rows);
  }
}

export default StudentReportBuilder;
