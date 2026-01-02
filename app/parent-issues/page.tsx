'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ParentIssue {
  id: string;
  studentName: string;
  parentName: string;
  title: string;
  category: string;
  priority: 'Wysoki' | 'Średni' | 'Niski';
  status: 'Nowe' | 'W toku' | 'Zamknięte';
  createdAt: string;
}

const mockIssues: ParentIssue[] = [
        { id: '101', studentName: 'Kapi Kapi', parentName: 'Marek Kapi', title: 'Agresywne zachowanie na przerwie', category: 'Behawioralne', priority: 'Wysoki', status: 'Nowe', createdAt: '2h temu' },
        { id: '102', studentName: 'Natiix Natiix', parentName: 'Anna Natiix', title: 'Brak kontaktu z rodzicem', category: 'Komunikacja', priority: 'Średni', status: 'W toku', createdAt: '5h temu' },
        { id: '103', studentName: 'Albercik Albercik', parentName: 'Jan Albercik', title: 'Nagłe pogorszenie ocen z matematyki', category: 'Nauka', priority: 'Niski', status: 'Nowe', createdAt: '1d temu' },
        { id: '104', studentName: 'Rofrol Rofrol', parentName: 'Ewa Rofrol', title: 'Opuszczanie Lekcji - prośba o wyjaśnienie', category: 'Obecność', priority: 'Wysoki', status: 'W toku', createdAt: '2d temu' },
      ];

      export async function getIssuesById(id: string): Promise<ParentIssue | undefined> {
        await new Promise(r => setTimeout(r, 800));
        return mockIssues.find(issue => issue.id === id)
        
      }


export default function ParentIssuesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<ParentIssue[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      // Symulacja API
      await new Promise(r => setTimeout(r, 800));
      
      
      
      setIssues(mockIssues);
      setLoading(false);
    };
    fetchIssues();
  }, []);

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'Wysoki': return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'Średni': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      default: return 'bg-blue-50 text-blue-700 ring-blue-600/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-indigo-900 px-8 py-10 shadow-xl sm:py-14">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="currentColor" strokeWidth="100">
                <circle r="234" cx="196" cy="23" className="text-white" />
                <circle r="234" cx="790" cy="491" className="text-white" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Centrum Zgłoszeń</h1>
              <p className="mt-2 text-indigo-100 max-w-lg text-lg">
                Zarządzaj komunikacją z rodzicami i rozwiązuj bieżące problemy uczniów w jednym miejscu.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-400 transition-all active:scale-95 border border-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Nowe zgłoszenie wewnętrzne
            </button>
          </div>
        </div>


        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex gap-2">
              {['Wszystkie', 'Nowe', 'W toku', 'Zamknięte'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s === 'Wszystkie' ? 'all' : s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    (filterStatus === 'all' && s === 'Wszystkie') || filterStatus === s
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Szukaj po nazwisku..." 
                className="w-full bg-gray-50 border-none rounded-xl py-2 pl-4 text-sm focus:ring-2 focus:ring-indigo-500"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)
          ) : (
            issues
              .filter(i => filterStatus === 'all' || i.status === filterStatus)
              .map((issue) => (
                <div 
                  key={issue.id}
                  onClick={() => router.push(`/parent-issues/${issue.id}`)}
                  className="group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 text-left">
                      <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${issue.status === 'Nowe' ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{issue.title}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ring-1 ring-inset ${getPriorityStyle(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{issue.studentName}</span>
                          <span>•</span>
                          <span>Rodzic: {issue.parentName}</span>
                          <span className="hidden md:inline">•</span>
                          <span className="hidden md:inline bg-gray-100 px-2 py-0.5 rounded text-xs">{issue.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wysłano</p>
                        <p className="text-sm font-medium text-gray-700">{issue.createdAt}</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                         </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

      </div>
    </div>
  );
}
