'use client';
//pattern

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';

// 1. Definicja typu danych (zgodna z API)
interface SchoolClass {
  id: string;
  name: string;
  level: string;
  yearLevel: number;
  studentCount: number;
  riskRed: number;
  riskYellow: number;
  riskGreen: number;
  homeroomTeacherId: string | null;
  lastCalculatedAt: string;
}

export default function ClassesListPage() {
  // 2. State Management (Logika przywrócona)
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  // 3. Effect: Pobieranie danych z API
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prawdziwe zapytanie do API
        const data = await authFetch<SchoolClass[]>('/classes');
        
        console.log('Pobrane dane z API:', data);
        setClasses(Array.isArray(data) ? data : []);

      } catch (err: any) {
        console.error('Błąd pobierania:', err);
        setError(err.message);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [router]);

  // 4. Logika filtrowania i wyszukiwania
  const searchedClasses = classes.filter(cls => 
    cls.name === "" ? cls : cls.name.toLowerCase().includes(query.toLowerCase()) 
  );

  const filteredClasses = filterLevel === 'all' 
    ? searchedClasses 
    : searchedClasses.filter(c => c.yearLevel === Number(filterLevel));

  // Helpery wizualne
  const calculateWidth = (value: number, total: number) => {
    if (!total || total === 0) return '0%';
    return `${(value / total) * 100}%`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Brak danych';
    return new Date(dateString).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    // Tło strony: lekki błękit (slate-50) dla kontrastu kart
    <div className="min-h-screen bg-[var(--sm-color-background)] text-[var(--sm-color-text-primary)] font-sans p-4 lg:p-8 schoolmaster-private">
      
      
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* --- HERO SECTION: CIEMNY GRANAT --- */}
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
                        Zarządzanie Klasami
                    </h1>
                    <p className="text-[var(--sm-color-neutral-100)] text-lg max-w-xl font-medium">
                        Monitoruj poziomy ryzyka i interweniuj tam, gdzie jest to potrzebne.
                    </p>
                </div>
                
                <button className=" cursor-pointer  w-1/3 md:w-auto md:flex transition-all items-center gap-2 bg-white text-[var(--sm-color-text-primary)] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 duration-300 transform hover:-translate-y-1 shadow-2xl active:scale-95">
                    
                    Importuj z  e-dziennika
                </button>
            </div>
        </div>

        {/* --- FILTRY I WYSZUKIWANIE --- */}
        <div className="bg-white p-3 rounded-[--sm-radius-md] shadow-sm border border-blue-100 flex flex-col md:flex-row gap-4 items-center">
            {/* Filtr Poziomu */}
            <div className="flex-1 w-full">
                <label className="block text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-info-600)] uppercase tracking-wider mb-1 px-3">Poziom</label>
                <div className="relative">
                    <select 
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="w-full bg-slate-50 text-slate-700 font-[var(--sm-font-weight-bold)] rounded-[var(--sm-radius-sm)] py-2.5 px-4 border-none focus:ring-2 focus:ring-[var(--sm-color-info-600)] cursor-pointer appearance-none"
                    >
                        <option value="all">Wszystkie oddziały</option>
                        <option value="6">Klasy 6</option>
                        <option value="7">Klasy 7</option>
                        <option value="8">Klasy 8</option>
                        <option value="1-LO">Liceum (1 LO)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--sm-color-info-600)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

             {/* Filtr Roku (Statyczny na razie, ale gotowy) */}
             <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-[var(--sm-color-info-600)]  uppercase tracking-wider mb-1 px-3">Rok Szkolny</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 text-slate-700 font-[var(--sm-font-weight-bold)] rounded-[var(--sm-radius-sm)] py-2.5 px-4 border-none focus:ring-2 focus:ring-[var(--sm-color-info-600)] cursor-pointer appearance-none">
                        <option>2023/2024</option>
                        <option>2024/2025</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--sm-color-info-600)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* Szukajka */}
            <div className="flex-[1.5] w-full">
                <label className="block text-xs font-bold text-[var(--sm-color-info-600)]  uppercase tracking-wider mb-1 px-3">Wyszukaj</label>
                <div className="relative">
                    <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Szukaj klasy..." 
                    className="w-full bg-slate-50 text-[var(--sm-color-text-primary)] font-semibold rounded-[var(--sm-radius-sm)] py-2.5 pl-10 pr-4 border-none focus:ring-1 focus:ring-inset focus:ring-[var(--sm-color-info-600)] placeholder:text-slate-400" 
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-400">
                    </div>
                </div>
            </div>
        </div>

        {/* --- OBSŁUGA BŁĘDÓW API --- */}
        {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium flex items-center gap-3">
                 <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Wystąpił błąd podczas pobierania danych: {error}
            </div>
        )}

        {/* --- GRID KART --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="h-80 bg-white rounded-3xl border border-blue-50 sm-shadow-2" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            
            {filteredClasses.length === 0 && !error ? (
                <div className="col-span-full py-12 text-center">
                    <p className="text-slate-500 font-medium">Brak klas spełniających kryteria wyszukiwania.</p>
                </div>
            ) : null}

            {filteredClasses.map((cls) => (
              <div key={cls.id} className="group relative bg-white rounded-3xl p-6 sm-shadow-1 border-2 border-slate-100 hover:border-[var(--sm-color-info-600)] hover:sm-shadow-2  transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                
                {/* Górny pasek dekoracyjny */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--sm-color-info-600)]"></div>

                {/* HEADER KARTY */}
                <div className="flex justify-between items-start mb-6 mt-2">
                    <div className="flex items-center gap-4">
                        {/* Avatar Klasy - MOCNY NIEBIESKI */}
                        <div className="h-16 w-16 rounded-[var(--sm-radius-lg)] bg-[var(--sm-color-info-600)] text-white flex items-center justify-center shadow-lg shadow-[var(--sm-color-info-600)]/30">
                            <span className="font-black text-2xl tracking-tighter">{cls.name}</span>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-[var(--sm-color-text-primary)] text-xl">Klasa {cls.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-[var(--sm-font-weight-semibold)] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                    {cls.studentCount} Uczniów
                                </span>
                            </div>
                        </div>
                    </div>
                    
                   
                </div>

                {/* INFO O WYCHOWAWCY */}
                <div className="flex gap-3 mb-6">
                     <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border ${cls.homeroomTeacherId ? 'bg-blue-50/50 border-blue-100 text-[var(--sm-color-info-600)]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                        <span className="text-[11px] font-bold uppercase truncate">{cls.homeroomTeacherId ? 'Wychowawca' : 'Brak wych.'}</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--sm-radius-sm)] bg-slate-50 border border-slate-100 text-slate-500">
                        <span className="text-xs font-bold uppercase whitespace-nowrap">Klasa: {cls.yearLevel}</span>
                     </div>
                </div>

                {/* RYZYKO */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-end px-1">
                        <span className="text-xs font-bold text-slate-500 uppercase">Analiza ryzyka</span>
                        <span className="text-xs font-bold text-slate-400">Suma: {(cls.riskRed || 0) + (cls.riskYellow || 0) + (cls.riskGreen || 0)}</span>
                    </div>
                    
                    {/* Pasek Postępu */}
                    <div className="h-4 w-full flex overflow-hidden rounded-lg bg-slate-100 ring-2 ring-slate-50">
                        <div style={{ width: calculateWidth(cls.riskRed, cls.studentCount) }} className="bg-red-500 relative group/bar"><div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity"/></div>
                        <div style={{ width: calculateWidth(cls.riskYellow, cls.studentCount) }} className="bg-amber-400" />
                        <div style={{ width: calculateWidth(cls.riskGreen, cls.studentCount) }} className="bg-emerald-400" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 rounded-lg bg-red-50 text-[var(--sm-color-danger-500)]">
                            <div className="font-black text-xl leading-none">{cls.riskRed || 0}</div>
                            <div className="text-xs font-bold opacity-60 mt-1">HIGH</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-amber-50 text-[var(--sm-color-warning-500)]">
                             <div className="font-black text-xl leading-none">{cls.riskYellow || 0}</div>
                             <div className="text-xs font-bold opacity-60 mt-1">MED</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-emerald-50 text-[var(--sm-color-success-500)]">
                             <div className="font-black text-xl leading-none">{cls.riskGreen || 0}</div>
                             <div className="text-xs font-bold opacity-60 mt-1">LOW</div>
                        </div>
                    </div>
                </div>

                {/* BUTTON FOOTER */}
                
                <Link href={`/risk/classes/${cls.id}`} className="flex items-center justify-center w-full py-3.5 rounded-[var(--sm-radius-sm)] bg-[var(--sm-color-primary-900)] text-white text-sm font-[var(--sm-font-weight-semibold)] hover:bg-[var(--sm-color-primary-900-90)] hover:shadow-lg hover:shadow-[var(--sm-color-info-600)]/30 transition-all duration-300">
                    Zobacz szczegóły
                </Link>

            

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}