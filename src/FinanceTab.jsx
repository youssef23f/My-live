import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function FinanceTab({ bgCard, bgInput }) {
  const [salary, setSalary] = useState(1500);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (error) {
        alert("خطأ جلب المصروفات: " + error.message);
      } else if (data) {
        setExpenses(data);
      }
    } catch (err) {
      alert("خطأ اتصال المالية: " + err.message);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ title: title.trim(), amount: Number(amount) }])
        .select();

      if (error) {
        alert("خطأ مالية أثناء الإضافة: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setExpenses([data[0], ...expenses]);
        setTitle('');
        setAmount('');
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) {
        alert("خطأ مسح المصروف: " + error.message);
      } else {
        setExpenses(expenses.filter(e => e.id !== id));
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-6`}>
      <h3 className="text-xl font-bold flex items-center gap-2.5">
        <Wallet className="text-emerald-400" size={26} />
        الوزارة المالية والتخطيط الاقتصادي
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border ${bgInput}`}>
          <span className="text-xs text-slate-400 block mb-1">الراتب / الدخل الشهري</span>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={salary} 
              onChange={(e) => setSalary(Number(e.target.value))}
              className="text-3xl font-black text-emerald-400 bg-transparent w-full focus:outline-none"
            />
            <span className="text-xs text-emerald-500 font-bold">ج.م</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${bgInput}`}>
          <span className="text-xs text-slate-400 block mb-1">إجمالي المصروفات الحالية</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-rose-400">{totalExpenses}</span>
            <span className="text-xs text-rose-500 font-bold">ج.م</span>
          </div>
        </div>
      </div>

      <form onSubmit={addExpense} className="flex flex-col sm:flex-row gap-2">
        <input 
          type="text" 
          placeholder="وصف المصروف الجديد..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className={`flex-1 ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
        />
        <input 
          type="number" 
          placeholder="المبلغ (ج.م)" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className={`w-full sm:w-32 ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
        />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1">
          <Plus size={18} /> تسليط
        </button>
      </form>

      <div className="space-y-2">
        <h4 className="font-bold text-sm mb-3 text-slate-300">سجل المصروفات الفعلي</h4>
        {expenses.map(item => (
          <div key={item.id} className={`p-3.5 rounded-xl border ${bgInput} flex items-center justify-between text-sm`}>
            <span className="font-medium">{item.title}</span>
            <div className="flex items-center gap-3">
              <span className="text-rose-400 font-bold">-{item.amount} ج.م</span>
              <button onClick={() => deleteExpense(item.id)} className="text-slate-500 hover:text-rose-400">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}