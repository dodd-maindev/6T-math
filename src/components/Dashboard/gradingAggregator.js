/**
 * Extracts question number from title (e.g. "Bài 3" -> 3).
 */
export const extractQuestionNumber = (title = '') => {
  const match = title.trim().match(/^(?:bài|câu)\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};

const formatSteps = (rawQuestions = []) => {
  const steps = [];
  const comments = [];
  for (const q of rawQuestions) {
    if (Array.isArray(q.steps)) steps.push(...q.steps);
    if (q.teacher_comment) comments.push(q.teacher_comment);
  }
  return { steps, comment: comments.join(' | ') };
};

const buildCard = (sub, oq) => {
  const rawQs = sub.feedback?.questions || [];
  const { steps, comment } = formatSteps(rawQs);
  const stepSum = steps.reduce((sum, s) => sum + (parseFloat(s.allocated_score) || 0), 0);
  const allocated = steps.length > 0 ? stepSum : rawQs.reduce((s, q) => s + (parseFloat(q.allocated_score) || 0), 0);
  const maxScore = oq.max_score || rawQs.reduce((s, q) => s + (parseFloat(q.max_score) || 0), 0);
  return {
    question_title: `Bài ${oq.question_number}`, allocated_score: allocated,
    max_score: maxScore, steps, teacher_comment: comment,
    imageUrls: Array.isArray(sub.feedback?.student_image_urls) ? sub.feedback.student_image_urls : [],
  };
};

const getSubmissionTitleNumbers = (sub) => {
  const nums = new Set();
  for (const q of (sub.feedback?.questions || [])) {
    const n = extractQuestionNumber(q.question_title);
    if (n != null) nums.add(n);
  }
  return nums;
};

export const buildAggregatedSubmission = (assignment, history = [], officialQuestions = []) => {
  const sorted = [...history].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const usedIds = new Set();
  const result = new Map();
  const officialNums = new Set(officialQuestions.map(q => q.question_number));
  
  const discoveredNums = new Set(officialNums);
  if (discoveredNums.size === 0) {
    history.forEach(s => {
      getSubmissionTitleNumbers(s).forEach(n => discoveredNums.add(n));
      if (s.feedback?.question_number != null) discoveredNums.add(parseInt(s.feedback.question_number, 10));
    });
  }

  const targets = officialQuestions.length > 0
    ? [...officialQuestions].sort((a, b) => a.question_number - b.question_number)
    : (discoveredNums.size > 0 ? Array.from(discoveredNums).sort((a, b) => a - b).map(n => ({ question_number: n, max_score: 2.5 })) : [{ question_number: 1, max_score: 2.5 }]);

  for (const oq of targets) {
    const qNum = oq.question_number;
    let sub = sorted.find(s => !usedIds.has(s.id) && s.feedback?.question_number != null && parseInt(s.feedback.question_number, 10) === qNum);
    if (!sub) sub = sorted.find(s => !usedIds.has(s.id) && s.feedback?.question_number == null && (s.feedback?.questions || []).some(q => extractQuestionNumber(q.question_title) === qNum));
    if (sub) { usedIds.add(sub.id); result.set(qNum, buildCard(sub, oq)); }
  }

  for (const oq of targets) {
    if (result.has(oq.question_number)) continue;
    const sub = sorted.find(s => {
      if (usedIds.has(s.id) || s.feedback?.question_number != null) return false;
      const titleNums = getSubmissionTitleNumbers(s);
      return ![...titleNums].some(n => officialNums.has(n));
    });
    if (sub) { usedIds.add(sub.id); result.set(oq.question_number, buildCard(sub, oq)); }
  }

  const finalQuestions = targets.filter(oq => result.has(oq.question_number)).map(oq => result.get(oq.question_number));
  const allImages = finalQuestions.flatMap(q => q.imageUrls || []);
  const totalScore = finalQuestions.reduce((s, q) => s + (parseFloat(q.allocated_score) || 0), 0);

  return {
    id: 'aggregated', assignment_id: assignment.id,
    assignment_title: `${assignment.title} - TỔNG HỢP KẾT QUẢ`,
    score: totalScore.toFixed(2), isAggregated: true, totalMaxScore: 10.0,
    feedback: {
      general_feedback: `Tổng hợp ${finalQuestions.length} câu hỏi đã chấm.`,
      questions: finalQuestions,
      student_image_urls: Array.from(new Set(allImages)),
    },
  };
};

export default buildAggregatedSubmission;
