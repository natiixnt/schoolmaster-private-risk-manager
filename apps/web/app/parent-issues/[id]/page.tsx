'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';
import Link from 'next/link';
import LogoWhite from '../../components/LogoWhite';
// --- INTERFEJSY (Logika bez zmian) ---
interface Author { id: string; name: string; }
interface Comment { id: string; comment: string; createdAt: string; author: Author; }
interface IssueDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  closedAt: string | null;
  student: { firstName: string; lastName: string; } | null;
  comments: Comment[];
}

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        const data = await authFetch<IssueDetails>(`/parent-issues/${params.id}`);
        setIssue(data);
        console.log(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchIssueDetails();
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pl-PL', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center schoolmaster-private">
      <div className="text-[var(--sm-color-info-600)] font-black animate-pulse uppercase tracking-widest text-xs">Wczytywanie...</div>
    </div>
  );

  if (error || !issue) return <div className=" schoolmaster-private p-20 text-center text-red-500 font-bold">Błąd: {error || 'Nie znaleziono zgłoszenia'}</div>;

  return (
    <div className="min-h-screen schoolmaster-private bg-[var(--sm-color-background)] text-slate-900 font-sans pb-20">
      
      {/* --- HEADER: DEEP NAVY (z obrazka) --- */}
      {/*<div className="bg-[#1e293b] pt-16 pb-32 px-8 lg:px-16 relative overflow-hidden">
        <div className="mx-auto max-w-7xl relative z-10">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[11px] font-black text-blue-400 uppercase tracking-widest mb-10 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
            Powrót do centrum zgłoszeń
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#EF4444] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg">HIGH PRIORITY</span>
                <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest">{issue.category}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
                {issue.title}
              </h1>
            </div>
            
            <div className="flex gap-4">
               <button className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Edytuj</button>
               <button className="px-8 py-3 bg-white text-[#1e293b] rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">Zmień Status</button>
            </div>
          </div>
        </div>
      </div>*/}
 <div className="mx-auto max-w-7xl">
          <div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-[var(--sm-radius-sm)] cursor-pointer bg-white border border-slate-200 text-md font-[var(--sm-font-weight-bold)] text-[var(--sm-color-neutral-500)] hover:text-[var(--sm-color-info-600)] hover:border-blue-200 uppercase tracking-widest flex items-center gap-2 transition-all hover:sm-shadow-2 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path d="M15 19l-7-7 7-7" /></svg>
              Wróć
            </button>
          </div>
          {/* --- HEADER: PROFESJONALNY GRANAT & NIEBIESKI --- */}
          <div className="sm-bg-hero rounded-[var(--sm-radius-lg)]  sm-shadow-2 shadow-[var(--sm-color-info-600)]/30 mb-6 border-b-8 border-white/10 relative overflow-hidden">
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
                  {issue.title}
                </h1>
                <p className="text-[var(--sm-color-neutral-100)] text-lg max-w-xl font-[var(--sm-font-weight-medium)]">
                  {issue.category}
                </p>
              </div>

             <LogoWhite className="w-85 absolute h-full  top-0 right-0 left-100% bottom-15 z-50 hidden pointer-events-none md:block"/>
            </div>
          </div>
        </div>
    
      
      <div className="mx-auto max-w-7xl px-8 lg:px-16  relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
         
          <div className="lg:col-span-8 space-y-10">
            
           
        {/*     <div className="bg-white rounded-[2rem] p-10 shadow-xl border-2 border-transparent">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-1.5 h-6 bg-[var(--sm-color-info-600)] rounded-full" />
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Opis zgłoszenia</h3>
               </div>
               <p className="text-xl text-slate-700 leading-relaxed font-bold">
                 {issue.description}
               </p>
            </div>
    */}
           
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Historia komunikacji ({issue.comments.length})</h3>
               
               <div className="space-y-6">
                  {issue.comments.map((comment) => (
                    <div key={comment.id}  className="bg-[var(--sm-color-surface)] flex w-full border-3 border-[var(--sm-color-info-600)] rounded-[var(--sm-radius-lg)] p-8 sm-shadow-2 hover:shadow-md ">
                      <div className='bg-[var(--sm-color-neutral-800)] rounded-[var(--sm-radius-md)] text-center text-[var(--sm-color-on-primary)] flex items-center justify-center font-[var(--sm-font-weight-bold)] w-12 h-12 p-2'>
                        <span>{comment.author.name.slice(0,2).toUpperCase()}</span>
                      </div>
                      <div className='ml-2'>
                        <h1 className='text-xl text-[var(--sm-color-text-primary)] font-[var(--sm-font-weight-bold)]'>{comment.comment}</h1>
                        <p className='text-lg'>{formatDate(comment.createdAt)}</p>

                      </div>
                    </div>
                  ))}

                  
                  <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[var(--sm-color-info-600)] rounded-full flex items-center justify-center text-xs font-black text-white">
                          AD
                        </div>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Wyślij oficjalną odpowiedź...</p>
                    </div>
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[120px] focus:ring-2 focus:ring-[var(--sm-color-info-600)] transition-all"
                        placeholder="Treść odpowiedzi..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="bg-[var(--sm-color-info-600)] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                            Wyślij Odpowiedź
                        </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
   
          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 relative overflow-hidden">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Dane sytuacji</h3>
              
              <div className="space-y-12">
                {/* Status Section */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{issue.status}</span>
                  </div>
                </div>

                {/* Student Section */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Student</span>
                  <div className="text-right">
                    <p className="text-sm font-black text-[var(--sm-color-info-600)] uppercase tracking-tighter">
                       {issue.student ? `${issue.student.firstName} ${issue.student.lastName}` : 'Zgłoszenie Ogólne'}
                    </p>
                    
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <span>Klasa</span>
                  <div>
                    <p>{issue.student?.class.name}</p>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-6 pt-10 border-t border-slate-50">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Data Rejestracji</p>
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-[var(--sm-color-info-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5"/></svg>
                        <span className="text-xs font-black text-slate-700">{formatDate(issue.createdAt)}</span>
                    </div>
                  </div>

                  {issue.closedAt && (
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-[9px] font-black text-emerald-400 uppercase mb-2 tracking-widest">Data Zamknięcia</p>
                        <div className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                            <span className="text-xs font-black text-emerald-700">{formatDate(issue.closedAt)}</span>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            
            
          </div>

        </div>
      </div>
    </div>
  );
}