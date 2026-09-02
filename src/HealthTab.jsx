import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplet, Dumbbell, Moon } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function HealthTab({ bgCard, bgInput }) {
  const [waterCups, setWaterCups] = useState(4);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [sleepHours, setSleepHours] = useState(7);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    const { data, error } = await supabase.from('health_tracker').select('*').limit(1);
    if (!error && data && data.length > 0) {
      setRecordId(data[0].id);
      setWaterCups(data[0].water_cups);
      setWorkoutDone(data[0].workout_done);
      setSleepHours(data[0].sleep_hours);
    }
  };

  const updateWater = async (delta) => {
    const newValue = Math.min(Math.max(0, waterCups + delta), 8);
    setWaterCups(newValue);
    if (recordId) {
      await supabase.from('health_tracker').update({ water_cups: newValue }).eq('id', recordId);
    }
  };

  const toggleWorkout = async () => {
    const newValue = !workoutDone;
    setWorkoutDone(newValue);
    if (recordId) {
      await supabase.from('health_tracker').update({ workout_done: newValue }).eq('id', recordId);
    }
  };

  const updateSleep = async (hours) => {
    setSleepHours(hours);
    if (recordId) {
      await supabase.from('health_tracker').update({ sleep_hours: hours }).eq('id', recordId);
    }
  };

  return (
    <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-6`}>
      <h3 className="text-xl font-bold flex items-center gap-2.5">
        <HeartPulse className="text-rose-500" size={26} />
        وزارة الصحة والطاقة البدنية
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${bgInput} flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">معدل شرب الماء</span>
            <Droplet className="text-blue-400" size={22} />
          </div>
          <div>
            <span className="text-3xl font-black text-blue-400">{waterCups} / 8</span>
            <span className="text-xs text-slate-400 mr-2">أكواب اليوم</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => updateWater(-1)} className="flex-1 py-1.5 bg-slate-800 rounded-lg text-xs font-bold">-</button>
            <button onClick={() => updateWater(1)} className="flex-1 py-1.5 bg-blue-500 text-slate-950 rounded-lg text-xs font-bold">+ كوب</button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${bgInput} flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">التمرين اليومي</span>
            <Dumbbell className="text-emerald-400" size={22} />
          </div>
          <div>
            <span className={`text-lg font-bold block ${workoutDone ? 'text-emerald-400' : 'text-slate-400'}`}>
              {workoutDone ? 'تم الإنجاز بنجاح 🔥' : 'لم يتم التمرين بعد'}
            </span>
          </div>
          <button 
            onClick={toggleWorkout} 
            className={`w-full py-2 rounded-xl text-xs font-bold transition ${workoutDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}
          >
            {workoutDone ? 'إلغاء التحديد' : 'تحديد كمكتمل (15 دقيقة)'}
          </button>
        </div>

        <div className={`p-5 rounded-2xl border ${bgInput} flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">ساعات النوم</span>
            <Moon className="text-purple-400" size={22} />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={sleepHours} 
              onChange={(e) => updateSleep(Number(e.target.value))}
              className="text-3xl font-black text-purple-400 bg-transparent w-20 focus:outline-none" 
            />
            <span className="text-xs text-slate-400">ساعات</span>
          </div>
          <span className="text-[11px] text-slate-500">المستهدف: 7-8 ساعات نوم عميق</span>
        </div>
      </div>
    </div>
  );
}