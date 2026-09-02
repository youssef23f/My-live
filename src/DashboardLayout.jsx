import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, HeartPulse, Wallet, Globe, 
  LogOut, Sparkles, CheckCircle2, Plus, Calendar, Shield 
} from 'lucide-react';
import { supabase } from './supabaseClient';

import EducationTab from './EducationTab';
import HealthTab from './HealthTab';
import FinanceTab from './FinanceTab';
import ForeignTab from './ForeignTab';
import ScheduleTab from './ScheduleTab';
import StrategyTab from './StrategyTab';

export default function DashboardLayout({ onLogout, t, isDark, bgCard, bgInput }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDept, setNewTaskDept] = useState('deptEdu');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (error) {
        alert("خطأ أثناء جلب المهام: " + error.message);
      } else if (data) {
        setTasks(data);
      }
    } catch (err) {
      alert("خطأ في الاتصال بقاعدة البيانات: " + err.message);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title: newTaskText.trim(), dept_key: newTaskDept, completed: false }])
        .select();

      if (error) {
        alert("خطأ أثناء إضافة المهمة: " + error.message);
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        setTasks([data[0], ...tasks]);
        setNewTaskText('');
      }
    } catch (err) {
      alert("حدث خطأ غير متوقع: " + err.message);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) {
        alert("خطأ أثناء تحديث حالة المهمة: " + error.message);
      } else {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      }
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* القائمة الجانبية (Sidebar) */}
      <aside className={`w-full md:w-72 ${bgCard} border-b md:border-b-0 ltr:md:border-r rtl:md:border-l p-6 flex flex-col justify-between shrink-0`}>
        <div>
          <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="bg-amber-500 text-slate-950 p-2 rounded-xl font-bold">👑</div>
            <div>
              <h1 className="font-bold text-base">{t.title}</h1>
              <p className="text-[11px] text-amber-500 font-medium">{t.subTitle}</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <LayoutDashboard size={18} /> <span>{t.navDashboard}</span>
            </button>
            <button onClick={() => setActiveTab('strategy')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'strategy' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <Shield size={18} /> <span>القرارات والاستراتيجيات</span>
            </button>
            <button onClick={() => setActiveTab('schedule')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'schedule' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <Calendar size={18} /> <span>جدولي الأسبوعي</span>
            </button>
            <button onClick={() => setActiveTab('education')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'education' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <BookOpen size={18} /> <span>{t.navEdu}</span>
            </button>
            <button onClick={() => setActiveTab('health')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'health' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <HeartPulse size={18} /> <span>{t.navHealth}</span>
            </button>
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'finance' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <Wallet size={18} /> <span>{t.navFinance}</span>
            </button>
            <button onClick={() => setActiveTab('foreign')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition ${activeTab === 'foreign' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-amber-400'}`}>
              <Globe size={18} /> <span>{t.navForeign}</span>
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-700/40">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
            <LogOut size={14} /> <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي (Main Content Area) */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 pt-16 md:pt-8">
        <div className={`p-6 rounded-3xl border ${bgCard} shadow-xl`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-3">
                <Sparkles size={14} /> التقرير الرئاسي اليومي
              </div>
              <h2 className="text-2xl md:text-3xl font-black">{t.welcome}</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">{t.statusText}</p>
            </div>
          </div>
        </div>

        {/* لوحة التحكم الرئيسية */}
        {activeTab === 'dashboard' && (
          <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-6`}>
            <h3 className="font-bold text-lg flex items-center gap-2.5">
              <CheckCircle2 size={22} className="text-amber-400" />
              {t.tasksTitle}
            </h3>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input 
                type="text" 
                placeholder={t.addTaskPlaceholder}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className={`flex-1 ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
              />
              <select value={newTaskDept} onChange={(e) => setNewTaskDept(e.target.value)} className={`${bgInput} rounded-xl px-3 text-xs focus:outline-none`}>
                <option value="deptEdu">{t.deptEdu}</option>
                <option value="deptForeign">{t.deptForeign}</option>
                <option value="deptHealth">{t.deptHealth}</option>
                <option value="deptFinance">{t.deptFinance}</option>
              </select>
              <button type="submit" className="bg-amber-500 text-slate-950 px-4 rounded-xl font-bold hover:bg-amber-400 transition"><Plus size={18} /></button>
            </form>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div key={task.id} onClick={() => toggleTask(task.id, task.completed)} className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${task.completed ? 'opacity-40 line-through' : bgInput}`}>
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold">{t[task.dept_key] || task.dept_key}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* التبويبات الأخرى */}
        {activeTab === 'strategy' && <StrategyTab bgCard={bgCard} bgInput={bgInput} />}
        {activeTab === 'schedule' && <ScheduleTab bgCard={bgCard} bgInput={bgInput} />}
        {activeTab === 'education' && <EducationTab bgCard={bgCard} bgInput={bgInput} />}
        {activeTab === 'health' && <HealthTab bgCard={bgCard} bgInput={bgInput} />}
        {activeTab === 'finance' && <FinanceTab bgCard={bgCard} bgInput={bgInput} />}
        {activeTab === 'foreign' && <ForeignTab bgCard={bgCard} bgInput={bgInput} />}
      </main>
    </div>
  );
}