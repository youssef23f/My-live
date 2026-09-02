import React, { useState, useEffect } from 'react';
import { Lock, Mail, KeyRound, ShieldCheck, Sun, Moon, Languages } from 'lucide-react';
import { translations } from './translations';
import DashboardLayout from './DashboardLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('ar');

  const t = translations[lang];

  useEffect(() => {
    const savedAuth = localStorage.getItem('republic_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === "mathyo.demyan1@gmail.com" && passwordInput.trim() === "1221Mathyo#") {
      setIsAuthenticated(true);
      localStorage.setItem('republic_auth', 'true');
      setErrorMessage('');
    } else {
      setErrorMessage(t.errorMsg);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('republic_auth');
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900';
  const bgCard = isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200';
  const bgInput = isDark ? 'bg-slate-900 border-slate-700/80 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800';

  return (
    <div className={`${bgMain} min-h-screen font-sans transition-colors duration-300`} dir={t.dir}>
      
      {/* Top Header Switchers */}
      <div className="fixed top-4 ltr:right-4 rtl:left-4 z-50 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-1 px-2 border-r border-slate-700">
          <Languages size={16} className="text-amber-400 mr-1" />
          <button onClick={() => setLang('ar')} className={`px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'ar' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>AR</button>
          <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>EN</button>
          <button onClick={() => setLang('de')} className={`px-2 py-1 rounded-lg text-xs font-bold transition ${lang === 'de' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>DE</button>
        </div>

        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2 rounded-xl text-amber-400 hover:bg-slate-800">
          {isDark ? <Sun size={18} /> : <Moon size={18} className="text-slate-200" />}
        </button>
      </div>

      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className={`w-full max-w-md ${bgCard} border rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-black">{t.loginTitle}</h1>
              <p className="text-slate-400 text-xs mt-2">{t.loginSub}</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2">{t.emailLabel}</label>
                <input 
                  type="email" 
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={`w-full ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2">{t.passLabel}</label>
                <input 
                  type="password" 
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full ${bgInput} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500`}
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 mt-6">
                <ShieldCheck size={18} /> {t.loginBtn}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <DashboardLayout onLogout={handleLogout} t={t} isDark={isDark} bgCard={bgCard} bgInput={bgInput} />
      )}

    </div>
  );
}