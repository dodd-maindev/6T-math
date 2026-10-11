/**
 * Represents the evaluation summary for an individual question.
 */
export class StudentQuestionReport {
  /**
   * @param {string} questionTitle - The title of the question (e.g., "Bài 1").
   * @param {number} allocatedScore - The score awarded to the student.
   * @param {number} maxScore - The maximum achievable score for the question.
   * @param {string} comment - Detailed evaluation commentary for this question.
   */
  constructor(questionTitle, allocatedScore, maxScore, comment) {
    this.questionTitle = questionTitle;
    this.allocatedScore = allocatedScore;
    this.maxScore = maxScore;
    this.comment = comment;
  }

  /**
   * Formats the score fraction string.
   * @returns {string} The formatted score text, e.g. "(1/1đ)".
   */
  formatScoreText() {
    const formattedAllocated = Number.isInteger(this.allocatedScore)
      ? this.allocatedScore.toString()
      : this.allocatedScore.toFixed(2).replace(/\.?0+$/, '');
    const formattedMax = Number.isInteger(this.maxScore)
      ? this.maxScore.toString()
      : this.maxScore.toFixed(2).replace(/\.?0+$/, '');
    return `(${formattedAllocated}/${formattedMax}đ)`;
  }

  /**
   * Formats the entire line including title, score, and comment.
   * @returns {string} The bulleted summary text.
   */
  formatSummaryLine() {
    return `• ${this.questionTitle} ${this.formatScoreText()}: ${this.comment}`;
  }
}

/**
 * Represents a single row in the assessment report table for a student.
 */
export class StudentRowReport {
  /**
   * @param {number} indexNumber - Row sequence index (1-based).
   * @param {string} studentName - The display name or email of the student.
   * @param {StudentQuestionReport[]} questionReports - Evaluated questions.
   * @param {number} totalScore - Overall total score achieved.
   * @param {number} totalMaxScore - Maximum possible total score.
   * @param {string} generalComment - General performance feedback.
   */
  constructor(indexNumber, studentName, questionReports, totalScore, totalMaxScore, generalComment) {
    this.indexNumber = indexNumber;
    this.studentName = studentName;
    this.questionReports = questionReports;
    this.totalScore = totalScore;
    this.totalMaxScore = totalMaxScore;
    this.generalComment = generalComment;
  }

  /**
   * Formats the total score string, e.g. "8/10".
   * @returns {string} Formatted total score.
   */
  formatTotalScore() {
    const formattedScore = Number.isInteger(this.totalScore)
      ? this.totalScore.toString()
      : this.totalScore.toFixed(2).replace(/\.?0+$/, '');
    const formattedMax = Number.isInteger(this.totalMaxScore)
      ? this.totalMaxScore.toString()
      : this.totalMaxScore.toFixed(2).replace(/\.?0+$/, '');
    return `${formattedScore}/${formattedMax}`;
  }

  /**
   * Combines all question summaries into multiline text.
   * @returns {string} Multiline question breakdown comments.
   */
  formatAllQuestionsText() {
    return this.questionReports.map((report) => report.formatSummaryLine()).join('\n');
  }
}

/**
 * Represents the entire classroom assessment document.
 */
export class ClassroomReportDocument {
  /**
   * @param {string} bannerTitle - Header title of the report.
   * @param {string} assignmentTitle - Title of the assignment.
   * @param {StudentRowReport[]} rows - List of student report rows.
   */
  constructor(bannerTitle, assignmentTitle, rows) {
    this.bannerTitle = bannerTitle;
    this.assignmentTitle = assignmentTitle;
    this.rows = rows;
  }
}
