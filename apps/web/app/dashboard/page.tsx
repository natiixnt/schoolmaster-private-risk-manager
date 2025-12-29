'use client';

import KpiCard from "./KpiCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [riskStudents, setRiskStudents] = useState<any[]>([]);
    const [issues, setIssues] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            // Symulacja danych
            setTimeout(() => {
                setStats({ totalStudents: 450, highRiskCount: 12, openIssues: 5, activePlans: 8 });
                setRiskStudents([
                    { id: '1', name: 'Kapi Kapi', className: '3B', riskScore: 99, updatedAt: '2025-10-25' },
                    { id: '2', name: 'Natiix Natiix', className: '3A', riskScore: 99, updatedAt: '2025-10-24' },
                    { id: '3', name: 'Albercik Albercik', className: '3B', riskScore: 99, updatedAt: '2025-10-24' },
                    { id: '4', name: 'Rofrol', className: '3B', riskScore: 99, updatedAt: '2025-10-24' }
                ]);

                setIssues([
                    { id: '101', title: 'Agresywne zachowanie na przerwie', status: 'Nowe', priority: 'Wysoki', time: '2h temu' },
                    { id: '102', title: 'Brak kontaktu z rodzicem', status: 'W toku', priority: 'Średni', time: '5h temu' },
                    { id: '103', title: 'Opuszczanie Lekcji', status: 'W toku', priority: 'Wysoki', time: '1d temu' },
                ]);
                setLoading(false);
            }, 600); 
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans text-gray-900">
            <div className="mx-auto max-w-7xl space-y-8">
                
                <div className="relative overflow-hidden rounded-3xl bg-indigo-900 px-8 py-10 shadow-xl sm:px-12 sm:py-16">
                   
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" stroke="currentColor" strokeWidth="100">
                                <circle r="234" cx="196" cy="23" className="text-white" />
                                <circle r="234" cx="790" cy="491" className="text-white" />
                            </g>
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Witaj, Adminie</h1>
                            <p className="mt-2 text-lg text-indigo-200 max-w-2xl">
                                Oto co dzieje się dzisiaj w Twojej szkole. Masz <span className="font-bold text-white">{stats?.openIssues || '0'}</span> spraw wymagających uwagi.
                            </p>
                        </div>
                        <div>
                            <button 
                                onClick={() => router.push('/risk/classes')}
                                className="group inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-all hover:bg-white/20"
                            >
                                <span>Przeglądaj klasy</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard title="Uczniowie w RYZYKU" value={stats?.highRiskCount} color="red" loading={loading} onClick={() => router.push('/risk/classes')} />
                    <KpiCard title="Otwarte sprawy" value={stats?.openIssues} color="amber" loading={loading} onClick={() => router.push('/parent-issues')} />
                    <KpiCard title="Wszyscy uczniowie" value={stats?.totalStudents} color="indigo" loading={loading} />
                    <KpiCard title="Aktywne plany" value={stats?.activePlans} color="emerald" loading={loading} />
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    {/* LEWA KOLUMNA - TABELA */}
                    <div className="lg:col-span-2 flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
                        <div className="border-b border-gray-100 px-6 py-5 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Krytyczne ryzyko (RED)</h3>
                                <p className="text-xs text-gray-500 mt-1">Uczniowie wymagający natychmiastowej interwencji.</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/10">
                                WYMAGA UWAGI
                            </span>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/30">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Uczeń</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Wynik</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Akcja</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {riskStudents.map((student) => (
                                        <tr key={student.id} className="group hover:bg-gray-50/80 transition-colors">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-semibold text-gray-900">{student.name}</div>
                                                        <div className="text-xs text-gray-500">Klasa {student.className}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
                                                    {student.riskScore}%
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => router.push(`/risk/students/${student.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    Profil
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PRAWA KOLUMNA - LISTA */}
                    <div className="flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                        <div className="border-b border-gray-100 px-6 py-5 bg-gray-50/50">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Najnowsze zgłoszenia</h3>
                        </div>
                        <div className="flex-1 p-4 space-y-3">
                            {issues.map((issue) => (
                                <div 
                                    key={issue.id} 
                                    onClick={() => router.push(`/parent-issues/${issue.id}`)}
                                    className="group relative flex items-start space-x-3 rounded-xl border border-gray-100 p-4 hover:border-indigo-200 hover:bg-gray-50/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset uppercase tracking-wide
                                                ${issue.priority === 'Wysoki' 
                                                    ? 'bg-red-50 text-red-700 ring-red-600/20' 
                                                    : 'bg-blue-50 text-blue-700 ring-blue-600/20'}`}>
                                                {issue.priority}
                                            </span>
                                            <span className="text-xs text-gray-400">• {issue.time}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {issue.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{issue.status}</p>
                                    </div>
                                    <div className="flex-shrink-0 self-center">
                                        <svg className="h-5 w-5 text-gray-300 group-hover:text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                             <button 
                                onClick={() => router.push('/parent-issues')}
                                className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                Zobacz wszystkie
                              </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
