'use client';

import KpiCard from "./KpiCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter() //nawigator
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [riskStudents, setRiskStudents] = useState<any[]>([]);
    const [issues, setIssues] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            //Sztuczne dane. Bez integracji api.
            setStats({ totalStudents: 450, highRiskCount: 12, openIssues: 5, activePlans: 8 });
        setRiskStudents([
        { id: '1', name: 'Kapi Kapi', className: '3B', riskScore: 99, updatedAt: '2025-10-25' },
        { id: '2', name: 'Natiix Natiix', className: '3A', riskScore: 99, updatedAt: '2025-10-24' },
        { id: '3', name: 'Albercik Albercik', className: '3B', riskScore: 99, updatedAt: '2025-10-24' },
        { id: '4', name: 'Rofrol', className: '3B', riskScore: 99, updatedAt: '2025-10-24' }
      ]);

      setIssues([
        { id: '101', title: 'Agresywne zachowanie na przerwie', status: 'Nowe', priority: 'Wysoki' },
        { id: '102', title: 'Brak kontaktu z rodzicem', status: 'W toku', priority: 'Średni' },
        { id: '102', title: 'Opuszczanie Lekcji', status: 'W toku', priority: 'Wysoki' },
      ]);

      setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Witaj, Adminie</h1>
          <p className="text-gray-500">Oto co dzieje się dzisiaj w Twojej szkole.</p>
        </div>
        <button 
          onClick={() => router.push('/risk/classes')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
        >
          Przeglądaj klasy
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Uczniowie w RYZYKU" value={stats?.highRiskCount} color="red" loading={loading} onClick={() => router.push('/risk/classes')} />
        <KpiCard title="Otwarte sprawy" value={stats?.openIssues} color="amber" loading={loading} onClick={() => router.push('/parent-issues')} />
        <KpiCard title="Wszyscy uczniowie" value={stats?.totalStudents} color="indigo" loading={loading} />
        <KpiCard title="Aktywne plany" value={stats?.activePlans} color="emerald" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Krytyczne poziomy ryzyka (RED)</h3>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase">Wymaga uwagi</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-400 font-semibold bg-gray-50/50">
                  <th className="px-6 py-3">Uczeń</th>
                  <th className="px-6 py-3 text-center">Wynik</th>
                  <th className="px-6 py-3 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {riskStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 group transition-all">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">Klasa {student.className}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-red-600">{student.riskScore}%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/risk/students/${student.id}`)}
                        className="text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Otwórz profil &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRAWA: SPRAWY RODZICÓW (1/3 szerokości) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Najnowsze zgłoszenia</h3>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {issues.map(issue => (
              <div 
                key={issue.id} 
                onClick={() => router.push(`/parent-issues/${issue.id}`)}
                className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all bg-gray-50/30 group"
              >
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${issue.priority === 'Wysoki' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {issue.priority}
                  </span>
                  <span className="text-xs text-gray-400">2h temu</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{issue.title}</h4>
              </div>
            ))}
          </div>
          <button 
            onClick={() => router.push('/parent-issues')}
            className="m-4 mt-0 py-3 text-sm font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            Wszystkie zgłoszenia
          </button>
        </div>
      </div>
    </div>
  );

}



