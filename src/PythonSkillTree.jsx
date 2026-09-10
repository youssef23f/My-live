import React, { useState, useEffect } from 'react';
import { Terminal, CheckSquare, Award, Code2, BookOpen, Cpu, Play } from 'lucide-react';
import { supabase } from './supabaseClient';

const INITIAL_SKILLS = [
  // Fundamentals
  { skill_key: 'func_scope', category: 'Fundamentals', skill_name: 'Functions & Scope & Recursion', watched: true, applied: true, solved_problems: true, built_project: false, can_explain: false },
  { skill_key: 'exceptions', category: 'Fundamentals', skill_name: 'Custom Exceptions & Handling', watched: true, applied: true, solved_problems: false, built_project: false, can_explain: false },
  
  // OOP
  { skill_key: 'oop_basics', category: 'OOP', skill_name: 'Classes, Inheritance & Polymorphism', watched: true, applied: true, solved_problems: true, built_project: true, can_explain: false },
  { skill_key: 'dunder_methods', category: 'OOP', skill_name: 'Magic (Dunder) Methods', watched: true, applied: true, solved_problems: false, built_project: false, can_explain: false },
  
  // Advanced Python
  { skill_key: 'decorators', category: 'Advanced Python', skill_name: 'Decorators & Closures', watched: true, applied: true, solved_problems: false, built_project: false, can_explain: false },
  { skill_key: 'generators', category: 'Advanced Python', skill_name: 'Generators & Iterators', watched: true, applied: false, solved_problems: false, built_project: false, can_explain: false },
  { skill_key: 'async_python', category: 'Advanced Python', skill_name: 'Asyncio & Concurrency', watched: true, applied: false, solved_problems: false, built_project: false, can_explain: false },
  
  // Backend & APIs
  { skill_key: 'fastapi', category: 'Backend', skill_name: 'FastAPI & Pydantic Validation', watched: true, applied: true, solved_problems: false, built_project: true, can_explain: false },
  { skill_key: 'postgres_orm', category: 'Backend', skill_name: 'PostgreSQL & SQLAlchemy / SQLModel', watched: true, applied: true, solved_problems: false, built_project: false, can_explain: false },

  // AI & Data
  { skill_key: 'numpy_pandas', category: 'AI & Data', skill_name: 'NumPy & Pandas Manipulation', watched: true, applied: true, solved_problems: true, built_project: true, can_explain: true },
  { skill_key: 'pytorch_basics', category: 'AI & Data', skill_name: 'PyTorch Tensors & Neural Nets', watched: true, applied: true, solved_problems: false, built_project: false, can_explain: false },
];

export default function PythonSkillTree() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from('python_skill_tree').select('*');
      if (data && data.length > 0) {
        setSkills(data);
      } else {
        await supabase.from('python_skill_tree').insert(INITIAL_SKILLS);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateMastery = (skill) => {
    let score = 0;
    if (skill.watched) score += 10;
    if (skill.applied) score += 20;
    if (skill.solved_problems) score += 20;
    if (skill.built_project) score += 30;
    if (skill.can_explain) score += 20;
    return score;
  };

  const handleToggle = async (skill_key, field) => {
    const updated = skills.map((s) => {
      if (s.skill_key === skill_key) {
        return { ...s, [field]: !s[field] };
      }
      return s;
    });
    setSkills(updated);

    const targetSkill = updated.find((s) => s.skill_key === skill_key);
    await supabase.from('python_skill_tree').upsert(targetSkill, { onConflict: 'skill_key' });
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  // إجمالي الإتقان الحقيقي لبايثون
  const overallPythonMastery = Math.round(
    skills.reduce((acc, s) => acc + calculateMastery(s), 0) / (skills.length || 1)
  );

  return (
    <div className="space-y-6 dir-rtl font-sans text-slate-100">
      
      {/* هيدر شجرة بايثون */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950/60 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-bold mb-3">
              <Terminal size={14} className="text-emerald-400" />
              <span>Anti-Illusion Skill Tree • Python Developer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-100">
              شجرة مهارات Python (محاربة وهم المعرفة)
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              مستوى الإتقان يُحسب فقط عند التطبيق، حل المسائل، وبناء المشاريع الفعلية.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 block">إجمالي إتقان Python الحقيقي</span>
              <span className="text-3xl font-black text-emerald-400">{overallPythonMastery}%</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* عرض المهارات حسب الفئات */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat} className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Cpu size={16} /> {cat}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => {
                  const mastery = calculateMastery(skill);
                  return (
                    <div key={skill.skill_key} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{skill.skill_name}</span>
                        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          mastery >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          mastery >= 40 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {mastery}%
                        </span>
                      </div>

                      {/* معايير التقييم الحقيقية */}
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {[
                          { key: 'watched', label: 'شاهدت (+10%)' },
                          { key: 'applied', label: 'طبقت (+20%)' },
                          { key: 'solved_problems', label: 'مسائل (+20%)' },
                          { key: 'built_project', label: 'مشروع (+30%)' },
                          { key: 'can_explain', label: 'أشرحها (+20%)' }
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleToggle(skill.skill_key, item.key)}
                            className={`p-1.5 rounded-xl border text-right transition flex items-center gap-1.5 ${
                              skill[item.key]
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-md flex items-center justify-center text-[9px] ${
                              skill[item.key] ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800'
                            }`}>
                              ✓
                            </span>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}