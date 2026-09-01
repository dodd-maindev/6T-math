import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import MathText from '../Common/MathText';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
};

const parseStep = (step) => {
  const raw = (step.step_desc || '').replace(/^(?:câu\s+[a-zA-Z0-9]+)\s*[-–]\s*/i, '').trim();
  let m = raw.match(/^(?:(?:Ý|Câu|Phần)\s*(\d+)([a-zA-Z])|(\d+)([a-zA-Z])\))\s*[:.)]?\s*(.*)$/i);
  if (m) {
    const cleanBody = (m[5] || '').replace(/^[):.]+\s*/, '').trim();
    return { groupTitle: `Câu ${m[1] || m[3]}:`, bullet: `${(m[2] || m[4]).toLowerCase()})`, body: cleanBody, ...step };
  }
  m = raw.match(/^(?:(?:Ý|Câu|Phần)\s*(\d+)|\((\d+)\)|(\d+)\))\s*[:.)]?\s*(.*)$/i);
  if (m) {
    const cleanBody = (m[4] || '').replace(/^[):.]+\s*/, '').trim();
    return { groupTitle: `Câu ${m[1] || m[2] || m[3]}:`, bullet: null, body: cleanBody, ...step };
  }
  m = raw.match(/^(?:(?:Ý|Câu|Phần)\s*([a-zA-Z])|\(([a-zA-Z])\)|([a-zA-Z])\))\s*[:.)]?\s*(.*)$/i);
  if (m) {
    const cleanBody = (m[4] || '').replace(/^[):.]+\s*/, '').trim();
    return { groupTitle: null, bullet: `${(m[1] || m[2] || m[3]).toLowerCase()})`, body: cleanBody, ...step };
  }
  return { groupTitle: null, bullet: null, body: raw, ...step };
};

const groupSteps = (steps = []) => {
  const parsed = steps.map(parseStep);
  if (!parsed.some(p => p.groupTitle != null)) return [{ title: null, items: parsed }];

  const groups = [];
  let cur = null;
  for (const item of parsed) {
    const gTitle = item.groupTitle || '';
    if (!cur || cur.title !== gTitle) {
      cur = { title: gTitle, items: [], allocated: 0, max: 0 };
      groups.push(cur);
    }
    cur.items.push(item);
    cur.allocated += parseFloat(item.allocated_score) || 0;
    cur.max += parseFloat(item.max_score) || 0;
  }
  return groups;
};

export const QuestionCard = ({ question }) => {
  const groups = groupSteps(Array.isArray(question.steps) ? question.steps : []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 border-l-4 border-l-[#024c3d] shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <h4 className="text-base font-black text-slate-900">{question.question_title}</h4>
          <span className="text-xs font-bold text-amber-800 bg-[#fff8ea] border border-amber-300 px-3 py-1 rounded-lg shadow-2xs">
            {formatScore(question.allocated_score)}/{formatScore(question.max_score)}đ
          </span>
        </div>

        <div className="space-y-3.5">
          {groups.map((g, gIdx) => (
            <div key={gIdx} className="space-y-2">
              {g.title && (
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 border-b border-slate-100 pb-1">
                  <span className="font-extrabold text-slate-900">{g.title}</span>
                  <span className="text-amber-800 font-bold text-[11px]">{formatScore(g.allocated)}/{formatScore(g.max)}đ</span>
                </div>
              )}
              <div className={`space-y-2 ${g.title ? 'pl-3 sm:pl-4 border-l-2 border-slate-100' : ''}`}>
                {g.items.map((s, iIdx) => (
                  <div key={iIdx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                    {s.status === 'Correct' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} /> :
                     s.status === 'Missing' ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2} /> :
                     <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" strokeWidth={2} />}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="text-slate-800 font-normal">
                        {s.bullet && <span className="font-bold text-slate-950 mr-1.5">{s.bullet}</span>}
                        <MathText content={s.body} />
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-3">{formatScore(s.allocated_score)}/{formatScore(s.max_score)}đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {question.teacher_comment && (
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
          * <MathText content={question.teacher_comment} />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
