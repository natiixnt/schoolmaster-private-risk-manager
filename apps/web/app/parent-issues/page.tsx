'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';

interface ParentIssue {
  id: string;
  title: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    class?: { name: string };
  } | null;
}

interface ApiResponse {
  items: ParentIssue[];
  total: number;
}

export default function ParentIssuesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<ParentIssue[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await authFetch<ApiResponse>('/parent-issues');
        if (data?.items) setIssues(data.items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusLabel = (s: string) => {
    const labels = { OPEN: 'Nowe', IN_PROGRESS: 'W toku', RESOLVED: 'Zamknięte' };
    return labels[s as keyof typeof labels] || s;
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'HIGH': return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      default: return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    }
  };

  // Funkcja do koloru kropki na podstawie priority
  const getPriorityDot = (p: string) => {
    switch (p) {
      case 'HIGH': return 'bg-red-500 ring-red-100';
      case 'MEDIUM': return 'bg-amber-500 ring-amber-100';
      default: return 'bg-emerald-500 ring-emerald-100';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- NIEBIESKI PASEK SYSTEMOWY --- */}
      <div className="bg-indigo-900 h-14 sticky w-full top-0 z-50 flex items-center px-6 lg:px-12 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="white" strokeWidth="80">
              <circle r="224" cx="150" cy="491" />
            </g>
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-4 text-white font-black tracking-tighter text-lg uppercase">
          Schoolmaster
        </div>
      </div>

      {/* --- DYNAMICZNY NAGŁÓWEK --- */}
      <div className="relative bg-indigo-900 overflow-hidden py-12 px-6 lg:px-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="currentColor" strokeWidth="100">
              <circle r="234" cx="196" cy="23" className="text-white" />
              <circle r="234" cx="790" cy="491" className="text-white" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-white">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Centrum Zgłoszeń</h1>
              <p className="text-indigo-200 mt-2 font-medium max-w-md">
                Zarządzaj komunikacją i rozwiązuj problemy zgłoszone przez opiekunów.
              </p>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest">Wszystkich</p>
                <p className="text-2xl font-black">{issues.length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">Krytyczne</p>
                <p className="text-2xl font-black">{issues.filter(i => i.priority === 'HIGH').length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              {/* ZMIANA: SAM PLUS ZAMIAST TEKSTU */}
              <button className="bg-white hover:bg-indigo-50 text-indigo-900 w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6 lg:p-12 -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* --- FILTRY --- */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-6 border-b border-slate-100">
            <div className="flex gap-2">
              {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${
                    filterStatus === s 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {s === 'all' ? 'Wszystkie' : getStatusLabel(s)}
                </button>
              ))}
            </div>
            <div className="relative group">
              {/* ZMIANA: DODANE pl-10 ŻEBY TEKST NIE NACHODZIŁ NA LUPĘ */}
              <input 
                type="text" 
                placeholder="Szukaj po nazwisku..." 
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-64 shadow-inner transition-all"
              />
            </div>
          </div>

          {/* --- LISTA --- */}
          <div className="divide-y divide-slate-100">
            {loading ? (
               [...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse bg-slate-50/50" />)
            ) : issues
                .filter(i => filterStatus === 'all' || i.status === filterStatus)
                .map((issue) => (
              <div 
                key={issue.id}
                onClick={() => router.push(`/parent-issues/${issue.id}`)}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 hover:bg-indigo-50/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

                <div className="flex gap-6 items-start">
                  {/* ZMIANA: KROPKA ZALEŻNA OD PRIORITY (getPriorityDot) */}
                  <div className={`mt-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm shrink-0 ring-4 ${getPriorityDot(issue.priority)}`} />
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                        {issue.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${getPriorityStyle(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {issue.student ? (
                        <span className="font-bold text-slate-600">
                          {issue.student.firstName} {issue.student.lastName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Zgłoszenie ogólne</span>
                      )}
                      <span className="text-slate-300 font-black">/</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status: <span className="text-indigo-600">{getStatusLabel(issue.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-8 self-end md:self-center">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data wpłynięcia</p>
                      {/* ZMIANA: WYRAŹNIEJSZA DATA */}
                      <p className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                        {new Date(issue.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                   </div>
                   <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                      <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3"/></svg>
                   </div>
                </div>
              </div>
            ))}
          </div>
          {/* ... reszta kodu bez zmian ... */}
        </div>
      </div>
    </div>
  );
}