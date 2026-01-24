'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from 'apps/web/lib/auth';
import Link from 'next/link';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-[#5F5AFC] font-black animate-pulse uppercase tracking-widest text-xs">Wczytywanie...</div>
    </div>
  );

  if (error || !issue) return <div className="p-20 text-center text-red-500 font-bold">Błąd: {error || 'Nie znaleziono zgłoszenia'}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      
      {/* --- HEADER: DEEP NAVY (z obrazka) --- */}
      <div className="bg-[#1e293b] pt-16 pb-32 px-8 lg:px-16 relative overflow-hidden">
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
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="mx-auto max-w-7xl px-8 lg:px-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: DESCRIPTION & COMMENTS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Main Description Card */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border-2 border-transparent">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-1.5 h-6 bg-[#5F5AFC] rounded-full" />
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Opis zgłoszenia</h3>
               </div>
               <p className="text-xl text-slate-700 leading-relaxed font-bold">
                 {issue.description}
               </p>
            </div>

            {/* Timeline / Comments */}
            <div className="space-y-6">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-4">Historia komunikacji ({issue.comments.length})</h3>
               
               <div className="space-y-6">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="bg-white border-2 border-[#5F5AFC] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center text-xs font-black text-white">
                          {comment.author.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{comment.author.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-slate-600 text-base leading-relaxed font-medium italic">
                        "{comment.comment}"
                      </p>
                    </div>
                  ))}

                  {/* Input Card (The "Blue" Style) */}
                  <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#5F5AFC] rounded-full flex items-center justify-center text-xs font-black text-white">
                          AD
                        </div>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Wyślij oficjalną odpowiedź...</p>
                    </div>
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[120px] focus:ring-2 focus:ring-[#5F5AFC] transition-all"
                        placeholder="Treść odpowiedzi..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button className="bg-[#5F5AFC] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
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
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Metadane sprawy</h3>
              
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
                    <p className="text-sm font-black text-[#5F5AFC] uppercase tracking-tighter">
                       {issue.student ? `${issue.student.firstName} ${issue.student.lastName}` : 'Zgłoszenie Ogólne'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase">Obiekt powiązany</p>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-6 pt-10 border-t border-slate-50">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Data Rejestracji</p>
                    <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-[#5F5AFC]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5"/></svg>
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

            {/* AI Insight Card (Modern Gradient) */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5" /></svg>
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">System AI Insight</h4>
                 </div>
                 <p className="text-sm font-bold leading-relaxed text-blue-50 italic">
                   "Kategoria <span className="underline decoration-blue-500 uppercase">{issue.category}</span> wymaga weryfikacji dokumentacji medycznej przed udzieleniem odpowiedzi."
                 </p>
               </div>
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}