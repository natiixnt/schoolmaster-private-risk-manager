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
  const [isShowed, changeIsShowed] = useState<boolean>(false);
 
  const [addedTitle, changeAddedTitle] = useState<string>("")
  const [addedName, changeAddedName] = useState<string>("")
  const [addedSurname, changeAddedSurname] = useState<string>("")
  const [addedPriority, changeAddedPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>("LOW")
  const [addedIssue, setAddedIssues] = useState<ParentIssue>({});

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await authFetch<ApiResponse>('/parent-issues');
        if (data?.items) setIssues(data.items);
        console.log(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  useEffect(() => {
    console.log(addedPriority)
  }, [addedPriority])

  const getStatusLabel = (s: string) => {
    const labels = { NEW: 'Nowe', IN_PROGRESS: 'W toku', RESOLVED: 'Zamknięte' };
    return labels[s as keyof typeof labels] || s;
  };



  // Funkcja do koloru kropki na podstawie priority
  const getPriorityDot = (p: string) => {
    switch (p) {
      case 'HIGH': return 'bg-[var(--sm-color-danger-500)] ring-red-100';
      case 'MEDIUM': return 'bg-[var(--sm-color-warning-500)] ring-amber-100';
      default: return 'bg-[var(--sm-color-success-500)] ring-emerald-100';
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--sm-color-background)] ${isShowed ? "" : "p-6 lg:p-12"}  schoolmaster-private`}>



      {/* --- NIEBIESKI PASEK SYSTEMOWY --- */}
      { /*<div className="bg-[var(--sm-color-background)] h-14 sticky w-full top-0 z-50 flex items-center px-6 lg:px-12 overflow-hidden shadow-md">
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
      </div> */}

      {/* --- DYNAMICZNY NAGŁÓWEK --- */}
      {/*
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
                <p className="text-xs font-black uppercase text-indigo-300 tracking-widest">Wszystkich</p>
                <p className="text-2xl font-black">{issues.length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-xs font-black uppercase text-red-400 tracking-widest">Krytyczne</p>
                <p className="text-2xl font-black">{issues.filter(i => i.priority === 'HIGH').length}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              
            
              <button className="bg-white hover:bg-indigo-50 text-indigo-900 w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
*/}




      {isShowed && <div className={`w-full h-full  fixed z-50 backdrop-blur-2xl  flex justify-center items-center`}>
        <div className='absolute z-55 w-1/4 h-1/2 rounded-[var(--sm-radius-lg)] bg-[var(--sm-color-surface-muted)] sm-shadow-2 pt-20 flex flex-col items-center '>

          <div className='absolute top-0 left-2'>
            <button
              onClick={() => changeIsShowed(false)}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-md font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-2xl active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button>
          </div>
          <div className='flex items-center flex-col mb-5 '>
            <label className='block w-auto text-md font-black uppercase text-xs tracking-[0.1em] text-[var(--sm-color-text-primary)] text-center lg:text-left lg:text-lg '>Wpisz Tytuł</label>
            <input onChange={(e) => (changeAddedTitle(e.target.value))} value={addedTitle} className='mb-2 w-3/4 p-5 border-2 rounded-[var(--sm-radius-md)] font-[var(--sm-font-weight-semibold)] lg:w-3/4' type="text" placeholder='Wpisz Tytuł ' required />

            <label className='block w-auto text-md font-black uppercase text-xs tracking-[0.1em] text-[var(--sm-color-text-primary)] text-center lg:text-left lg:text-lg '>Wpisz Imię</label>
            <input onChange={(e) => (changeAddedName(e.target.value))} value={addedName} className='mb-2 w-3/4 p-5 border-2 rounded-[var(--sm-radius-md)] font-[var(--sm-font-weight-semibold)] lg:w-3/4' type="text" placeholder='Wpisz Imię ' required />

            <label className='block w-auto   text-md font-black uppercase text-xs tracking-[0.1em] text-[var(--sm-color-text-primary)] lg:text-lg'>Wpisz Nazwisko</label>
            <input onChange={(e) => (changeAddedSurname(e.target.value))} value={addedSurname} type="text" className='mb-2 w-3/4 px-15 border-2 rounded-[var(--sm-radius-md)] font-[var(--sm-font-weight-semibold)] rounded-[var(--sm-radius-md)] lg:w-3/4 ' placeholder='Wpisz Nazwisko' required />

            <label className='block text-md w-1/2  font-black uppercase text-xs tracking-[0.1em] text-[var(--sm-color-text-primary)] lg:text-lg'>Ustal Priorytet</label>
            <select onChange={(e) => (changeAddedPriority(e.target.value))} value={addedPriority} className='border-2 p-5 w-1/2 uppercase cursor-pointer rounded-[var(--sm-radius-md)]' required >
              <option value='LOW' >Niski</option>
              <option value='MEDIUM' >Średni</option>
              <option value='HIGH'>Wysoki</option>
            </select>
          </div>
          <button onClick={() => {

             async function sendData() {

             }
             sendData()

          }} 
          className='flex mt-15 justify-center cursor-pointer w-auto lg:w-1/2  rounded-md bg-[var(--sm-color-primary-900)] rounded-[var(--sm-radius-md)] p-15 uppercase text-sm font-semibold text-white sm-shadow-1 hover:bg-[var(--sm-color-primary-900-90)]'>Dodaj</button>

        </div>
      </div>}

      <div className={`${isShowed ? "pointer-events-none" : "pointer-events-auto"}`}>
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
                    <circle r="105" cx="450" cy="400" className="text-white" />
                    <circle r="150" cx="900" cy="540" className="text-white" />
                    <circle r="120" cx="550" cy="50" className="text-white" />
                  </g>
                </svg>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--sm-color-on-primary)]">
                  Centrum Zgłoszeń
                </h1>
                <p className="text-[var(--sm-color-neutral-100)] text-lg max-w-xl font-[var(--sm-font-weight-medium)]">
                  Zarządzaj komunikacją i rozwiązuj problemy zgłoszone przez opiekunów.
                </p>
              </div>

              <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center">
                  <p className="text-xs font-black uppercase text-[var(--sm-color-info-400)] tracking-widest">Wszystkich</p>
                  <p className="text-2xl font-black text-[var(--sm-color-surface)]">{issues.length}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-xs font-black uppercase text-[var(--sm-color-negative-500)] tracking-widest">Krytyczne</p>
                  <p className="text-2xl font-black text-[var(--sm-color-surface)]">{issues.filter(i => i.priority === 'HIGH').length}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />


                <button className="bg-white hover:bg-indigo-50 text-[var(--sm-color-text-primary)] cursor-pointer w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-95" onClick={() => changeIsShowed(prev => !prev)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl p-6 lg:p-12 -mt-8 relative z-20">
          <div className="bg-white rounded-[2.5rem] sm-shadow-2 border border-slate-100 overflow-hidden">

            {/* --- FILTRY --- */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--sm-color-surface)] p-6 border-b border-slate-100">
              <div className="flex gap-2">
                {['all', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-5 py-2 rounded-xl text-xs cursor-pointer font-black uppercase tracking-tighter transition-all ${filterStatus === s
                        ? 'bg-[var(--sm-color-info-600)] text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    {s === 'all' ? 'Wszystkie' : getStatusLabel(s)}
                  </button>
                ))}
              </div>
              <div className="relative group">

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

                    <div className="flex gap-6 items-start">
                      <div className={`mt-1 w-3 h-3 rounded-[var(--sm-radius-full)] shrink-0 sm-shadow-2 ${getPriorityDot(issue.priority)}`} />

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none group-hover:text-[var(--sm-color-info-600)] transition-colors">
                            {issue.title}
                          </h3>

                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          {issue.student ? (
                            <span className="font-bold text-slate-600">
                              {issue.student.firstName} {issue.student.lastName}
                            </span>
                          ) : (
                            <span className="text-slate-400 ">Zgłoszenie ogólne</span>
                          )}
                          <span className="text-slate-300 font-black">/</span>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Status: <span className="text-[var(--sm-color-info-600)]">{getStatusLabel(issue.status)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-8 self-end md:self-center">
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data przesłania</p>
                        {/* ZMIANA: WYRAŹNIEJSZA DATA */}
                        <p className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                          {new Date(issue.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[var(--sm-color-info-600)] group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                        <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3" /></svg>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      </div>
    </div>


  );
}