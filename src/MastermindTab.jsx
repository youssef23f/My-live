import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, Wallet, Lightbulb, FileText, 
  Plus, Trash2, Copy, Eye, EyeOff, Search, Calendar, DollarSign, Check, Sparkles, Lock, Unlock, AlertCircle, Image
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function MastermindTab() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState('accounts');
  const [vaultItems, setVaultItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [secretInfo, setSecretInfo] = useState('');
  const [amount, setAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const MASTER_PASSWORD = "123321FYD"; 

  // الصور الثلاث الخاصة بالعقل المدبر
  const galleryImages = [
    { id: 1, src: '/mastermind-1.jpg', title: 'The Eye Ritual', tag: 'المجلس السري' },
    { id: 2, src: '/mastermind-2.jpg', title: 'Veritas Invicta', tag: 'الحقيقة المطلقة' },
    { id: 3, src: '/mastermind-3.jpg', title: 'Arcane Throne', tag: 'الرمز المشفر' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchVaultItems();
    }
  }, [isAuthenticated]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      setPassError(false);
      setPasscode('');
    } else {
      setPassError(true);
    }
  };

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

  // شاشة بوابة الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 dir-rtl font-sans">
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden text-center space-y-6">
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="text-cyan-400" size={28} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                بوابة العقل المدبر المشفرة
              </h2>
              <p className="text-slate-400 text-xs mt-1.5 font-medium">
                يرجى إدخال رمز الأمان للوصول إلى الغرفة السرية
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 pt-2">
              <input 
                type="password" 
                placeholder="أدخل كلمة المرور..." 
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setPassError(false);
                }}
                className={`w-full bg-slate-900/90 border ${passError ? 'border-rose-500/80' : 'border-emerald-500/30 focus:border-cyan-400'} rounded-2xl px-4 py-3 text-sm text-center tracking-widest text-slate-100 placeholder-slate-500 focus:outline-none transition`}
                autoFocus
              />

              {passError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium">
                  <AlertCircle size={14} />
                  <span>كلمة المرور غير صحيحة!</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold py-3 rounded-2xl text-xs hover:opacity-90 transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <Unlock size={16} /> فتح الخزينة
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dir-rtl text-slate-100 font-sans">
      
      {/* هيدر الصفحة */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3">
            <Shield size={14} className="text-cyan-400" />
            <span>العقل المدبر الرئاسي • Mastermind Vault</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            غرفة العمليات المركزية والسرية
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1.5 font-medium">
            إدارة الخزينة المشفرة والمعرض الرمزي الخاص بالقيادة.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto z-10">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute right-3.5 top-3.5 text-cyan-400/70" />
            <input 
              type="text" 
              placeholder="بحث في الخزينة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition flex items-center justify-center"
            title="قفل الخزينة"
          >
            <Lock size={18} />
          </button>
        </div>
      </div>

      {/* معرض الصور الثلاث الغامض بأسلوب البطاقات الرمزية الفاخرة */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 px-1">
          <Image size={16} className="text-emerald-400" />
          <span>الأيقونات والمعارض الرمزية (Vault Gallery)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((img) => (
            <div 
              key={img.id}
              onClick={() => setSelectedImage(img.src)}
              className="group relative h-48 rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-900/80 cursor-pointer shadow-xl transition-all duration-500 hover:scale-[1.02] hover:border-cyan-400"
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
              
              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono">
                    {img.tag}
                  </span>
                  <h4 className="font-bold text-slate-100 mt-1">{img.title}</h4>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                  <Eye size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / معاينة الصورة بحجم كامل عند الضغط عليها */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden border border-emerald-500/40 shadow-2xl">
            <img src={selectedImage} alt="Full Preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* أزرار التنقل بين الأقسام */}
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

      {/* نموذج الإضافة */}
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
            placeholder="عنوان البند..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            required
          />

          <input 
            type="text" 
            placeholder="التفاصيل أو الوصف..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input 
            type={activeSubTab === 'accounts' ? "password" : "text"}
            placeholder="معلومات سرية / كلمة مرور"
            value={secretInfo}
            onChange={(e) => setSecretInfo(e.target.value)}
            className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 md:col-span-1"
          />

          {(activeSubTab === 'debts' || activeSubTab === 'ideas') && (
            <input 
              type="number" 
              placeholder="المبلغ"
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
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-2xl text-xs hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={16} /> حفظ في العقل المدبر
        </button>
      </form>

      {/* قائمة العناصر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/10 text-center text-slate-400 text-xs md:col-span-2">
            لا توجد بيانات مسجلة في هذا القسم حتى الآن.
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="group p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 hover:border-cyan-400/50 transition duration-300 shadow-lg flex flex-col justify-between space-y-3 relative overflow-hidden"
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