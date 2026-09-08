import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Eye, Lightbulb, ShieldAlert, Plus, Trash2, Key, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function MastermindTab({ bgCard, bgInput }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [vaultType, setVaultType] = useState('plan'); // 'plan' or 'account'
  const [items, setItems] = useState([]);

  // Form States
  const [title, setTitle] = useState('');
  const [fieldOne, setFieldOne] = useState('');
  const [fieldTwo, setFieldTwo] = useState('');

  const SECRET_PASS = '123321FYD';

  useEffect(() => {
    if (isAuthenticated) {
      fetchVaultItems();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASS) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('رمز الوصول غير صحيح. تم رفض الدخول!');
    }
  };

  const fetchVaultItems = async () => {
    try {
      const { data, error } = await supabase.from('mastermind_vault').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('mastermind_vault')
        .insert([{ category: vaultType, title, field_one: fieldOne, field_two: fieldTwo }])
        .select();

      if (!error && data) {
        setItems([data[0], ...items]);
        setTitle('');
        setFieldOne('');
        setFieldTwo('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('mastermind_vault').delete().eq('id', id);
      if (!error) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------ شاشة القفل البيضاء ذات الإطار الأخضر ------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)] text-center relative overflow-hidden">
          {/* تأثير البوابة الخضراء الضوئية */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>

          <div className="inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 animate-pulse">
            <Lock size={36} />
          </div>

          <h2 className="text-2xl font-black text-white mb-1 tracking-wide">غرفة العقل المدبر</h2>
          <p className="text-xs text-emerald-400 font-semibold mb-6">منطقة سيادية عالية التشفير - يُرجى إدخال رمز الفتح</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input 
                type="password"
                placeholder="أدخل الباسورد..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border-2 border-emerald-500/50 rounded-2xl px-4 py-3.5 text-center text-emerald-400 text-lg font-mono tracking-widest focus:outline-none focus:border-emerald-400 transition"
              />
            </div>

            {errorMsg && <p className="text-rose-500 text-xs font-bold">{errorMsg}</p>}

            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl transition shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              <KeyRound size={18} /> فتح البوابة السحرية
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------ الشاشة الرئيسية الواوو بأسلوب الهندسة والرموز الفخمة ------------------
  return (
    <div className="relative space-y-8 min-h-screen p-2 text-slate-100 overflow-hidden">
      
      {/* خلفية الرسوم الهندسية والرموز الطاقية متألقة */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <svg className="w-[800px] h-[800px] text-amber-500 animate-[spin_120s_linear_infinite]" viewBox="0 0 500 500" fill="none" stroke="currentColor" strokeWidth="1">
          {/* مثلّث وقوس العين الهندسية السحرية */}
          <polygon points="250,50 450,400 50,400" />
          <circle cx="250" cy="250" r="180" />
          <circle cx="250" cy="250" r="120" />
          <circle cx="250" cy="250" r="60" />
          <line x1="250" y1="0" x2="250" y2="500" />
          <line x1="0" y1="250" x2="500" y2="250" />
        </svg>
      </div>

      {/* الهيدر الأسطوري */}
      <div className={`relative z-10 p-6 rounded-3xl border ${bgCard} shadow-2xl border-amber-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-slate-900/90 backdrop-blur-xl`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400">
              <Eye size={36} className="animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl"></div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-1">
                <Sparkles size={14} /> غرفة التفكير الاستراتيجي والتشفير
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-amber-400">العقل المدبر - Mastermind Vault</h2>
              <p className="text-xs text-slate-400">حفظ الخطط العلياً والبيانات والحسابات الحساسة في مكان آمن وحصري.</p>
            </div>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition flex items-center gap-2"
          >
            <Lock size={14} /> إغلاق القفل
          </button>
        </div>
      </div>

      {/* نموذج الإضافة الخارق */}
      <div className={`relative z-10 p-6 rounded-3xl border ${bgCard} shadow-xl border-amber-500/20 space-y-4`}>
        <div className="flex gap-3 border-b border-slate-700/50 pb-4">
          <button 
            onClick={() => setVaultType('plan')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${vaultType === 'plan' ? 'bg-amber-500 text-slate-950' : `${bgInput} text-slate-400`}`}
          >
            <Lightbulb size={16} /> إضافة فكرة / خطة استراتيجية
          </button>
          <button 
            onClick={() => setVaultType('account')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${vaultType === 'account' ? 'bg-amber-500 text-slate-950' : `${bgInput} text-slate-400`}`}
          >
            <Key size={16} /> إضافة إيميل / حساب وكلمة سر
          </button>
        </div>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            type="text"
            placeholder={vaultType === 'plan' ? "عنوان الفكرة / المشروع" : "اسم الخدمة / المنصة (مثال: Gmail)"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full ${bgInput} border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500`}
          />
          <input 
            type="text"
            placeholder={vaultType === 'plan' ? "الهدف الرئيسي" : "الإيميل / اسم المستخدم"}
            value={fieldOne}
            onChange={(e) => setFieldOne(e.target.value)}
            className={`w-full ${bgInput} border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500`}
          />
          <input 
            type="text"
            placeholder={vaultType === 'plan' ? "خطة التنفيذ والتفاصيل" : "كلمة المرور (Password)"}
            value={fieldTwo}
            onChange={(e) => setFieldTwo(e.target.value)}
            className={`w-full ${bgInput} border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500`}
          />

          <div className="md:col-span-3 text-left">
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs transition inline-flex items-center gap-2 shadow-lg">
              <Plus size={16} /> حفظ في العقل المدبر
            </button>
          </div>
        </form>
      </div>

      {/* عرض الأفكار والبيانات المخزنة */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`p-5 rounded-3xl border ${bgCard} border-slate-700/50 space-y-3 shadow-lg hover:border-amber-500/40 transition relative group`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.category === 'plan' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {item.category === 'plan' ? '💡 خطة / فكرة' : '🔑 حساب وسرية'}
              </span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-rose-400 transition">
                <Trash2 size={16} />
              </button>
            </div>

            <h4 className="text-base font-black text-slate-100">{item.title}</h4>

            {item.category === 'plan' ? (
              <div className="space-y-2 text-xs">
                <p className="text-amber-400 font-semibold flex items-center gap-1.5"><Target size={14} /> الهدف: {item.field_one}</p>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-2xl border border-slate-800">{item.field_two}</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs font-mono bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <p className="text-slate-300"><span className="text-slate-500">Email:</span> {item.field_one}</p>
                <p className="text-emerald-400"><span className="text-slate-500">Password:</span> {item.field_two}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}