import React, { useState } from 'react';
import { Shield, Target, Wallet, HeartPulse, Globe, Code, Users, Award, Sparkles, CheckCircle, Flame } from 'lucide-react';

export default function StrategyTab({ bgCard, bgInput }) {
  const [activeSubTab, setActiveSubTab] = useState('priorities');

  return (
    <div className="space-y-6">
      {/* الهيدر الاستراتيجي الرئيسي */}
      <div className={`p-6 rounded-3xl border ${bgCard} shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/20`}>
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold mb-2">
            <Sparkles size={14} /> الدستور والتوجيهات الرئاسية العليا
          </div>
          <h3 className="text-2xl font-black flex items-center gap-2.5">
            <Shield className="text-amber-400" size={28} />
            القرارات والمسار الاستراتيجي
          </h3>
          <p className="text-slate-400 text-xs mt-1">الرؤية التي تحكم عمل جميع الوزارات وتضمن الاستمرارية وعدم الاستنزاف.</p>
        </div>

        {/* أزرار التبديل الداخلية */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveSubTab('priorities')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubTab === 'priorities' ? 'bg-amber-500 text-slate-950' : `${bgInput} text-slate-400 hover:text-amber-400`}`}
          >
            <Target size={15} /> ترتيب الأولويات
          </button>
          <button 
            onClick={() => setActiveSubTab('finance')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubTab === 'finance' ? 'bg-amber-500 text-slate-950' : `${bgInput} text-slate-400 hover:text-amber-400`}`}
          >
            <Wallet size={15} /> قانون المرتب (1500 ج)
          </button>
          <button 
            onClick={() => setActiveSubTab('health')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeSubTab === 'health' ? 'bg-amber-500 text-slate-950' : `${bgInput} text-slate-400 hover:text-amber-400`}`}
          >
            <HeartPulse size={15} /> قاعدة الطاقة والصحة
          </button>
        </div>
      </div>

      {/* 1. قسم ترتيب الأولويات السبعة */}
      {activeSubTab === 'priorities' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl ${bgInput} border border-amber-500/20 flex items-center gap-3 text-amber-400 text-xs font-semibold`}>
            <Flame size={20} className="shrink-0" />
            <span>"بدون ترتيب الأولويات الاستراتيجي، ستتوزع طاقتك بالتساوي على كل شيء فتفشل في كل شيء. اختر المعارك الحقيقية."</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { rank: '🥇', title: '1. الصحة والطاقة', desc: 'بدونها كل الوزارات ستضعف وتنهار الاستمرارية.', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', icon: HeartPulse },
              { rank: '🥈', title: '2. الجامعة والـ GPA', desc: 'أساس جوهري ومحوري لمستقبلك الأكاديمي.', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', icon: Award },
              { rank: '🥉', title: '3. اللغة الألمانية 🇩🇪', desc: 'وزارة الهجرة والمستقبل - مشروع السفر طويل المدى.', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', icon: Globe },
              { rank: '4️⃣', title: '4. البرمجة والـ AI', desc: 'بناء رأس المال المهاري المتقدم وركيزة العمل.', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/30', icon: Code },
              { rank: '5️⃣', title: '5. المال والانضباط', desc: 'وقف التسريب المالي وبناء الانضباط في الإنفاق.', color: 'from-teal-500/20 to-teal-500/5', border: 'border-teal-500/30', icon: Wallet },
              { rank: '6️⃣', title: '6. اللغة الإنجليزية 🇬🇧', desc: 'استمرارية هادئة يومياً بدون اختطاف وقت الأولويات.', color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/30', icon: Globe },
              { rank: '7️⃣', title: '7. العلاقات والشؤون الاجتماعية', desc: 'الحفاظ على الحد الصحي العالي بدون استنزاف الوقت أو الطاقة.', color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/30', icon: Users },
            ].map((p) => (
              <div key={p.title} className={`p-5 rounded-3xl border ${bgCard} ${p.border} bg-gradient-to-br ${p.color} space-y-2 shadow-lg relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{p.rank}</span>
                  <p.icon size={22} className="opacity-60" />
                </div>
                <h4 className="text-base font-black pt-1">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. قسم قانون المرتب وتوزيع الـ 1500 جنيه */}
      {activeSubTab === 'finance' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-4 border-amber-500/30`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div>
                <h4 className="text-xl font-black text-amber-400">📜 قانون يوم المرتب (1500 جنيه)</h4>
                <p className="text-xs text-slate-400 mt-1">ممنوع ترك المبلغ مجمعاً في مكان واحد. التقسيم إجباري فور الاستلام لمنع التسريب.</p>
              </div>
              <div className="text-left bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
                <p className="text-[10px] text-amber-400 font-bold">الميزانية الشهرية</p>
                <p className="text-lg font-black text-amber-400">1,500 ج.م</p>
              </div>
            </div>

            {/* جدول توزيع النسبة والمبلغ */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400">
                    <th className="py-3 px-2 font-bold">البند والاستخدام</th>
                    <th className="py-3 px-2 font-bold text-center">النسبة</th>
                    <th className="py-3 px-2 font-bold text-left">المبلغ المستحق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  <tr>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-amber-400">🏦 الادخار والمستقبل</p>
                      <p className="text-[11px] text-slate-400 font-normal">ممنوع اللمس إلا لهدف ضخم (لابتوب، سفر، رسوم دراسية/مشروع)</p>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-amber-400">35%</td>
                    <td className="py-3.5 px-2 text-left font-black text-amber-400">525 ج.م</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-emerald-400">🛡️ صندوق الطوارئ</p>
                      <p className="text-[11px] text-slate-400 font-normal">احتياطي للأزمات والظروف غير المتوقعة</p>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-emerald-400">15%</td>
                    <td className="py-3.5 px-2 text-left font-black text-emerald-400">225 ج.م</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-purple-400">🧠 التعليم والتطوير</p>
                      <p className="text-[11px] text-slate-400 font-normal">كتب، أدوات برمجية، اشتراكات، كورسات</p>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-purple-400">15%</td>
                    <td className="py-3.5 px-2 text-left font-black text-purple-400">225 ج.م</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-blue-400">🎮 المصروف الشخصي</p>
                      <p className="text-[11px] text-slate-400 font-normal">المتعة والترفيه الشخصي بحرية وبدون تأنيب ضمير</p>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-blue-400">25%</td>
                    <td className="py-3.5 px-2 text-left font-black text-blue-400">375 ج.م</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-pink-400">🎁 بند مرن</p>
                      <p className="text-[11px] text-slate-400 font-normal">هدايا، مجاملات، أو طوارئ فرعية</p>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-pink-400">10%</td>
                    <td className="py-3.5 px-2 text-left font-black text-pink-400">150 ج.م</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. قسم الصحة والأداء */}
      {activeSubTab === 'health' && (
        <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg space-y-6`}>
          <div>
            <h4 className="text-xl font-black text-rose-400 flex items-center gap-2">
              <HeartPulse size={24} /> المحرك الأول: خطة الشهر الأول للبناء البدني
            </h4>
            <p className="text-xs text-slate-400 mt-1">الهدف ليس الوصول إلى جسم رياضى خارق فوراً، بل الوصول للثبات والاستمرارية.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={`p-5 rounded-2xl ${bgInput} border border-slate-700/50 space-y-2`}>
              <div className="text-2xl">😴</div>
              <h5 className="font-bold text-sm text-amber-400">النوم المنتظم</h5>
              <p className="text-xs text-slate-300 leading-relaxed">تثبيت وقت النوم والاستيقاظ بشكل شبه ثابت يومياً لاستعادة صفاء الذهن والتركيز.</p>
            </div>

            <div className={`p-5 rounded-2xl ${bgInput} border border-slate-700/50 space-y-2`}>
              <div className="text-2xl">🍽️</div>
              <h5 className="font-bold text-sm text-emerald-400">التغذية المنظمة</h5>
              <p className="text-xs text-slate-300 leading-relaxed">3 فرص أكل يومياً كحد أدنى، حتى لو وجبات خفيفة ومبسطة للحفاظ على معدل الطاقة.</p>
            </div>

            <div className={`p-5 rounded-2xl ${bgInput} border border-slate-700/50 space-y-2`}>
              <div className="text-2xl">🏃</div>
              <h5 className="font-bold text-sm text-blue-400">الرياضة المستدامة</h5>
              <p className="text-xs text-slate-300 leading-relaxed">3 أيام أسبوعياً للجيم كبداية. ممنوع التحمس الزائد (6 أيام) ثم الانهيار والانقطاع 😈.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}