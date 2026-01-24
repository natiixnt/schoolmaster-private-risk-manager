'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';

// --- INTERFEJSY ---
interface Indicator { name: string; value: any; level: 'RED' | 'YELLOW' | 'GREEN'; calculatedAt: string; }
interface BehaviorEvent { id: string; type: 'INCIDENT' | 'PRAISE'; severity: 'LOW' | 'MEDIUM' | 'HIGH'; description: string; date: string; }
interface StudentRiskDetails {
  student: { id: string; firstName: string; lastName: string; class: { name: string; yearLevel: number }; };
  score: { score: number; level: 'RED' | 'YELLOW' | 'GREEN'; };
  indicators: Indicator[];
  recentBehaviorEvents: BehaviorEvent[];
}

export default function StudentRiskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<StudentRiskDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch<StudentRiskDetails>(`/risk/students/${params.id}`).then(res => {
      console.log(res)
      setData(res);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-[#5F5AFC] font-black animate-pulse uppercase tracking-[0.3em] text-xs">Ładowanie profilu...</div>
    </div>
  );
  if (!data) return <div className="p-20 text-center text-red-500 font-black uppercase tracking-widest">Błąd: Brak danych</div>;

  const { student, score, indicators, recentBehaviorEvents } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* --- HEADER: COMPACT & POWERFUL --- */}
      <div className="bg-[#1e293b] border-b-4 border-[#5F5AFC] py-8 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <button onClick={() => router.back()} className="text-white hover:text-[#5F5AFC] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="h-12 w-px bg-white/10 hidden md:block" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                {student.lastName}  <span className="text-[#5F5AFC]">{student.firstName}</span>
              </h1>
              <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Szczegółowa analiza ryzyka behawioralnego</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-4">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest px-2">Global Score</span>
                <span className={`text-2xl font-black ${score.level === 'RED' ? 'text-red-500' : 'text-emerald-500'}`}>{score.score}</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- GRID: 2 COLUMNS (MIĘSO + SIDEBAR) --- */}
      <div className="max-w-[1400px] mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEWA KOLUMNA (8/12) - WSKAŹNIKI I HISTORIA */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Wskaźniki w formie kafli */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indicators.map((ind, i) => (
              <div key={i} className="bg-white border-2 border-slate-100 p-6 rounded-[1.5rem] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ind.name.replace(/_/g, ' ')}</span>
                  <p className="text-3xl font-black text-[#1e293b] mt-1">
                    {ind.name === 'attendance_rate' ? `${Math.round(ind.value * 100)}%` : 
                     ind.name === 'negative_events_count' ? ind.value.negativeCount : 
                     Number(ind.value).toFixed(2)}
                  </p>
                </div>
                <div className={`h-1.5 w-full rounded-full mt-4 bg-slate-100 overflow-hidden`}>
                  <div 
                    className={`h-full ${ind.level === 'RED' ? 'bg-red-500' : 'bg-[#5F5AFC]'}`} 
                    style={{ width: ind.name === 'attendance_rate' ? `${ind.value * 100}%` : '60%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 2. Historia zdarzeń - GŁÓWNA LISTA */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-[#1e293b] uppercase tracking-widest">Dziennik zdarzeń i incydentów</h3>
              <span className="bg-[#5F5AFC] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Ostatnie {recentBehaviorEvents.length} wpisów</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {recentBehaviorEvents.map((event) => (
                <div key={event.id} className="p-8 hover:bg-[#5F5AFC]/5 transition-colors group">
                  <div className="flex items-start gap-6">
                    <div className={`mt-1 w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                      event.type === 'PRAISE' ? 'bg-emerald-500' : event.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black text-[#5F5AFC] uppercase tracking-[0.2em]">{event.type} // {event.severity}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-lg font-bold text-slate-800 leading-snug">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA (4/12) - SIDEBAR INFO */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Karta Informacyjna */}
          <div className="bg-white border-2 border-[#5F5AFC] rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Metryka Systemowa</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase">Klasa</span>
                         <span className="text-xs font-black text-[#1e293b] uppercase tracking-tighter">{student.class.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase">Poziom</span>
                         <span className="text-xs font-black text-[#1e293b] uppercase tracking-tighter">Year {student.class.yearLevel}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase">ID Studenta</span>
                         <span className="text-xs font-black text-[#1e293b] uppercase tracking-tighter">#{student.id.slice(0,8)}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Akcje Diagnostyczne</h4>
                   <div className="grid grid-cols-1 gap-2">
                      <button className="w-full bg-[#1e293b] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#5F5AFC] transition-all">Pobierz Raport PDF</button>
                      <button className="w-full bg-white border-2 border-[#5F5AFC] text-[#5F5AFC] py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all">Powiadom Rodziców</button>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                <svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor" /></svg>
             </div>
          </div>

          {/* Karta Trendu (AI Insight) */}
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2rem] p-8 text-white shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#5F5AFC] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Trend Insight</span>
             </div>
             <p className="text-sm font-bold italic leading-relaxed text-blue-100/80 mb-8">
               "Obserwujemy korelację między spadkiem frekwencji o 15%, a wzrostem incydentów typu 'INCIDENT_LOW'. Zalecana rozmowa profilaktyczna."
             </p>
             <div className="flex items-end gap-1 h-12">
                {[20, 40, 30, 70, 90, 60, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#5F5AFC]/20 rounded-t-sm relative group">
                    <div className="absolute bottom-0 w-full bg-[#5F5AFC] group-hover:bg-white transition-all" style={{ height: `${h}%` }} />
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}