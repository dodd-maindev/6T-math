import React, { useState, useEffect, useMemo } from 'react';
import { History, Calendar, ChevronDown, ChevronRight, Layers, FileCheck } from 'lucide-react';
import { GradingSessionGrouper } from '../../services/GradingSessionGrouper';

const formatScore = (val) => {
  const num = parseFloat(val || 0);
  return Number.isInteger(num) ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
};

/**
 * Collapsible grading history list grouped into sessions.
 */
export const GradingHistoryList = ({ history, onSelectSubmission }) => {
  const [expandedSessions, setExpandedSessions] = useState({});

  const sessions = useMemo(() => GradingSessionGrouper.groupIntoSessions(history), [history]);

  useEffect(() => {
    if (sessions.length > 0) {
      setExpandedSessions((prev) => (Object.keys(prev).length === 0 ? { [sessions[0].id]: true } : prev));
    }
  }, [sessions]);

  if (!history || history.length === 0) return null;

  const toggleSession = (sessionId) => {
    setExpandedSessions((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  return (
    <div className="mt-5 pt-4 border-t border-slate-200">
      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
        <History className="w-3.5 h-3.5 text-amber-600" />
        <span>Lịch sử các lần chấm ({sessions.length} lần):</span>
      </h4>
      <div className="space-y-2">
        {sessions.map((session) => {
          const isExpanded = !!expandedSessions[session.id];
          return (
            <div key={session.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              <div
                onClick={() => toggleSession(session.id)}
                className="p-3 bg-slate-50 hover:bg-amber-50/60 cursor-pointer transition-colors flex items-center justify-between text-xs select-none"
              >
                <div className="flex items-center space-x-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800 font-bold">{session.formattedTime}</span>
                  <span className="text-slate-500 font-medium ml-1.5 bg-slate-200/80 px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-slate-600" />
                    <span>{session.questionsCount} bài chấm</span>
                  </span>
                </div>
                <span className="font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300 text-[11px]">
                  Tổng: {formatScore(session.totalScore)} điểm
                </span>
              </div>

              {isExpanded && (
                <div className="divide-y divide-slate-100 border-t border-slate-100 bg-white">
                  {session.submissions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onSelectSubmission(s)}
                      className="px-4 py-2 hover:bg-amber-50/40 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-2 pl-3">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-700 font-bold">
                          {s.feedback?.questions?.[0]?.question_title || 'Câu hỏi'}
                        </span>
                      </div>
                      <span className="text-slate-700 font-black text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {formatScore(s.score)} điểm
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradingHistoryList;
