import { StudentQuestionReport, StudentRowReport, ClassroomReportDocument } from '../models/StudentReportModel';

/**
 * Service to build structured assessment report documents.
 */
export class StudentReportBuilder {
  /**
   * Generates general qualitative feedback from score and max score.
   * @param {number} score - Current score.
   * @param {number} maxScore - Maximum possible score.
   * @returns {string} Standard evaluation text.
   */
  static buildGeneralFeedback(score, maxScore) {
    const ratio = maxScore > 0 ? score / maxScore : 0;
    if (ratio >= 0.9) {
      return 'Xếp loại XUẤT SẮC.\nCon thành thạo xuất sắc các yêu cầu cần đạt.\nTiếp tục phát huy phong độ này nhé!';
    }
    if (ratio >= 0.8) {
      return 'Xếp loại GIỎI.\nCon thành thạo yêu cầu cần đạt.\nCon cần làm cẩn thận hơn nữa để đạt điểm cao';
    }
    if (ratio >= 0.65) {
      return 'Xếp loại KHÁ.\nCon đã nắm được các yêu cầu cơ bản.\nCần cẩn thận hơn ở các bước tính toán và suy luận.';
    }
    if (ratio >= 0.5) {
      return 'Xếp loại TRUNG BÌNH.\nCon cần ôn lại các kiến thức trọng tâm và rèn luyện thêm kỹ năng làm bài.';
    }
    return 'Xếp loại CẦN CỐ GẮNG.\nCon cần tích cực rèn luyện thêm nhiều dạng bài tập.';
  }

  /**
   * Builds synthesis commentary for a single question based on steps or comment.
   * @param {object} question - Evaluated question object.
   * @returns {string} Synthesized commentary string.
   */
  static buildQuestionComment(question) {
    if (question.teacher_comment && question.teacher_comment.trim().length > 0) {
      return question.teacher_comment.trim();
    }
    const steps = Array.isArray(question.steps) ? question.steps : [];
    if (steps.length === 0) {
      return (question.allocated_score >= question.max_score && question.max_score > 0)
        ? 'Học sinh thực hiện đúng các yêu cầu của bài toán.'
        : 'Học sinh hoàn thành một phần yêu cầu của bài toán.';
    }
    const incorrectSteps = steps.filter((step) => step.status === 'Incorrect' || step.status === 'Missing');
    if (incorrectSteps.length === 0) {
      return 'Học sinh thực hiện đúng các yêu cầu của bài toán.';
    }
    if (incorrectSteps.length === steps.length) {
      return 'Học sinh chưa hoàn thành đúng các bước của bài này.';
    }
    const errorNotes = incorrectSteps
      .map((step) => (step.step_desc || '').replace(/^[•\s\d.-]+/, '').trim())
      .filter((text) => text.length > 0)
      .slice(0, 2)
      .join('; ');
    return `Học sinh làm đúng một số phần nhưng còn sai hoặc thiếu ở: ${errorNotes || 'các bước biến đổi cuối'}.`;
  }

  /**
   * Builds single student row report.
   * @param {object} student - Student object.
   * @param {object} aggregatedSubmission - Aggregated submission result.
   * @param {number} [indexNumber=1] - Sequence index.
   * @returns {StudentRowReport} Created report row.
   */
   

    const totalScore = parseFloat(aggregatedSubmission?.score || 0);
    const totalMax = aggregatedSubmission?.totalMaxScore || 10.0;
    const generalComment = StudentReportBuilder.buildGeneralFeedback(totalScore, totalMax);

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
