import React, { useState, useEffect } from 'react';
import { Beaker, GitCommit, CheckCircle, AlertCircle, Plus, Sparkles, Scale, RefreshCw, XCircle } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function IdeaLab() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('experiment'); // experiment | decision
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'experiment',
    stage: 'proposal',
    hypothesis_or_options: '',
    gains: '',
    risks: '',
    metric: '',
    success_condition: '',
    final_result: 'pending',
    review_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('decisions_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('decisions_experiments')
        .insert([{ ...formData, type: activeTab }])
        .select();

      if (error) alert("خطأ في الإضافة: " + error.message);
      else {
        setShowModal(false);
        setFormData({
          title: '',
          type: activeTab,
          stage: 'proposal',
          hypothesis_or_options: '',
          gains: '',
          risks: '',
          metric: '',
          success_condition: '',
          final_result: 'pending',
          review_date: new Date().toISOString().split('T')[0]
        });
        fetchItems();
      }
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    }
  };

  const handleUpdateStatus = async (id, newResult) => {
    const updated = items.map(i => i.id === id ? { ...i, final_result: newResult } : i);
    setItems(updated);
    await supabase.from('decisions_experiments').update({ final_result: newResult }).eq('id', id);
  };

  const filteredItems = items.filter(i => i.type === activeTab);

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* هيدر المختبر والقرارات */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-purple-950/60 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 px-3.5 py-1 rounded-full text-purple-300 text-xs font-bold mb-3">
              <Beaker size={14} className="text-purple-400" />
              <span>Decision Intelligence & Experiment Lab</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100">
              مختبر التجارب ومحرك القرارات الاستراتيجية
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              تحويل الأفكار إلى تجارب محددة بمقاييس، والقرارات إلى دورة حياة قابلة للمراجعة والتنفيذ.
            </p>
          </div>

          <button
            onClick={() => { setFormData({...formData, type: activeTab}); setShowModal(true); }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-slate-950 text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 self-start md:self-auto shadow-lg"
          >
            <Plus size={16} />
            <span>إضافة {activeTab === 'experiment' ? 'تجربة جديدة' : 'قرار استراتيجي'}</span>
          </button>
        </div>

        {/* أزرار التبديل */}
        <div className="flex items-center gap-3 mt-6 border-t border-purple-500/20 pt-4">
          <button
            onClick={() => setActiveTab('experiment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'experiment'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Beaker size={14} /> مختبر التجارب (Experiment Lab)
          </button>

          <button
            onClick={() => setActiveTab('decision')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'decision'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale size={14} /> نظام القرارات (Decision Lifecycle)
          </button>
        </div>
      </div>

      {/* قائمة الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-500 text-xs">
            لا يوجد عنصر حالياً في هذا القسم. اضغط على زر الإضافة للبدء!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  {item.type === 'experiment' ? <Beaker size={16} className="text-purple-400" /> : <Scale size={16} className="text-indigo-400" />}
                  {item.title}
                </span>
                
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  item.final_result === 'keep' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  item.final_result === 'modify' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  item.final_result === 'kill' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {item.final_result === 'keep' ? 'Keep / إبقاء 🟢' :
                   item.final_result === 'modify' ? 'Modify / تعديل 🟡' :
                   item.final_result === 'kill' ? 'Kill / إنهاء 🔴' : 'معلق / قيد التجربة ⏳'}
                </span>
              </div>

              {item.type === 'experiment' ? (
                <div className="space-y-2 text-xs text-slate-300">
                  <div><strong className="text-purple-400">الفرضية (Hypothesis):</strong> {item.hypothesis_or_options}</div>
                  <div><strong className="text-slate-400">المعيار (Metric):</strong> {item.metric}</div>
                  <div><strong className="text-emerald-400">شرط النجاح:</strong> {item.success_condition}</div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-slate-300">
                  <div><strong className="text-indigo-400">الخيارات المتاحة:</strong> {item.hypothesis_or_options}</div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <strong>المكاسب:</strong> {item.gains}
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <strong>المخاطر:</strong> {item.risks}
                    </div>
                  </div>
                </div>
              )}

              {/* أزرار تحديد النتيجة النهائي للتجربة أو القرار */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px]">
                <span className="text-slate-500 font-mono">تاريخ المراجعة: {item.review_date || 'غير محدد'}</span>
                
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleUpdateStatus(item.id, 'keep')} className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">Keep</button>
                  <button onClick={() => handleUpdateStatus(item.id, 'modify')} className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold">Modify</button>
                  <button onClick={() => handleUpdateStatus(item.id, 'kill')} className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold">Kill</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal إضافة تجربة أو قرار */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-purple-300 border-b border-slate-800 pb-3">
              إضافة {activeTab === 'experiment' ? 'تجربة جديدة في المختبر' : 'قرار استراتيجي جديد'}
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">عنوان {activeTab === 'experiment' ? 'التجربة' : 'القرار'}</label>
              <input
                type="text"
                required
                placeholder="مثال: تقديم 5 Proposals يومياً للفريلانس"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
              />
            </div>

            {activeTab === 'experiment' ? (
              <>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">الفرضية (Hypothesis)</label>
                  <input
                    type="text"
                    placeholder="هل يمكن الحصول على أول عميل خلال 30 يوم؟"
                    value={formData.hypothesis_or_options}
                    onChange={(e) => setFormData({...formData, hypothesis_or_options: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">المعيار (Metric)</label>
                    <input
                      type="text"
                      placeholder="Replies / Proposals"
                      value={formData.metric}
                      onChange={(e) => setFormData({...formData, metric: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">شرط النجاح</label>
                    <input
                      type="text"
                      placeholder="≥ 3 ردود في الأسبوع"
                      value={formData.success_condition}
                      onChange={(e) => setFormData({...formData, success_condition: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">الخيارات والبدائل</label>
                  <input
                    type="text"
                    placeholder="خيار أ: التركيز على Python / خيار ب: التركيز على ML"
                    value={formData.hypothesis_or_options}
                    onChange={(e) => setFormData({...formData, hypothesis_or_options: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">المكاسب المتوقعة</label>
                    <input
                      type="text"
                      placeholder="بناء خلفية صلبة"
                      value={formData.gains}
                      onChange={(e) => setFormData({...formData, gains: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">المخاطر / تكلفة الوقت</label>
                    <input
                      type="text"
                      placeholder="تأخير خطوة الـ ML لمدة شهر"
                      value={formData.risks}
                      onChange={(e) => setFormData({...formData, risks: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-slate-400 mb-1 block">تاريخ المراجعة المقترح</label>
              <input
                type="date"
                value={formData.review_date}
                onChange={(e) => setFormData({...formData, review_date: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-bold"
              >
                حفظ
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}