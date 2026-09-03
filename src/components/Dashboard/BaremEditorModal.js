import React, { useState, useEffect, useCallback } from 'react';
import { apiService, API_BASE_URL } from '../../services/apiService';
import { X, Sparkles, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Teacher modal for viewing, editing, adding/removing steps, and re-running AI barem extraction.
 */
export const BaremEditorModal = ({ isOpen, onClose, question, onBaremUpdated }) => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchBarem = useCallback(async () => {
    if (!question?.id) return;
    setLoading(true); setMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/question/${question.id}/barem`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSteps(Array.isArray(data?.steps) ? data.steps : []);
      }
    } catch (_) {} finally { setLoading(false); }
  }, [question?.id]);

  useEffect(() => { if (isOpen) fetchBarem(); }, [isOpen, fetchBarem]);

  const handleRerunAI = async () => {
    setExtracting(true); setMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/question/${question.id}/extract-barem`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSteps(Array.isArray(data?.steps) ? data.steps : []);
        setMsg({ type: 'success', text: 'AI đã quét lại Barem thành công!' });
        if (onBaremUpdated) onBaremUpdated();
      } else { setMsg({ type: 'error', text: 'Quét Barem thất bại' }); }
    } catch (_) { setMsg({ type: 'error', text: 'Lỗi kết nối' }); } finally { setExtracting(false); }
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      const payload = { barem_json: { question_title: `Bài ${question.question_number}`, max_score: parseFloat(question.max_score), steps } };
      const res = await apiService.put(`/admin/question/${question.id}/barem`, payload);
      if (res) {
        setMsg({ type: 'success', text: 'Đã lưu Barem chuẩn thành công!' });
        if (onBaremUpdated) onBaremUpdated();
      }
    } catch (_) { setMsg({ type: 'error', text: 'Lỗi khi lưu Barem' }); } finally { setSaving(false); }
  };

  const updateStep = (idx, field, val) => {
    const next = [...steps];
    next[idx] = { ...next[idx], [field]: field === 'max_score' ? parseFloat(val) || 0 : val };
    setSteps(next);
  };

  const addStep = () => setSteps([...steps, { step_id: steps.length + 1, step_title: `Ý ${String.fromCharCode(97 + steps.length)}: `, max_score: 0.5, criteria: '' }]);
  const removeStep = (idx) => setSteps(steps.filter((_, i) => i !== idx));

  if (!isOpen || !question) return null;
  const totalAlloc = steps.reduce((sum, s) => sum + (parseFloat(s.max_score) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">Barem Chuẩn — Câu {question.question_number}</h3>
            <p className="text-[11px] text-slate-500">Tổng điểm: <b className="text-amber-700">{totalAlloc}/{question.max_score}đ</b></p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        {msg && <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 flex items-center space-x-1.5 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{msg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}<span>{msg.text}</span></div>}

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2"><Loader2 className="w-4 h-4 animate-spin text-amber-600" /><span>Đang tải Barem...</span></div>
          ) : steps.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">Chưa có Barem. Bấm "Quét Barem bằng AI" bên dưới để trích xuất tự động từ lời giải mẫu!</div>
          ) : (
            steps.map((s, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="text" value={s.step_title || ''} onChange={(e) => updateStep(idx, 'step_title', e.target.value)} placeholder="Tên câu/ý (vd: Câu a: ...)" className="flex-1 text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-amber-500" />
                  <div className="flex items-center space-x-1 shrink-0">
                    <input type="number" step="0.125" value={s.max_score || 0} onChange={(e) => updateStep(idx, 'max_score', e.target.value)} className="w-16 text-xs font-black text-amber-900 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:outline-amber-500" />
                    <span className="text-[11px] font-bold text-slate-500">đ</span>
                  </div>
                  <button onClick={() => removeStep(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <input type="text" value={s.criteria || ''} onChange={(e) => updateStep(idx, 'criteria', e.target.value)} placeholder="Tiêu chuẩn chấm (yêu cầu cần đạt)..." className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-amber-500" />
              </div>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 pt-3 mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button onClick={addStep} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"><Plus className="w-3.5 h-3.5" /><span>Thêm bước</span></button>
            <button onClick={handleRerunAI} disabled={extracting} className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold flex items-center space-x-1 disabled:opacity-50">{extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}<span>{steps.length > 0 ? '🔄 Quét lại AI' : '🤖 Quét Barem AI'}</span></button>
          </div>
          <button onClick={handleSave} disabled={saving || steps.length === 0} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center space-x-1 disabled:opacity-50">{saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}<span>Lưu Barem</span></button>
        </div>
      </div>
    </div>
  );
};

export default BaremEditorModal;
