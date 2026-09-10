import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, AlertTriangle, Activity, CheckCircle2, Target, Calendar, ArrowRight, Layers } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function CabinetDashboard() {
  const [brief, setBrief] = useState({
    brief_date: new Date().toISOString().split('T')[0],
    overall_status: 'مستقرة 🟢',
    strongest_sector: 'التعليم والبرمجة',
    weakest_sector: 'النوم والطاقة',
    current_risk: 'تراكم ساعات الألمانية',
    main_decision: 'التركيز على مراجعة B1 وترسيخ Decorators في Python',
    priority_1: 'German — 90 min',
    priority_2: 'Python — 60 min',
    priority_3: 'University — 45 min'
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCabinetBrief();
  }, []);

  const fetchCabinetBrief = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('cabinet_briefs')
        .select('*')
        .eq('brief_date', today)
        .single();

      if (data) {
        setBrief(data);
      }
    } catch (err) {
      console.log("No brief for today yet, using default/draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrief = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('cabinet_briefs')
        .upsert([brief], { onConflict: 'brief_date' })
        .select();

      if (error) alert("خطأ في الحفظ: " + error.message);
      else {
        setIsEditing(false);
        if (data && data[0]) setBrief(data[0]);
      }
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    }
  };

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* هيدر مجلس الوزراء */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3">
              <Shield size={14} className="text-cyan-400" />
              <span>مجلس الوزراء • Executive Cabinet</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              موجز حالة الدولة الإستراتيجية (State Brief)
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1.5 font-medium">
              نظرة رئاسية موحدة للقطاعات الحيوية والأولويات اليومية الـ 3 دون تشتت.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-slate-900/90 border border-emerald-500/30 px-3 py-2 rounded-2xl text-cyan-300 flex items-center gap-1.5">
              <Calendar size={14} /> {brief.brief_date}
            </span>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-4 py-2 rounded-2xl transition"
            >
              {isEditing ? "إلغاء التعديل" : "تعديل الموجز"}
            </button>
          </div>
        </div>
      </div>

      {/* التقرير التنفيذي */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* كارت الحالة والقطاعات */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/20 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" /> حالة النظام العام
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {brief.overall_status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">أقوى قطاع:</span>
                <p className="font-bold text-emerald-300 mt-0.5">{brief.strongest_sector}</p>
              </div>

              <div>
                <span className="text-slate-400">أضعف قطاع:</span>
                <p className="font-bold text-amber-400 mt-0.5">{brief.weakest_sector}</p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={14} /> الخطر الحالي:
                </span>
                <p className="text-slate-300 text-xs mt-1 font-medium">{brief.current_risk}</p>
              </div>
            </div>
          </div>

          {/* القرار الرئيسي اليومي */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/20 shadow-xl space-y-4 backdrop-blur-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-2 border-b border-cyan-500/10 pb-3">
                <Sparkles size={16} className="text-cyan-400" /> أهم قرار اليوم (Main Decision)
              </span>
              <p className="text-slate-200 text-sm font-semibold mt-4 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-cyan-500/20">
                "{brief.main_decision}"
              </p>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-400" /> موجه لرفع كفاءة الجاهزية الاستراتيجية.
            </div>
          </div>

          {/* قائمة الـ 3 أولويات القصوى */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/20 shadow-xl space-y-4 backdrop-blur-md">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
              <Target size={16} className="text-emerald-400" /> الأولويات الثلاث المقررة اليوم
            </span>

            <div className="space-y-2.5">
              {[
                { label: 'الأولوية الأولى', text: brief.priority_1, color: 'from-emerald-500 to-teal-500' },
                { label: 'الأولوية الثانية', text: brief.priority_2, color: 'from-cyan-500 to-blue-500' },
                { label: 'الأولوية الثالثة', text: brief.priority_3, color: 'from-purple-500 to-pink-500' }
              ].map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{p.text}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${p.color} text-slate-950`}>
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* نموذج تعديل موجز اليوم */
        <form onSubmit={handleSaveBrief} className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
          <h3 className="text-sm font-bold text-emerald-300">تحديث موجز مجلس الوزراء اليومي</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="حالة النظام (مثال: مستقرة 🟢)"
              value={brief.overall_status}
              onChange={(e) => setBrief({...brief, overall_status: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
            <input 
              type="text" 
              placeholder="أقوى قطاع..."
              value={brief.strongest_sector}
              onChange={(e) => setBrief({...brief, strongest_sector: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
            <input 
              type="text" 
              placeholder="أضعف قطاع..."
              value={brief.weakest_sector}
              onChange={(e) => setBrief({...brief, weakest_sector: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="الخطر الحالي..."
              value={brief.current_risk}
              onChange={(e) => setBrief({...brief, current_risk: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
            <input 
              type="text" 
              placeholder="أهم قرار اليوم..."
              value={brief.main_decision}
              onChange={(e) => setBrief({...brief, main_decision: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="الأولوية 1 (مثال: German — 90 min)"
              value={brief.priority_1}
              onChange={(e) => setBrief({...brief, priority_1: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
            <input 
              type="text" 
              placeholder="الأولوية 2..."
              value={brief.priority_2}
              onChange={(e) => setBrief({...brief, priority_2: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
            <input 
              type="text" 
              placeholder="الأولوية 3..."
              value={brief.priority_3}
              onChange={(e) => setBrief({...brief, priority_3: e.target.value})}
              className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-100"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold py-3 rounded-2xl text-xs hover:opacity-90 transition"
          >
            حفظ واستيعاب التقرير
          </button>
        </form>
      )}

    </div>
  );
}