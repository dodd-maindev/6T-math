import React from 'react';
import ScorecardHeader from './ScorecardHeader';
import QuestionCard from './QuestionCard';
import StudentWorkGallery from './StudentWorkGallery';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

const groupQuestions = (rawQuestions = []) => {
  const map = new Map();
  let defaultCounter = 1;
  for (const q of rawQuestions) {
    const rawTitle = (q.question_title || '').trim();
    const withNum = rawTitle.match(/^(bài\s*\d+|câu\s*\d+)/i);
    let base = withNum ? withNum[1].trim() : (rawTitle || `Bài ${defaultCounter}`);
    base = base.charAt(0).toUpperCase() + base.slice(1);
    if (!map.has(base)) map.set(base, { question_title: base, allocated_score: 0, max_score: 0, steps: [], comments: [] });
    const group = map.get(base);
    group.allocated_score += (parseFloat(q.allocated_score) || 0);
    group.max_score += (parseFloat(q.max_score) || 0);
    if (Array.isArray(q.steps)) group.steps.push(...q.steps);
    if (q.teacher_comment) group.comments.push(q.teacher_comment);
    defaultCounter += 1;
  }
  return Array.from(map.values()).map(g => ({ ...g, teacher_comment: g.comments.join(' | ') }));
};

/**
 * Main Scorecard view displaying assessment overview and question breakdown.
 */
export const Scorecard = ({ submission, studentName, onClose }) => {
  const feedback = submission.feedback || {};
  const isAggregated = !!submission.isAggregated;
  const questions = isAggregated ? (feedback.questions || []) : groupQuestions(feedback.questions || []);
  const rawScore = parseFloat(submission.score || 0);
  const scoreNum = isAggregated ? (Math.round(rawScore * 4) / 4) : rawScore;
  const questionTotalMax = questions.reduce((sum, q) => sum + (q.max_score || 0), 0);
  const totalMax = isAggregated ? 10.0 : (questionTotalMax || 2.5);
  const ratio = totalMax > 0 ? scoreNum / totalMax : 0;
  const rating = ratio >= 0.9 ? 'XUẤT SẮC' : ratio >= 0.8 ? 'GIỎI' : ratio >= 0.65 ? 'KHÁ' : 'TRUNG BÌNH';
  const studentImages = Array.isArray(feedback.student_image_urls) ? feedback.student_image_urls : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto space-y-4 p-1">
      <ScorecardHeader
        title={submission.assignment_title}
        studentName={studentName}
        score={formatScore(submission.score)}
        maxScore={formatScore(totalMax)}
        rating={rating}
        onClose={onClose}
      />

      <div className="p-4 bg-white border border-slate-200 border-l-4 border-l-[#033b2e] rounded-2xl text-xs text-slate-700 shadow-sm flex items-center">
        <p>
          <span className="font-bold text-slate-900">{studentName}</span> đạt{' '}
          <b className="text-[#033b2e] font-black text-sm">{formatScore(submission.score)}/{formatScore(totalMax)}đ</b> — xếp loại{' '}
          <b className="text-emerald-700 font-black">{rating}</b>.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">BẢNG ĐIỂM CHI TIẾT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {questions.map((q, idx) => (<QuestionCard key={idx} question={q} />))}
        </div>
      </div>

      {!isAggregated && studentImages.length > 0 && (
        <div className="pt-2">
          <StudentWorkGallery imageUrls={studentImages} />
        </div>
      )}
    </div>
  );
};

export default Scorecard;
