/**
 * Evaluator service responsible for generating pedagogical qualitative feedback.
 */
export class StudentFeedbackEvaluator {
  /**
   * Generates general qualitative feedback based on score, ratio, and specific question mistakes.
   * @param {number} score - Current total score.
   * @param {number} maxScore - Maximum possible score.
   * @param {Array} [questionReports=[]] - Evaluated question summaries.
   * @returns {string} Tailored pedagogical evaluation text.
   */
  static buildGeneralFeedback(score, maxScore, questionReports = []) {
    const ratio = maxScore > 0 ? score / maxScore : 0;
    const rating = ratio >= 0.9 ? 'XUẤT SẮC' : ratio >= 0.8 ? 'GIỎI' : ratio >= 0.65 ? 'KHÁ' : ratio >= 0.5 ? 'TRUNG BÌNH' : 'CẦN CỐ GẮNG';

    const allComments = questionReports.map((q) => q.comment || '').join(' ').toLowerCase();
    const hasCarelessMistake = [
      'cộng nhầm', 'cộng sai', 'tính nhầm', 'tính sai', 'thay sai', 'thay nhầm',
      'viết sai đề', 'chép sai đề', 'sai đề', 'sai số', 'nhầm số', 'nhầm dấu',
      'thiếu nghiệm', 'sót nghiệm', 'chưa cẩn thận', 'quên'
    ].some((kw) => allComments.includes(kw));

    if (ratio < 0.5 || (score < 5.0 && maxScore === 10.0)) {
      return `Xếp loại ${rating}.\nCon làm được ít bài đúng, các hướng giải còn sai sót.\nCon còn chưa chăm học. Cha mẹ nhắc nhở con cần làm nhiều bài tập hơn để làm được nhiều dạng bài hơn.`;
    }

    if (hasCarelessMistake) {
      return `Xếp loại ${rating}.\nCon có nắm được cách làm nhưng còn mắc lỗi tính toán và trình bày.\nCon chưa cẩn thận. Cha mẹ nhắc nhở con cẩn thận hơn để tránh mất điểm đáng tiếc.`;
    }

    if (ratio >= 0.9) {
      return `Xếp loại XUẤT SẮC.\nCon thành thạo xuất sắc các yêu cầu cần đạt, suy luận logic và tính toán chính xác.\nTiếp tục phát huy phong độ này nhé!`;
    }
    if (ratio >= 0.8) {
      return `Xếp loại GIỎI.\nCon thành thạo yêu cầu cần đạt.\nCon cần làm cẩn thận hơn nữa để đạt điểm tối đa.`;
    }
    if (ratio >= 0.65) {
      return `Xếp loại KHÁ.\nCon đã nắm được các dạng toán cơ bản.\nCần rèn luyện thêm kỹ năng làm các bài toán nâng cao.`;
    }

    return `Xếp loại TRUNG BÌNH.\nCon cần ôn lại các kiến thức trọng tâm và rèn luyện thêm kỹ năng làm bài.`;
  }

  /**
   * Builds synthesis commentary for an individual question.
   * @param {object} question - Evaluated question object.
   * @returns {string} Commentary string.
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
}

export default StudentFeedbackEvaluator;
