import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckSquare, Plus, Trash2, CheckCircle2, Circle, TrendingDown, ArrowUpRight } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function OperationalCommandCenter() {
  const [schedule, setSchedule] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // حالة الإضافة السريعة
  const [newTask, setNewTask] = useState('');
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // تحديد اليوم الحالي بالعربي
  const daysMap = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const todayName = daysMap[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(todayName);

  useEffect(() => {
    fetchOperationalData();
  }, []);

  const fetchOperationalData = async () => {
    try {
      // 1. جلب الجدول الأسبوعي
      const { data: schedData } = await supabase.from('schedule').select('*');
      if (schedData) setSchedule(schedData);

      // 2. جلب المهام اليومية
      const { data: taskData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (taskData) setTasks(taskData);

      // 3. جلب المصروفات
      const { data: expData } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (expData) setExpenses(expData);
    } catch (e) {
      console.error("Error fetching operational data:", e);
    }
  };

  // ------------------- إدارة الجدول الأسبوعي -------------------
  const toggleScheduleTask = async (id, currentStatus) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, completed: !currentStatus } : item));
    await supabase.from('schedule').update({ completed: !currentStatus }).eq('id', id);
  };

  // ------------------- إدارة المهام اليومية -------------------
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const item = { title: newTask, completed: false, dept_key: 'general' };
    const { data, error } = await supabase.from('tasks').insert([item]).select();
    if (data) {
      setTasks([data[0], ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  // ------------------- إدارة الوزارة المالية -------------------
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) return;

    const item = { title: newExpenseTitle, amount: Number(newExpenseAmount) };
    const { data } = await supabase.from('expenses').insert([item]).select();
    if (data) {
      setExpenses([data[0], ...expenses]);
      setNewExpenseTitle('');
      newExpenseAmount('');
    }
  };

  const deleteExpense = async (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    await supabase.from('expenses').delete().eq('id', id);
  };

  // التجميعات والتحليلات
  const daySchedule = schedule.filter(s => s.day_name === selectedDay);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* 1. قسم الجدول الأسبوعي واليومي التفاعلي */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-amber-400" size={20} />
            <h2 className="text-base font-bold text-slate-100">الجدول التشغيلي اليومي</h2>
            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
              اليوم: {todayName}
            </span>
          </div>

          {/* أزرار اختيار اليوم */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedDay === day 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* عرض مهام اليوم المختار */}
        <div>
          <div className="text-xs text-slate-400 mb-3 font-semibold">
            عنوان اليوم: <span className="text-amber-300 font-bold">{daySchedule[0]?.day_title || 'نشاط يمني'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {daySchedule.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleScheduleTask(item.id, item.completed)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  item.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through' 
                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.completed ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} className="text-slate-500" />}
                  <span className="text-xs font-bold">{item.task_text}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. قسم مزدوج: المهام اليومية + الوزارة المالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* قائمة المهام (Tasks) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckSquare size={16} className="text-cyan-400" /> المهام اليومية السريعة
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {tasks.filter(t => t.completed).length}/{tasks.length} مكتمل
            </span>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="إضافة مهمة جديدة..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 p-2 rounded-xl transition">
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div 
                  onClick={() => toggleTask(task.id, task.completed)} 
                  className={`flex items-center gap-2 cursor-pointer flex-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
                >
                  {task.completed ? <CheckCircle2 size={14} className="text-cyan-400" /> : <Circle size={14} className="text-slate-600" />}
                  <span>{task.title}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-rose-400 transition p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* الوزارة المالية (Expenses) */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" /> الوزارة المالية (سجل المصروفات)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              الإجمالي: {totalExpenses} ج.م
            </span>
          </div>

          <form onSubmit={handleAddExpense} className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="البند..."
              value={newExpenseTitle}
              onChange={(e) => setNewExpenseTitle(e.target.value)}
              className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="المبلغ..."
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="col-span-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1">
              <Plus size={14} /> إضافة
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {expenses.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-300 font-medium">{item.title}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-400">{item.amount} ج.م</span>
                  <button onClick={() => deleteExpense(item.id)} className="text-slate-600 hover:text-rose-400 transition p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}