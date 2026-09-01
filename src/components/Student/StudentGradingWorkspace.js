import React, { useState } from 'react';
import { Layers, FileEdit, CheckCircle2 } from 'lucide-react';
import FullExamGradingForm from '../Dashboard/FullExamGradingForm';
import SingleQuestionGradingForm from '../Dashboard/SingleQuestionGradingForm';

/**
 * Mobile-first grading and submission workspace for students.
 */
export const StudentGradingWorkspace = ({ assignment, user, questions = [], onGradingComplete, onError }) => {
  const [activeTab, setActiveTab] = useState('full');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Khu Vực Nộp Bài & Chấm Điểm AI</span>
        </h3>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('full')}
          className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'full' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Nộp Toàn Bộ Đề</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('single')}
          className={`py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'single' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>Nộp Từng Câu</span>
        </button>
      </div>

      {/* Forms */}
      {activeTab === 'full' ? (
        <FullExamGradingForm
          assignment={assignment}
          student={user}
          questions={questions}
          onGradingComplete={onGradingComplete}
          onError={onError}
        />
      ) : (
        <SingleQuestionGradingForm
          assignment={assignment}
          student={user}
          questions={questions}
          onGradingComplete={onGradingComplete}
          onError={onError}
        />
      )}
    </div>
  );
};

export default StudentGradingWorkspace;
