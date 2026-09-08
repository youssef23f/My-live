import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, Wallet, Lightbulb, FileText, 
  Plus, Trash2, Copy, Eye, EyeOff, Search, Calendar, DollarSign, Check, Sparkles, Lock
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function MastermindTab() {
  const [activeSubTab, setActiveSubTab] = useState('accounts'); // accounts, debts, ideas, documents
  const [vaultItems, setVaultItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [secretInfo, setSecretInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    fetchVaultItems();
  }, []);

  const fetchVaultItems = async () => {
    try {
      const { data, error } = await supabase
        .from('mastermind_vault')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching mastermind items:", error);
      } else if (data) {
        setVaultItems(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      category: activeSubTab,
      title: title.trim(),
      details: details.trim(),
      secret_info: secretInfo.trim(),
      amount: amount ? parseFloat(amount) : 0,
      target_date: targetDate || null
    };

    try {
      const { data, error } = await supabase
        .from('mastermind_vault')
        .insert([newItem])
        .select();

      if (error) {
        alert("خطأ أثناء الحفظ: " + error.message);
      } else if (data && data.length > 0) {
        setVaultItems([data[0], ...vaultItems]);
        // Reset Form
        setTitle('');
        setDetails('');
        setSecretInfo('');
        setAmount('');
        setTargetDate('');
      }
    } catch (err) {
      alert("حدث خطأ غير متوقع: " + err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("هل أنت تأكد من إزالة هذا العنصر من العقل المدبر؟")) return;

    try {
      const { error } = await supabase
        .from('mastermind_vault')
        .delete()
        .eq('id', id);

      if (error) {
        alert("خطأ أثناء الحذف: " + error.message);
      } else {
        setVaultItems(vaultItems.filter(item => item.id !== id));
      }
    } catch (err) {
      alert("حدث خطأ: " + err.message);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = vaultItems
    .filter(item => item.category === activeSubTab)
    .filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6 dir-rtl text-slate-100 font-sans">
      
      {/* الهيدر العلوي بنمط الأخضر واللبني */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xl shadow-2xl shadow-emerald-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3 shadow-inner">
            <Shield size={14} className="text-cyan-400" />
            <span>العقل المدبر الرئاسي • Mastermind Vault</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            غرفة العمليات المركزية والسرية
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1.5 font-medium">
            إدارة الخزينة المشفرة: الحسابات، الأفكار البرمجية، الأوراق الرسمية، وخريطة الديون.
          </p>
        </div>

        {/* شريط البحث زجاجي باللون اللبني */}
        <div className="relative w-full md:w-72 z-10">
          <Search size={16} className="absolute right-3.5 top-3.5 text-cyan-400/70" />
          <input 
            type="text" 
            placeholder="بحث في الخزينة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
          />
        </div>
      </div>

      {/* الأزرار العلوية للأقسام الفرعية (تدرج أخضر مع تركواز) */}
      <div className="flex flex-wrap gap-2.5 border-b border-emerald-500/20 pb-4">
        {[
          { id: 'accounts', label: 'الحسابات والاشتراكات', icon: Key },
          { id: 'debts', label: 'الديون والالتزامات', icon: Wallet },
          { id: 'ideas', label: 'الأفكار المبتكرة (Incubation)', icon: Lightbulb },
          { id: 'documents', label: 'الوثائق الحساسة (ألمانيا)', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                  : 'bg-emerald-950/20 border border-emerald-500/15 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-slate-950' : 'text-cyan-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* نموذج الإضافة بالخلفية المظلمة والأطراف الخضراء */}
      <form onSubmit={handleAddItem} className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-400" /> 
          {activeSubTab === 'accounts' && "إضافة حساب أو اشتراك جديد"}
          {activeSubTab === 'debts' && "إضافة مستحق أو دين جديد"}
          {activeSubTab === 'ideas' && "مسودة فكرة أو مشروع جديد"}
          {activeSubTab === 'documents' && "تسجيل وثيقة أو رابط حساس"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input 
            type="text" 
            placeholder={
              activeSubTab === 'accounts' ? "اسم المنصة / الخدمة (مثال: OpenAI)" :
              activeSubTab === 'debts' ? "الجهة أو الشخص (مثال: القسط الأول)" :
              activeSubTab === 'ideas' ? "عنوان الفكرة / المشروع البرمجي" : "اسم الوثيقة (مثال: رقم الجواز/تأشيرة)"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            required
          />

          <input 
            type="text" 
            placeholder={
              activeSubTab === 'accounts' ? "اسم المستخدم / الإيميل" :
              activeSubTab === 'debts' ? "تفاصيل الدين (لك أو عليك)" :
              activeSubTab === 'ideas' ? "التقنيات المستخدمة / ملخص الفكرة" : "رقم الوثيقة / جهة الإصدار"
            }
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            type={activeSubTab === 'accounts' ? "password" : "text"}
            placeholder={
              activeSubTab === 'accounts' ? "كلمة المرور السريّة" :
              activeSubTab === 'documents' ? "الرابط السري / الكود الحساس" : "ملاحظات إضافية"
            }
            value={secretInfo}
            onChange={(e) => setSecretInfo(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 md:col-span-1"
          />

          {(activeSubTab === 'debts' || activeSubTab === 'ideas') && (
            <input 
              type="number" 
              placeholder={activeSubTab === 'debts' ? "المبلغ (بالجنيه/اليورو)" : "الميزانية المتوقعة"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          )}

          <input 
            type="date" 
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button 
          type="submit" 
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-2xl text-xs hover:opacity-90 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={16} /> حفظ في العقل المدبر
        </button>
      </form>

      {/* بطاقات البيانات المسجلة باللون الأخضر والتأثير الزجاجي اللبني */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/10 text-center text-slate-400 text-xs md:col-span-2">
            لا توجد بيانات مسجلة في هذا القسم حتى الآن.
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition" />

              <div>
                <div className="flex items-center justify-between pl-2">
                  <h4 className="font-bold text-sm text-emerald-300 group-hover:text-cyan-300 transition flex items-center gap-2">
                    <Lock size={14} className="text-cyan-400" />
                    {item.title}
                  </h4>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {item.details && (
                  <p className="text-slate-300 text-xs mt-2 font-medium leading-relaxed">{item.details}</p>
                )}

                {item.secret_info && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-200 truncate max-w-[200px]">
                      {activeSubTab === 'accounts' && !showPasswords[item.id] ? '••••••••••••' : item.secret_info}
                    </span>
                    <div className="flex items-center gap-2 mr-2">
                      {activeSubTab === 'accounts' && (
                        <button onClick={() => togglePasswordVisibility(item.id)} className="text-slate-400 hover:text-emerald-400 transition">
                          {showPasswords[item.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      <button onClick={() => copyToClipboard(item.secret_info, item.id)} className="text-slate-400 hover:text-cyan-400 transition">
                        {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/15 text-[11px] text-slate-400">
                {item.amount > 0 ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <DollarSign size={13} className="text-cyan-400" /> {item.amount}
                  </span>
                ) : <span />}
                {item.target_date && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar size={13} className="text-cyan-400" /> المستهدف: {item.target_date}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}