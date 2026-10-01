import React, { useState, useEffect } from 'react';
import { HeartPulse, Scale, Utensils, Droplets, TrendingUp, Plus, CheckCircle2, Circle, Calendar, Apple } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function HealthTracker() {
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(new Date().toISOString().split('T')[0]);

  // حالة الوجبات لليوم الحالي
  const [todayLog, setTodayLog] = useState({
    breakfast: false,
    breakfast_notes: '',
    lunch: false,
    lunch_notes: '',
    snack_protein: false,
    dinner: false,
    dinner_notes: '',
    extra_snack: false,
    water_liters: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // جلب سجلات الوزن مرتبة بالتاريخ
      const { data: weights } = await supabase
        .from('weight_logs')
        .select('*')
        .order('log_date', { ascending: true });
      if (weights) setWeightLogs(weights);

      // جلب تسجيل اليوم في الأكل والماء
      const today = new Date().toISOString().split('T')[0];
      const { data: food } = await supabase
        .from('daily_food_logs')
        .select('*')
        .eq('log_date', today)
        .single();
      
      if (food) setTodayLog(food);
    } catch (e) {
      console.error(e);
    }
  };

  // إضافة وزن جديد
  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;

    const payload = {
      weight_kg: parseFloat(newWeight),
      log_date: newWeightDate
    };

    const { error } = await supabase.from('weight_logs').upsert(payload, { onConflict: 'log_date' });
    if (!error) {
      setNewWeight('');
      fetchData();
    }
  };

  // تحديث سجل الأكل والماء اليومي
  const handleToggleMeal = async (field, value) => {
    const updated = { ...todayLog, [field]: value, log_date: new Date().toISOString().split('T')[0] };
    setTodayLog(updated);
    await supabase.from('daily_food_logs').upsert(updated, { onConflict: 'log_date' });
  };

  // حساب معدل التطور والتغير في الوزن
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight_kg : 46;
  const firstWeight = weightLogs.length > 0 ? weightLogs[0].weight_kg : 46;
  const totalWeightGain = (latestWeight - firstWeight).toFixed(1);

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* الهيدر الرئيسي لوزارة الصحة */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/60 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3">
              <HeartPulse size={14} className="text-emerald-400" />
              <span>Health & Weight Gain System • الضخامة والتغذية</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100">
              متابعة الوزن والنظام الغذائي اليومي
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              الهدف: زيادة الوزن من 46 كجم (الطول 178 سم) للوصول للوزن المثالي عبر التغذية المنتظمة.
            </p>
          </div>

          {/* كارت عرض الوزن الحقيقي والإجمالي */}
          <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block">الوزن الحالي / الزيادة الكلية</span>
              <span className="text-3xl font-black text-emerald-400">{latestWeight} <span className="text-sm">كجم</span></span>
              <span className="text-xs text-emerald-300 font-bold block mt-0.5">
                {totalWeightGain >= 0 ? `+${totalWeightGain}` : totalWeightGain} كجم إجمالي التغير
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. قسم إدخال وتتبع سوابق الوزن (سجل التطور الأسبوعي) */}
        <div className="md:col-span-1 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale size={16} /> تسجيل قراءة الوزن
          </h3>

          <form onSubmit={handleAddWeight} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">الوزن بالكيلوجرام</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="مثال: 46.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">تاريخ القياس</label>
              <input
                type="date"
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1"
            >
              <Plus size={16} /> حفظ الوزن
            </button>
          </form>

          {/* جدول سجل الأوزان */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 pt-2">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">سجل الأوزان السابقة:</span>
            {weightLogs.slice().reverse().map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 font-mono">{log.log_date}</span>
                <span className="font-bold text-emerald-400">{log.weight_kg} كجم</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. قسم متابعة النظام الغذائي اليومي والوجبات */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Utensils size={16} /> متابعة الوجبات والنظام الغذائي اليومي
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <div className="space-y-3">
            
            {/* الفطور */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleToggleMeal('breakfast', !todayLog.breakfast)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {todayLog.breakfast ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">🍳 الفطور الأساسي</span>
                </div>
                <span className="text-[10px] text-slate-400">3 بيضات + 2-3 عيش + جبنة + كوب لبن + فاكهة</span>
              </div>
            </div>

            {/* الغداء */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleToggleMeal('lunch', !todayLog.lunch)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {todayLog.lunch ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">🍗 الغداء الرئيسي</span>
                </div>
                <span className="text-[10px] text-slate-400">أرز/مكرونة + 150-200ج بروتين + خضار</span>
              </div>
            </div>

            {/* سناك الواي بروتين */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleToggleMeal('snack_protein', !todayLog.snack_protein)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {todayLog.snack_protein ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">🥤 سناك المكمل (Whey Protein)</span>
                </div>
                <span className="text-[10px] text-slate-400">سكوب واي بروتين + لبن</span>
              </div>
            </div>

            {/* العشاء */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleToggleMeal('dinner', !todayLog.dinner)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {todayLog.dinner ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">🥗 العشاء</span>
                </div>
                <span className="text-[10px] text-slate-400">2-3 بيضات/تونة/فراخ + كربوهيدرات (بطاطس/أرز/عيش)</span>
              </div>
            </div>

            {/* سناك إضافي */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleToggleMeal('extra_snack', !todayLog.extra_snack)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {todayLog.extra_snack ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-600" />}
                  <span className="text-xs font-bold text-slate-200">🍌 سناك إضافي (قبل النوم/بين الوجبات)</span>
                </div>
                <span className="text-[10px] text-slate-400">لبن + موز أو سندوتش جبنة/بيض</span>
              </div>
            </div>

            {/* شرب الماء */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Droplets size={15} className="text-cyan-400" /> شرب الماء اليومي (لتر)
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((liter) => (
                  <button
                    key={liter}
                    type="button"
                    onClick={() => handleToggleMeal('water_liters', liter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition ${
                      todayLog.water_liters >= liter 
                        ? 'bg-cyan-500 text-slate-950' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {liter}L
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}