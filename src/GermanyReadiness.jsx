import React, { useState, useEffect } from 'react';
import { Flag, Award, CheckCircle, TrendingUp, RefreshCw, Layers } from 'lucide-react';
import { supabase } from './supabaseClient';

const INITIAL_METRICS = [
  { metric_key: 'german_level', metric_label: 'مستوى اللغة الألماني (B2 Target)', current_score: 45, weight: 35, status_tag: '🟡 A2/B1 In Progress' },
  { metric_key: 'gpa', metric_label: 'المعدل الأكاديمي (GPA / الجامعة)', current_score: 85, weight: 20, status_tag: '🟢 Excellent' },
  { metric_key: 'python_skill', metric_label: 'كفاءة Python البرمجية', current_score: 60, weight: 15, status_tag: '🟡 Intermediate' },
  { metric_key: 'ai_skill', metric_label: 'مشاريع ومهارات الـ AI Engine', current_score: 50, weight: 15, status_tag: '🟡 Building Portfolio' },
  { metric_key: 'certs', metric_label: 'الشهادات والاعتمادات الدولية', current_score: 70, weight: 5, status_tag: '🟢 Good' },
  { metric_key: 'finance', metric_label: 'الجاهزية المالية (Blocked Account)', current_score: 40, weight: 10, status_tag: '🟡 Saving Phase' },
];

export default function GermanyReadiness() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('germany_readiness').select('*');
      if (data && data.length > 0) {
        setMetrics(data);
      } else {
        // Seed initial values if empty
        await supabase.from('germany_readiness').insert(INITIAL_METRICS);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = async (key, newScore) => {
    const updated = metrics.map(m => m.metric_key === key ? { ...m, current_score: Number(newScore) } : m);
    setMetrics(updated);

    const targetMetric = updated.find(m => m.metric_key === key);
    await supabase.from('germany_readiness').upsert(targetMetric, { onConflict: 'metric_key' });
  };

  // حساب مؤشر الجاهزية الكلي الحقيقي
  const calculateTotalReadiness = () => {
    const totalWeightedScore = metrics.reduce((acc, m) => {
      return acc + (Number(m.current_score) * (Number(m.weight) / 100));
    }, 0);
    return Math.round(totalWeightedScore);
  };

  const overallScore = calculateTotalReadiness();

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* هيدر بعثة ألمانيا */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/60 border border-amber-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-bold mb-3">
              <Flag size={14} className="text-yellow-400" />
              <span>Germany Mission 2026 🇩🇪</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100">
              مؤشر الجاهزية لاستكمال الدراسة في ألمانيا
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              حاسبة رقمية حقيقية تقيس نسبة جاهزيتك بناءً على أوزان حقيقية للمحاور الأساسية.
            </p>
          </div>

          {/* الكارت الرقمي للـ Score */}
          <div className="bg-slate-900/90 border border-amber-500/40 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block">Germany Readiness Score</span>
              <span className="text-3xl font-black text-amber-400">{overallScore} / 100</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* المحاور والأشرطة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((item) => (
          <div key={item.metric_key} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">{item.metric_label}</span>
              <span className="text-slate-400 font-mono">الوزن: {item.weight}%</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={item.current_score}
                onChange={(e) => handleScoreChange(item.metric_key, e.target.value)}
                className="w-full accent-amber-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-bold font-mono text-amber-400 w-12 text-left">
                {item.current_score}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>الحالة: <strong className="text-slate-200">{item.status_tag}</strong></span>
              <span>المساهمة في السكور: <strong className="text-amber-300">{((item.current_score * item.weight) / 100).toFixed(1)} pt</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}