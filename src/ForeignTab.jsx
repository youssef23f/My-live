import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle2, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function ForeignTab({ bgCard, bgInput }) {
  const [langLevel, setLangLevel] = useState('A2');
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    const { data, error } = await supabase.from('foreign_checklist').select('*').order('created_at', { ascending: false });
    if (!error && data) setChecklist(data);
  };

  const toggleCheck = async (id, currentStatus) => {
    const { error } = await supabase
      .from('foreign_checklist')
      .update({ done: !currentStatus })
      .eq('id', id);

    if (!error) {
      setChecklist(checklist.map(item => item.id === id ? { ...item, done: !currentStatus } : item));
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const { data, error } = await supabase
      .from('foreign_checklist')
      .insert([{ text: newItem, done: false }])
      .select();

    if (!error && data) {
      setChecklist([data[0], ...checklist]);
      setNewItem('');
    }
  };

  return (
    <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-6`}>
      <h3 className="text-xl font-bold flex items-center gap-2.5">
        <Globe className="text-blue-400" size={26} />
        وزارة الخارجية ملف الهجرة والسفر (ألمانيا 🇩🇪)
      </h3>

      <div className={`p-5 rounded-2xl border ${bgInput}`}>
        <span className="text-xs text-slate-400 block mb-2 font-semibold">مستوى اللغة الألمانية الحالي</span>
        <div className="flex gap-2">
          {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
            <button 
              key={level} 
              onClick={() => setLangLevel(level)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${langLevel === level ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-300">قائمة متطلبات السفر والتأشيرة</h4>

        <form onSubmit={addItem} className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="أضف شرطاً جديداً..." 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className={`flex-1 ${bgInput} rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500`}
          />
          <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-4 rounded-xl">+</button>
        </form>

        {checklist.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggleCheck(item.id, item.done)}
            className={`p-4 rounded-2xl border ${bgInput} cursor-pointer flex items-center justify-between transition hover:border-amber-500/40`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-500'}`}>
                {item.done && <CheckCircle2 size={14} className="stroke-[3]" />}
              </div>
              <span className={`text-sm font-medium ${item.done ? 'line-through opacity-50' : ''}`}>{item.text}</span>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold ${item.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {item.done ? 'مكتمَـل' : 'قيد الإجراء'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}