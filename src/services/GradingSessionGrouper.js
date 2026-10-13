/**
 * Service to cluster individual question submissions into cohesive grading sessions.
 */
export class GradingSessionGrouper {
  /**
   * Proximity threshold in milliseconds (90 seconds).
   */
  static SESSION_GAP_THRESHOLD_MS = 90 * 1000;

  /**
   * Groups a flat array of submissions into sessions by timestamp proximity.
   * @param {Array<object>} submissions - List of student submissions.
   * @returns {Array<object>} Clustered grading sessions.
   */
  static groupIntoSessions(submissions = []) {
    if (!Array.isArray(submissions) || submissions.length === 0) return [];

    const sorted = [...submissions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const sessions = [];
    let currentSession = null;

    for (const sub of sorted) {
      const subTime = new Date(sub.created_at).getTime();

      if (!currentSession) {
        currentSession = this.createSession(sub, subTime);
      } else {
        const lastTime = currentSession.lastItemTime;
        if (Math.abs(lastTime - subTime) <= this.SESSION_GAP_THRESHOLD_MS) {
          currentSession.submissions.push(sub);
          currentSession.totalScore += parseFloat(sub.score || 0);
          currentSession.lastItemTime = subTime;
        } else {
          sessions.push(this.finalizeSession(currentSession));
          currentSession = this.createSession(sub, subTime);
        }
      }
    }

    if (currentSession) {
      sessions.push(this.finalizeSession(currentSession));
    }

    return sessions;
  }

  static createSession(firstSub, time) {
    return {
      id: `session_${firstSub.id}`,
      createdAt: firstSub.created_at,
      lastItemTime: time,
      totalScore: parseFloat(firstSub.score || 0),
      submissions: [firstSub],
    };
  }

  static finalizeSession(session) {
    session.submissions.sort((a, b) => {
      const qA = a.feedback?.questions?.[0]?.question_title || '';
      const qB = b.feedback?.questions?.[0]?.question_title || '';
      return qA.localeCompare(qB, undefined, { numeric: true });
    });
    return {
      id: session.id,
      createdAt: session.createdAt,
      formattedTime: new Date(session.createdAt).toLocaleString('vi-VN'),
      totalScore: session.totalScore,
      questionsCount: session.submissions.length,
      submissions: session.submissions,
    };
  }
}

export default GradingSessionGrouper;
