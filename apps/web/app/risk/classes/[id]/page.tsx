'use client';
//pattern
//Wieksza czcionka - button
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';

interface ApiStudent {
  id: string;
  firstName: string;
  lastName: string;
  externalId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function ClassDetailsList() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // --- LOGIKA API (NIEZMIENIONA) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await authFetch<ApiStudent[]>(`/classes/${params.id}/students`);
        if (data && Array.isArray(data)) setStudents(data);
        console.log(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen schoolmaster-private bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--sm-color-info-600)] border-t-transparent rounded-[var(--sm-radius-full)] animate-spin"></div>
        <div className="text-[var(--sm-color-info-700)] font-[var(--sm-font-weight-bold)] tracking-widest uppercase text-xs">Synchronizacja bazy danych...</div>
      </div>
    </div>
  );

  return (
    <div className=" schoolmaster-private min-h-screen bg-slate-50 text-[var( --sm-color-text-primary)] font-sans">

      {/* --- SYSTEM TOP BAR (BRAND BLUE) --- */}
      {/*
      <div className="bg-[#1e293b] h-16 w-full sticky top-0 z-50 flex items-center px-6 lg:px-12 overflow-hidden shadow-lg border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-[#4A45E5] opacity-90"></div>
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-white font-[var(--sm-font-weight-bold)] tracking-tighter text-xl uppercase">Schoolmaster</span>
          <div className="h-6 w-px bg-white/20" />
          
        </div>
      </div>*/}

      <div className="p-6 lg:p-12">
        <div className="mx-auto max-w-6xl space-y-8">
           <div>
          <button 
              onClick={() => router.back()}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-2xl active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button>
            </div>

          {/* Breadcrumbs & Navigation */}
          {/*
          <nav className="flex items-center justify-between animate-[fadeInUp_0.4s]">
            <div className="flex items-center gap-3 text-[11px] font-bold text-[var(--sm-color-neutral-500)] uppercase tracking-widest">
              <Link href="/risk/classes" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Klasy
              </Link>
              <svg className="h-3 w-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>
              <span className="text-indigo-900 bg-blue-50 px-2 py-0.5 rounded">Lista uczniów</span>
            </div>
            
          </nav>
          */
          }
         
          {/* Header Card (Mocniejszy wizualnie) */}
          {/*
          <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-3 h-full bg-[#5F5AFC]"></div>
            <div>
              
            </div>
            
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Szukaj po nazwisku..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 w-full md:w-80 transition-all outline-none placeholder:text-slate-300 shadow-inner"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-blue-500">
              </div>
            </div>
          </div>
*/}
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
         
          {/* Students Table Card (Biała karta, niebieskie akcenty) */}
          <div className="bg-white border border-b border-[var(--sm-color-info-600)]/10 rounded-[var(--sm-radius-lg)] sm-shadow-2 overflow-hidden animate-[fadeInUp_0.6s]">
            <div className="overflow-x-auto">
              <table className="w-full text-left  border-collapse">
                <thead>
                  <tr className="bg-blue-50/30 text-sm  text-[var(--sm-color-neutral-500)]">
                    <th className="px-10 py-5 font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] opacity-80">Nazwisko i imię</th>
                    <th className="px-8 py-5 font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] opacity-80">ID Zewnętrzne</th>
                    <th className="px-8 py-5 font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] opacity-80">Status</th>
                    <th className="px-10 py-5 font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] opacity-80 text-right">Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="group hover:bg-blue-50/50 transition-all duration-300">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          {/* Avatar z numerem lub inicjałami w brand blue */}
                          <div className="w-12 h-12 rounded-[var(--sm-radius-md)] bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-[var(--sm-font-weight-bold)] text-[var(--sm-color-info-600)]  group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <span className="text-lg font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] uppercase tracking-tight  transition-colors">
                            {student.lastName} {student.firstName}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs  font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {student.externalId || 'BRAK'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-[var(--sm-radius-full)] text-xs font-[var(--sm-font-weight-bold)] uppercase tracking-widest border-2 ${student.status === 'ACTIVE'
                            ? 'bg-[var(--sm-color-success-100)] border-[var(--sm-color-success-200)] text-[var(--sm-color-success-500)]'
                            : 'bg-slate-50 border-slate-200 text-[var(--sm-color-neutral-500)]'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-[var(--sm-radius-full)] mr-2 ${student.status === 'ACTIVE' ? 'bg-[var(--sm-color-success-500)] animate-pulse' : 'bg-slate-400'}`}></span>
                          {student.status === 'ACTIVE' ? 'Aktywny' : 'Nieaktywny'}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Link
                          href={`/risk/students/${student.id}`}
                          
                        >
                        <button className="flex items-center text-center justify-center w-full cursor-pointer  py-10 rounded-[var(--sm-radius-sm)] bg-[var(--sm-color-primary-900)] text-white text-md font-[var(--sm-font-weight-bold)] hover:bg-[var(--sm-color-primary-900-90)] hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"> 
                        
                         <span className='mr-3'>Karta ucznia</span> 
                          <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>
                        
                        </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="py-32 text-center bg-slate-50/50">
                
                <p className="text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] uppercase tracking-[0.3em]">Brak wyników wyszukiwania</p>
              </div>
            )}
          </div>

          {/* Footer Info (Mocniejszy błękit) */}
          <div className="px-4 py-3   flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] uppercase tracking-[0.2em]">

            <span className="text-[var(--sm-color-neutral-600)]">Zarejestrowano {filteredStudents.length} uczniów klasy</span>
          </div>
        </div>
      </div>
    </div>
  );
}