import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Plus, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function EducationTab({ bgCard, bgInput }) {
  const [targetGPA, setTargetGPA] = useState('3.80');
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseHours, setNewCourseHours] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) {
        alert("خطأ جلب الكورسات: " + error.message);
      } else if (data) {
        setCourses(data);
      }
    } catch (err) {
      alert("خطأ اتصال الكورسات: " + err.message);
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim() || !newCourseHours) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ name: newCourseName.trim(), hours: Number(newCourseHours), completed_hours: 0 }])
        .select();

      if (error) {
        alert("خطأ إضافة كورس: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setCourses([data[0], ...courses]);
        setNewCourseName('');
        setNewCourseHours('');
      }
    } catch (err) {
      alert("خطأ غير متوقع: " + err.message);
    }
  };

  const updateProgress = async (id, currentHours, totalHours, delta) => {
    const newHours = Math.min(Math.max(0, currentHours + delta), totalHours);
    try {
      const { error } = await supabase.from('courses').update({ completed_hours: newHours }).eq('id', id);
      if (error) {
        alert("خطأ تحديث الساعات: " + error.message);
      } else {
        setCourses(courses.map(c => c.id === id ? { ...c, completed_hours: newHours } : c));
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const deleteCourse = async (id) => {
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        alert("خطأ مسح الكورس: " + error.message);
      } else {
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border ${bgCard} shadow-lg`}>
        <h3 className="text-xl font-bold flex items-center gap-2.5 mb-6">
          <GraduationCap className="text-amber-400" size={26} />
          وزارة التعليم والذكاء الاصطناعي
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-2xl border ${bgInput}`}>
            <span className="text-xs text-slate-400 block mb-1 font-semibold">المعدل التراكمي المستهدف (GPA)</span>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={targetGPA} 
                onChange={(e) => setTargetGPA(e.target.value)}
                className="text-3xl font-black text-amber-400 bg-transparent w-full focus:outline-none" 
              />
              <Award className="text-amber-400" size={28} />
            </div>
          </div>
        </div>

        <form onSubmit={addCourse} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input 
            type="text" 
            placeholder="اسم الكورس / الدبلومة الجديدة..." 
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            className={`flex-1 ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
          />
          <input 
            type="number" 
            placeholder="إجمالي الساعات" 
            value={newCourseHours}
            onChange={(e) => setNewCourseHours(e.target.value)}
            className={`w-full sm:w-32 ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1">
            <Plus size={18} /> إضافة
          </button>
        </form>

        <h4 className="font-bold text-sm mb-4 text-slate-300">سجل الكورسات والمواد المفتوحة</h4>
        <div className="space-y-4">
          {courses.map(course => {
            const completed = course.completed_hours || 0;
            const percent = Math.round((completed / course.hours) * 100) || 0;
            return (
              <div key={course.id} className={`p-4 rounded-2xl border ${bgInput} space-y-3`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-sm font-semibold">{course.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">{completed} / {course.hours} ساعة ({percent}%)</span>
                    <button onClick={() => deleteCourse(course.id)} className="text-rose-400 hover:text-rose-300 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-700/40 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={() => updateProgress(course.id, completed, course.hours, -1)} className="px-2.5 py-1 bg-slate-800 text-xs rounded-lg font-bold hover:bg-slate-700">- ساعة</button>
                  <button onClick={() => updateProgress(course.id, completed, course.hours, 1)} className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs rounded-lg font-bold hover:bg-amber-400">+ ساعة</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}