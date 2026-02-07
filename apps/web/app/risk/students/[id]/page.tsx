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
    <div className="min-h-screen bg-[var(--sm-color-background)] flex items-center justify-center schoolmaster-private">
      <div className="flex flex-col items-center gap-4 text-[var(--sm-color-info-600)]">
        <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-[var(--sm-radius-full)] animate-spin"></div>
        <p className="font-[var(--sm-font-weight-bold)] uppercase text-sm tracking-[0.3em]">Trwa ładowanie profilu</p>
      </div>
    </div>
  );
  if (!data) return <div className="p-20 schoolmaster-private text-center flex flex-col justify-center items-center text-[var(--sm-color-danger-500)] font-[var(--sm-font-weight-bold)] uppercase tracking-widest">Błąd: Brak danych    <button 
              onClick={() => router.back()}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-md font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-2xl active:scale-95">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button></div>;

  const { student, score, indicators, recentBehaviorEvents } = data;

  return (
    <div className="min-h-screen bg-[var(--sm-color-background)] p-6 lg:p-12  schoolmaster-private">
      
      {/* --- HEADER: COMPACT & POWERFUL --- */}
      {/*<div className="bg-[var(--sm-text-primary)] border-b-4 border-[var(--sm-color-info-600)] py-8 px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <button onClick={() => router.back()} className="text-white hover:text-[var(--sm-color-info-600)] transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="h-12 w-px bg-white/10 hidden md:block" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-[var(--sm-font-weight-bold)] text-white tracking-tighter uppercase leading-none">
                {student.lastName}  <span className="text-[var(--sm-color-info-600)]">{student.firstName}</span>
              </h1>
              <p className="text-blue-400/60 text-[10px] font-[var(--sm-font-weight-bold)] uppercase tracking-[0.4em] mt-2">Szczegółowa analiza ryzyka behawioralnego</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-4">
                <span className="text-white/40 text-xs font-[var(--sm-font-weight-bold)] uppercase tracking-widest px-2">Global Score</span>
                <span className={`text-2xl font-[var(--sm-font-weight-bold)] ${score.level === 'RED' ? 'text-[var(--sm-color-danger-500)]' : 'text-[var(--sm-color-danger-500)]'}`}>{score.score}</span>
             </div>
          </div>
        </div>
      </div>*/}
       
      
      <div className="mx-auto max-w-7xl">
        <div>
          <button 
              onClick={() => router.back()}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-md font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-2xl active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button>
            </div>
        {/* --- HEADER: PROFESJONALNY GRANAT & NIEBIESKI --- */}
        <div className="sm-bg-hero rounded-[var(--sm-radius-lg)]  shadow-2xl shadow-[var(--sm-color-info-600)]/30 mb-6 border-b-8 border-white/10 relative overflow-hidden">
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
                 {student.firstName} {student.lastName}
                </h1>
                <p className="text-[var(--sm-color-neutral-100)] text-lg max-w-xl font-[var(--sm-font-weight-medium)]">
                 Zarządzanie rejestrem uczniów klasy
                </p>
              </div>
          
              <div>
          
              
            </div>
            </div>
          </div>
      {/* --- GRID: 2 COLUMNS (MIĘSO + SIDEBAR) --- */}
      <div className="max-w-[1400px] mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEWA KOLUMNA (8/12) - WSKAŹNIKI I HISTORIA */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Wskaźniki w formie kafli */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
              <div  className="bg-white border-2 border-slate-100 p-6 rounded-[1.5rem] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-[var(--sm-font-weight-bold)] text-slate-400 uppercase tracking-widest">Zmiana średniej ocen</span>
                  <p className="text-3xl font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] mt-1">
                    {Number(indicators[0].value).toFixed(2) }
                  </p>
                </div>
                
              </div>

              <div  className="bg-white border-2 border-slate-100 p-6 rounded-[1.5rem] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-[var(--sm-font-weight-bold)] text-slate-400 uppercase tracking-widest">Frekwencja</span>
                  <p className="text-3xl font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] mt-1">
                    {Number(indicators[1].value).toFixed(2) }
                  </p>
                </div>
                <div className={`h-1.5 w-full rounded-[var(--sm-radius-full)] mt-4 bg-slate-100 overflow-hidden`}>
                  <div 
                    className={`h-full ${indicators[1].level === 'RED' ? 'bg-[var(--sm-color-danger-500)]' : 'bg-[var(--sm-color-info-600)]'}`} 
                    style={{width: `${Number(indicators[1].value) * 100}%`}}
                  />
                </div>
              </div>

              <div  className="bg-white border-2 border-slate-100 p-6 rounded-[var(--sm-radius-lg)] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-[var(--sm-font-weight-bold)] text-slate-400 uppercase tracking-widest">Liczba negatywnych zdarzeń</span>
                  <p className="text-3xl font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] mt-1">
                    {indicators[2].value.negativeCount }
                  </p>
                </div>
              </div>
            
          </div>

          {/* 2. Historia zdarzeń - GŁÓWNA LISTA */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-x font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] uppercase tracking-widest">Dziennik zdarzeń i incydentów</h3>
              <span className="bg-[var(--sm-color-info-600)] text-white text-xs font-[var(--sm-font-weight-bold)] px-3 py-1 rounded-[var(--sm-radius-full)] uppercase">Ostatnie {recentBehaviorEvents.length} wpisów</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {recentBehaviorEvents.map((event) => (
                <div key={event.id} className="p-8 hover:bg-[var(--sm-color-info-600)]/5 transition-colors group">
                  <div className="flex items-start gap-6">
                    <div className={`mt-1 w-3 h-3 rounded-[var(--sm-radius-full)] shrink-0 sm-shadow-2 ${
                      event.type === 'PRAISE' ? 'bg-[var(--sm-color-success-500)]' : event.severity === 'HIGH' ? 'bg-[var(--sm-color-danger-500)]' : 'bg-[var(--sm-color-warning-500)]'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-x font-[var(--sm-font-weight-bold)] text-[var(--sm-color-info-600)] uppercase tracking-[0.2em]">{event.type == 'PRAISE' ? "Pochwała" : "Problem"} // {event.severity == 'HIGH' ? "Wysoki": event.severity == 'MEDIUM' ? "Sredni" : 'Niski'}</span>
                         <span className="text-x font-[var(--sm-font-weight-semibold)] text-slate-400 uppercase">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-lg font-[var(--sm-font-weight-semibold)] text-[var(--sm-color-text-primary)] leading-snug">{event.description}</p>
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
          <div className="bg-white border-2 border-[var(--sm-color-info-600)] rounded-[var(--sm-radius-lg)] p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-[var(--sm-font-weight-semibold)] text-slate-500 uppercase">Klasa</span>
                         <span className="text-x font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] uppercase tracking-tighter">{student.class.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-[var(--sm-font-weight-semibold)] text-slate-500 uppercase">Poziom</span>
                         <span className="text-x font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] uppercase tracking-tighter">Klasa {student.class.yearLevel}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs font-[var(--sm-font-weight-semibold)] text-slate-500 uppercase">ID Studenta</span>
                         <span className="text-x font-[var(--sm-font-weight-bold)] text-[var(--sm-text-primary)] uppercase tracking-tighter">#{student.id.slice(0,8)}</span>
                      </div>

                      <div className='flex justify-between border-b border-slate-50 pb-2'>
                        <span className='text-xs font-[var(--sm-font-weight-semibold)] text-slate-500 uppercase'>Globalny Wynik</span>
                        <span className={`text-x font-[var(--sm-font-weight-bold)]  uppercase tracking-tighter ${score.level === 'RED' ? "text-[var(--sm-color-danger-500)]" : score.level === 'YELLOW' ? "text-[var(--sm-color-warning-500)]" : "text-[var(--sm-color-danger-500)]" }`} >{score.score}</span>

                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <h4 className="text-x font-[var(--sm-font-weight-bold)] text-slate-400 uppercase tracking-widest mb-4">Akcje Diagnostyczne</h4>
                   <div className="grid grid-cols-1 gap-2">
                      <button className="w-full bg-white cursor-pointer border-2 border-[var(--sm-color-info-600)] text-[var(--sm-color-info-600)] py-4 rounded-[var(--sm-radius-sm)] text-sm font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] hover:bg-blue-50 transition-all">Pobierz Raport PDF</button>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}