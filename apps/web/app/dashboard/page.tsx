'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "apps/web/lib/auth";
import KpiCard from "./KpiCard";
import LogoWhite from "../components/LogoWhite";
// --- INTERFEJSY ---
interface RiskStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  class: { name: string };
  score: number;
  level: string;
}

interface ParentIssue {
  id: string;
  title: string;
  status: string;
  priority: string;
}
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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [riskStudents, setRiskStudents] = useState<RiskStudent[]>([]);
  const [issues, setIssues] = useState<ParentIssue[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    highRiskCount: 0,
    openIssues: 0,
    totalClasses: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const riskData = await authFetch<RiskStudent[]>('/risk/students');
        const studentsList = Array.isArray(riskData) ? riskData : [];
        const classesData = await authFetch<SchoolClass[]>('/classes');
        const classesList = Array.isArray(classesData) ? classesData : [];
        const issuesData = await authFetch<{ items: ParentIssue[] }>('/parent-issues');
        const issuesList = issuesData?.items || [];
  
        setRiskStudents(studentsList.slice(0, 5));
        setIssues(issuesList.slice(0, 3));
        setStats({
          totalStudents: studentsList.length,
          highRiskCount: studentsList.filter(s => s.level === 'RED').length,
          openIssues: issuesList.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length,
          totalClasses: classesList.length
        });
        console.log({
  studentsList,
  issuesList
});
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="schoolmaster-private h-screen space-y-10 p-6 lg:p-10 bg-[var(--sm-color-background)] font-sans">
      
      {/* --- HEADER SECTION: DOMINUJĄCY NIEBIESKI GRADIENT --- */}
      
      <div className="sm-bg-hero rounded-[var(--sm-radius-lg)] overflow-hidden p-10 shadow-2xl shadow-[var(--sm-color-info-600)]/30 border-b-8 border-[var(--sm-color-surface)]/10 relative ">
      
        {/* Dekoracyjne okręgi w tle dla głębi */} 
        <div className=" z-10 flex flex-col  md:flex-row justify-between items-center gap-8 overflow-hidden">
          <div className="absolute top-0 left-0 md:translate-x-5 md:translate-y-0 w-full h-full opacity-10 overflow-hidden pointer-events-none">
           <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="currentColor" strokeWidth="40">   
              <circle r="105" cx="450" cy="400" className="text-white"/>
              <circle r="150" cx="900" cy="540" className="text-white"/>
              <circle r="120" cx="550" cy="50" className="text-white"/>
              </g>
            </svg>
        </div>
          <div className="flex w-full justify-between flex-col  relative md:flex-row md:static ">
         
            <h1 className="text-4xl lg:text-5xl font-[var(--sm-font-weight-bold)] gradient text-[var(--sm-color-on-primary)] tracking-tighter uppercase leading-none">
              Panel Systemowy
            </h1>
            
            <LogoWhite className="w-85 absolute h-35  top-0 right-0 left-100% bottom-15 z-50 hidden pointer-events-none md:block"/>
            
          </div>
          {
            /*
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/risk/students')}
              className=" cursor-pointer bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-8 py-4 rounded-2xl text-xs font-[var(--sm-font-weight-bold)] uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Statystyki
            </button>
            <button 
              onClick={() => router.push('/risk/students')}
              className="cursor-pointer bg-white text-[var(--sm-color-info-600)] px-8 py-4 rounded-2xl text-xs font-[var(--sm-font-weight-bold)] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all shadow-lg active:scale-95"
            >
              Pełna Baza
            </button>
          </div>
          */
}
        </div>
      </div>

      {/* --- KPI STATS: NIEBIESKIE AKCENTY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cardy powinny wewnątrz używać #5F5AFC dla ikon/tekstów */}
        <KpiCard title="Krytyczne Ryzyko" value={stats.highRiskCount} color="red" loading={loading} onClick={() => router.push('/risk/students')} />
        <KpiCard title="Otwarte Sprawy" value={stats.openIssues} color="blue" loading={loading} onClick={() => router.push('/parent-issues')} />
        <KpiCard title="Baza Studentów" value={stats.totalStudents} color="blue" loading={loading} onClick={() => router.push('/risk/students')} />
       {  <KpiCard title="Liczba Klas" value={stats.totalClasses} color="blue" loading={loading} onClick={() => router.push('/risk/classes')}/>}
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* TOP RISK STUDENTS (8/12) */}
        <div className="lg:col-span-8 bg-[var(--sm-color-surface)] rounded-[var(--sm-radius-lg)] border-2 border-[var(--sm-color-info-600)]/10 shadow-xl sm-shadow-2 overflow-hidden flex flex-col">
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-blue-50/30">
            <div>
              <h3 className="text-xl font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] uppercase tracking-tighter">Monitoring <span className="text-[var(--sm-color-info-600)]">Ryzyka</span></h3>
              <p className="text-md text-[var(--sm-color-neutral-500)] font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] mt-1">Wykryte anomalie behawioralne</p>
            </div>
            <div className="w-12 h-12 bg-[var(--sm-color-info-600)]/10 rounded-[var(--sm-radius-md)] flex items-center justify-center text-[var(--sm-color-info-600)] border border-[var(--sm-color-info-600)]/20">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth="2.5" /></svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm uppercase text-[var(--sm-color-neutral-500)] font-[var(--sm-font-weight-bold)] border-b border-slate-50">
                  <th className="px-10 py-5">Student</th>
                  <th className="px-10 py-5 text-center">Score</th>
                  <th className="px-10 py-5 text-right">Profil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   [...Array(5)].map((_, i) => <tr key={i} className="h-20 animate-pulse bg-slate-50/10" />)
                ) : riskStudents.map(student => (
                  <tr key={student.studentId} className="hover:bg-[var(--sm-color-surface-muted)] group transition-all">
                    <td className="px-10 py-6">
                      <div className="font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] text-lg uppercase tracking-tight transition-colors">{student.lastName} {student.firstName}</div>
                      <div className="text-xs font-[var(--sm-font-weight-bold)] text-[var(--sm-color-info-600)] uppercase tracking-widest mt-1">KLASA: {student.class.name}</div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-2xl font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] leading-none">{student.score}</span>
                        <div className="w-10 h-1.5 bg-[var(--sm-color-neutral-400)] rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-[var(--sm-color-info-600)]" style={{ width: `${student.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => router.push(`/risk/students/${student.studentId}`)}
                        className="bg-blue-50 text-[var(--sm-color-info-600)] p-3 rounded-xl hover:bg-[var(--sm-color-info-600)] hover:text-white transition-all border border-[var(--sm-color-info-600)]/20 cursor-pointer"
                      >
                        {<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {
            /*
          <button 
            onClick={() => router.push('/risk/students')}
            className="w-full pt-6 text-xs flex-1 font-[var(--sm-font-weight-bold)] text-[var(--sm-color-info-600)] hover:bg-[var(--sm-color-info-600)] hover:text-white transition-all cursor-pointer uppercase tracking-[0.3em]"
          >
             Wszyscy Studenci &rarr;
          </button>
          */
}
        </div>

        {/* RECENT ISSUES (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] border-2 border-[var(--sm-color-info-600)]/10 sm-shadow-2 flex flex-col h-full">
            <div className="px-10 py-8 border-b border-slate-50 bg-blue-50/30" >
              <h3 className="text-xl font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] uppercase tracking-tighter">Zgłoszenia</h3>
              <p className="text-md text-[var(--sm-color-neutral-500)] font-[var(--sm-font-weight-bold)] uppercase tracking-[0.2em] mt-1">Interwencje Rodzicielskie</p>
            </div>
            <div className="p-8 space-y-4 flex-1">
              {loading ? (
                 [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />)
              ) : issues.length > 0 ? (
                issues.map(issue => (
                  <div 
                    key={issue.id} 
                    onClick={() => router.push(`/parent-issues/${issue.id}`)}
                    className="p-6 rounded-3xl border-2 border-blue-50 hover:border-[var(--sm-color-info-600)] hover:shadow-2xl hover:shadow-[var(--sm-color-info-600)]/10 cursor-pointer transition-all bg-[#F8FAFC] group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-sm font-[var(--sm-font-weight-bold)] px-3 py-1 rounded-lg border-2 uppercase tracking-widest ${
                        issue.priority === 'HIGH' ? 'bg-[var(--sm-color-negative-100)] border-red-100 text-[var(--sm-color-negative-500)]' : 'bg-blue-50 border-blue-100 text-[var(--sm-color-info-600)]'
                      }`}>
                        {issue.priority}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[var(--sm-color-info-600)] sm-shadow-1" />
                    </div>
                    <h4 className="text-sm font-[var(--sm-font-weight-bold)] text-[var(--sm-color-text-primary)] leading-tight  transition-colors uppercase tracking-tight">{issue.title}</h4>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 italic text-slate-300 text-xs">System czysty. Brak zgłoszeń.</div>
              )}
            </div>
            <div className="flex flex-1 justify-center items-center ">
              <button 
                onClick={() => router.push('/parent-issues')}
                className="w-1/2 xl:h-1/2 text-md lg:text-lg font-[var(--sm-font-weight-bold)] text-[var(--sm-color-on-primary)] bg-[var(--sm-color-info-600)] hover:bg-[var(--sm-color-info-700)] hover:-translate-y-1 cursor-pointer rounded-[var(--sm-radius-md)] transition-all uppercase tracking-widest shadow-lg shadow-[var(--sm-color-info-600)]/30 active:scale-95"
              >
                  Sprawy
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}