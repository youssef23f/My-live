import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { supabase } from './supabaseClient';

const DAYS = [
  { name: 'السبت', title: 'يوم البناء التقني', badge: '💻 Tech' },
  { name: 'الأحد', title: 'AI + Gym', badge: '🤖 AI & Fit' },
  { name: 'الاثنين', title: 'يوم التطوير الثقيل', badge: '⚡ High Focus' },
  { name: 'الثلاثاء', title: 'Gym + University', badge: '🎓 Uni & Fit' },
  { name: 'الأربعاء', title: 'AI Day', badge: '🤖 AI Focus' },
  { name: 'الخميس', title: 'Gym + Programming', badge: '🏋️ Dev & Fit' },
  { name: 'الجمعة', title: 'يوم المراجعة والاستراتيجية 😈', badge: '📊 Strategy' },
];

export default function ScheduleTab({ bgCard, bgInput }) {
  const [items, setItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState('السبت');
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase.from('schedule').select('*').order('id', { ascending: true });
      if (error) alert("خطأ في جلب الجدول: " + error.message);
      else if (data) setItems(data);
    } catch (err) {
      alert("خطأ اتصال: " + err.message);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const { error } = await supabase.from('schedule').update({ completed: !currentStatus }).eq('id', id);
      if (!error) {
        setItems(items.map(item => item.id === id ? { ...item, completed: !currentStatus } : item));
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const addTaskToDay = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const dayInfo = DAYS.find(d => d.name === selectedDay);

    try {
      const { data, error } = await supabase
        .from('schedule')
        .insert([{ 
          day_name: selectedDay, 
          day_title: dayInfo?.title || '', 
          task_text: newTaskText.trim(),
          completed: false 
        }])
        .select();

      if (error) {
        alert("خطأ إضافة نشاط: " + error.message);
      } else if (data && data.length > 0) {
        setItems([...items, data[0]]);
        setNewTaskText('');
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('schedule').delete().eq('id', id);
      if (!error) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (err) {
      alert("خطأ في الحذف: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* الهيدر الرئيسي */}
      <div className={`p-6 rounded-3xl border ${bgCard} shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-2">
            <Sparkles size={14} /> الخطة الأسبوعية المعتمدة
          </div>
          <h3 className="text-2xl font-black flex items-center gap-2.5">
            <Calendar className="text-amber-400" size={28} />
            جدول الأسبوع والروتين اليومي
          </h3>
        </div>

        {/* كارت إضافة عنصر جديد لأي يوم */}
        <form onSubmit={addTaskToDay} className="flex gap-2 w-full md:w-auto">
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value)}
            className={`${bgInput} rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500`}
          >
            {DAYS.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="أضف نشاطاً جديداً..." 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className={`flex-1 md:w-56 ${bgInput} rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500`}
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition">
            <Plus size={16} /> إضافة
          </button>
        </form>
      </div>

      {/* شبكة الأيام (7 أيام) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DAYS.map((day) => {
          const dayTasks = items.filter(i => i.day_name === day.name);
          return (
            <div key={day.name} className={`p-5 rounded-3xl border ${bgCard} shadow-lg space-y-4 flex flex-col justify-between hover:border-amber-500/30 transition`}>
              <div>
                <div className="flex items-center justify-between border-b border-slate-700/40 pb-3 mb-3">
                  <div>
                    <h4 className="text-lg font-black text-amber-400">{day.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{day.title}</p>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
                    {day.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {dayTasks.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">لا توجد أنشطة مضافة لهذا اليوم</p>
                  )}
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-2xl border ${bgInput} flex items-center justify-between gap-2 group transition ${task.completed ? 'opacity-40 line-through' : ''}`}
                    >
                      <div 
                        onClick={() => toggleTask(task.id, task.completed)} 
                        className="flex items-center gap-2.5 cursor-pointer flex-1"
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${task.completed ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-500'}`}>
                          {task.completed && <CheckCircle2 size={12} className="stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold">{task.task_text}</span>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}