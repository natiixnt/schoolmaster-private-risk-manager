'use client';

import { useState, useEffect } from 'react';
import { authFetch } from 'apps/web/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// --- INTERFEJSY (Logika bez zmian) ---
interface RiskIndicator {
  name: string;
  value: any;
  level: 'GREEN' | 'YELLOW' | 'RED';
}

interface RiskStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  class: { id: string; name: string };
  score: number;
  level: 'GREEN' | 'YELLOW' | 'RED';
  indicators: RiskIndicator[];
}

export default function RiskStudentsCompactPage() {
  const [students, setStudents] = useState<RiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    authFetch<RiskStudent[]>('/risk/students').then(data => {
      console.log(data)
      setStudents(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center schoolmaster-private">
      <div className="flex flex-col items-center gap-4 text-[#5F5AFC]">
        <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black uppercase text-[10px] tracking-[0.3em]">Trwa analiza ryzyka...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans schoolmaster-private">
      
      <div className="mx-auto max-w-7xl">
        <div>
          <button 
              onClick={() => router.back()}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-2xl active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button>
            </div>
        {/* --- HEADER: PROFESJONALNY GRANAT & NIEBIESKI --- */}
        <div className="sm-bg-hero rounded-[var(--sm-radius-lg)]  shadow-2xl shadow-[var(--sm-color-info-600)]/30 border-b-8 border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 sm-bg-hero "></div>

            <div className="relative z-10 px-8 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute top-0 left-0 md:translate-x-5 md:translate-y-0 w-full h-full opacity-10 overflow-hidden pointer-events-none">
           <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="currentColor" strokeWidth="40">   
              <circle r="105" cx="450" cy="400" className="text-white"/>
              <circle r="150" cx="900" cy="540" className="text-white"/>
              <circle r="120" cx="550" cy="50" className="text-white"/>
              </g>
            </svg>
        </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--sm-color-on-primary)]">
                 Skład osobowy
                </h1>
                <p className="text-[var(--sm-color-neutral-100)] text-lg max-w-xl font-[var(--sm-font-weight-medium)]">
                 Zarządzanie rejestrem uczniów klasy
                </p>
              </div>
              <div>
              <input type="text" 
              placeholder='Wyszukaj ucznia'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='block bg-[var(--sm-color-surface)]  rounded-[var(--sm-radius-sm)] border-0 py-2.5 px-3 text-[var(--sm-color-text-primary)] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all'
              />
              
            </div>
            </div>
          </div>
         

        {/* --- TABELA: CLEAN PROFESSIONAL --- */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Uczeń i Oddział</th>
                  <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Analiza Wskaźników</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Raport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr key={s.studentId} className="group hover:bg-[#5F5AFC]/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all ${
                          s.level === 'RED' ? 'bg-red-50 border-red-100 text-[var(--sm-color-danger-500)]' : 'bg-blue-50 border-blue-100 text-[#5F5AFC]'
                        }`}>
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base tracking-tight">{s.lastName} {s.firstName}</div>
                          <div className="text-[10px] font-black text-[#5F5AFC] uppercase tracking-widest mt-0.5">Oddział {s.class.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center">
                        <span className={`text-xl font-black ${s.level === 'RED' ? 'text-[var(--sm-color-danger-500)]' : 'text-slate-700'}`}>
                          {s.score}
                        </span>
                        <div className="w-12 h-1 bg-slate-100 rounded-[var(--sm-radius-full)] mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${s.level === 'RED' ? 'bg-red-500' : 'bg-[#5F5AFC]'}`}
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-sm">
                      <div className="flex gap-4">
                        
                          <div  className="flex flex-col">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter mb-1">Zmiana średniej ocen</span>
                            <div className={`text-xs font-bold ${s.indicators[0].level === 'RED' ? 'text-[var(--sm-color-danger-500)]' : 'text-slate-600'}`}>
                            {Number(s.indicators[0].value).toFixed(1)}
                            </div>
                          </div>

                          <div  className="flex flex-col">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter mb-1">Frekwencja</span>
                            <div className={`text-xs font-bold ${s.indicators[1].level === 'RED' ? 'text-[var(--sm-color-danger-500)]' : 'text-slate-600'}`}>
                              {`${Math.round(s.indicators[1].value * 100)}%` }
                            </div>
                          </div>

                          <div  className="flex flex-col">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter mb-1">Liczba negatywnych zdarzeń</span>
                            <div className={`text-xs font-bold ${s.indicators[2].level === 'RED' ? 'text-[var(--sm-color-danger-500)]' : 'text-slate-600'}`}>
                              {s.indicators[2].value.negativeCount }
                            </div>
                          </div>
                        
                      </div>
                    </td>

                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/risk/students/${s.studentId}`}
                        className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#475569] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#5F5AFC] hover:text-white transition-all active:scale-95"
                      >
                        Detale
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FOOTER: MINIMAL INFO --- */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-4 gap-6">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Krytyczne: {students.filter(s => s.level === 'RED').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5F5AFC]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">W normie: {students.filter(s => s.level === 'GREEN').length}</span>
              </div>
           </div>
           
        </div>

      </div>
    </div>
  );
}