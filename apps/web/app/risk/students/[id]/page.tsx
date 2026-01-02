'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ActionPlan {
  id: string;
  goal: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  owner: string;
  deadline: string;
}

interface TimelineEvent {
  id: string;
  type: 'Note' | 'Meeting' | 'Incident' | 'System';
  title: string;
  date: string;
  description: string;
}

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'IMG';
  date: string;
  size: string;
}

interface HealthInfo {
  conditions: string[]; 
  opinions: string[];  
  notes: string;
}

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  className: string;
  email: string; 
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  avgGrade: number;
  attendance: number;
  incidentCount: number;
  guardian: {
    name: string;
    phone: string;
    email: string;
    relation: string; 
  };
  plans: ActionPlan[];
  history: TimelineEvent[];
  documents: Document[]; 
  health: HealthInfo;   
}

export default function StudentRiskProfileWide() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
 
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'health' | 'docs' | 'history'>('overview');
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 600));

    
      setStudent({
        id: '1',
        firstName: 'Kacper',
        lastName: 'Kacper',
        className: '7B',
        email: 'k.kowalski@szkola.pl',
        riskLevel: 'HIGH',
        riskScore: 88,
        avgGrade: 2.8,
        attendance: 74,
        incidentCount: 5,
        guardian: {
          name: 'Anna Kowalska',
          phone: '+48 600 100 200',
          email: 'anna.k@gmail.com',
          relation: 'Matka'
        },
        plans: [
          { id: 'p1', goal: 'Poprawa frekwencji do 85%', status: 'IN_PROGRESS', owner: 'Pedagog', deadline: '20.06.2024' },
        ],
        history: [
          { id: 'h1', type: 'Incident', title: 'Awantura na korytarzu', date: '2 dni temu', description: 'Sprzeczka słowna z uczniem z 8A.' },
          { id: 'h2', type: 'Note', title: 'Wniesienie telefonu', date: 'Tydzień temu', description: 'Korzystanie z telefonu podczas lekcji chemii.' },
        ],
        documents: [
          { id: 'd1', name: 'Opinia_PPP_2024.pdf', type: 'PDF', date: '12.01.2024', size: '2.4 MB' },
          { id: 'd2', name: 'Zgoda_wycieczka.jpg', type: 'IMG', date: '05.03.2024', size: '1.1 MB' },
        ],
        
        health: {
          conditions: ['Alergia na orzechy', 'Lekka astma'],
          opinions: ['Dysleksja', 'Wskazania do wydłużonego czasu pisania'],
          notes: 'Wymaga stałego dostępu do inhalatora. W razie ataku duszności dzwonić do rodzica.'
        }
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!student) return <div>Brak danych.</div>;
  return (
    
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
      
      
      <div className="relative bg-white shadow-sm border-b border-gray-200 pb-8">
         
         <div className="h-48 w-full bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 absolute top-0 left-0 z-0">
            <div className="absolute inset-0 bg-black/10"></div> {/* Przyciemnienie */}
         </div>

         <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-10 pt-24">
            <div className="flex flex-col md:flex-row items-end gap-6">
               {/* Avatar */}
               <div className="h-32 w-32 rounded-3xl bg-white p-1.5 shadow-xl">
                  <div className="h-full w-full rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                     {student.firstName[0]}{student.lastName[0]}
                  </div>
               </div>
               
               {/* Info Główne */}
               <div className="flex-1 pb-2">
                  <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{student.firstName} {student.lastName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-black text-sm font-medium">
                     <span className=" px-3 py-1 rounded-lg">Klasa {student.className}</span>
                     <span>•</span>
                     <span>{student.email}</span>
                  </div>
               </div>

               {/* Przyciski Akcji */}
               <div className="flex gap-3 pb-2">
                  <button className="px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors">
                     Edytuj profil
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-colors">
                     + Zgłoś incydent
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-6">
           
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Poziom Ryzyka</h3>
              <div className="flex items-center gap-6">
                 <div className="relative h-28 w-28 flex items-center justify-center">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-red-500" strokeDasharray={`${student.riskScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <span className="absolute text-3xl font-bold text-gray-900">{student.riskScore}</span>
                 </div>
                 <div>
                    <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-red-600/10 mb-2">
                       CRITICAL
                    </span>
                    <p className="text-sm text-gray-500">Wymaga natychmiastowej uwagi pedagoga.</p>
                 </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                 <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{student.attendance}%</div>
                    <div className="text-xs text-gray-500 font-medium uppercase">Frekwencja</div>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{student.avgGrade}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase">Średnia</div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                 Kontakt z opiekunem
                 <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold">{student.guardian.relation}</span>
              </h3>
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {student.guardian.name[0]}
                 </div>
                 <div>
                    <p className="font-semibold text-gray-900">{student.guardian.name}</p>
                    <p className="text-sm text-gray-500">Główny opiekun</p>
                 </div>
              </div>
              <div className="space-y-3 text-sm">
                 <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {student.guardian.phone}
                 </div>
                 <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <svg className="w-5 h-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {student.guardian.email}
                 </div>
              </div>
              <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                 Wyślij wiadomość
              </button>
           </div>
        </div>


        <div className="lg:col-span-8">
           
  
           <div className="border-b border-gray-200 mb-6 flex gap-6 overflow-x-auto pb-1">
              {[
                 { id: 'overview', label: 'Przegląd' },
                 { id: 'health', label: 'Zdrowie i Opinie', badge: student.health.opinions.length }, // Nowy Tab
                 { id: 'plans', label: 'Plany Naprawcze', badge: student.plans.length },
                 { id: 'docs', label: 'Dokumenty', badge: student.documents.length }, // Nowy Tab
                 { id: 'history', label: 'Historia' }
              ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2
                       ${activeTab === tab.id 
                          ? 'border-indigo-600 text-indigo-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                    }
                 >
                    {tab.label}
                    {tab.badge ? (
                       <span className={`text-[10px] px-1.5 rounded-full ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                          {tab.badge}
                       </span>
                    ) : null}
                 </button>
              ))}
           </div>


           <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
              

              {activeTab === 'overview' && (
                 <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Najnowsze aktywności</h3>
                    {student.history.slice(0,3).map(event => (
                       <div key={event.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0">
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${event.type === 'Incident' ? 'bg-red-500' : 'bg-gray-400'}`} />
                          <div>
                             <p className="text-sm font-bold text-gray-900">{event.title} <span className="text-gray-400 font-normal ml-2 text-xs">{event.date}</span></p>
                             <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

        
              {activeTab === 'health' && (
                 <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
                       <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Opinie i Orzeczenia</h4>
                          <div className="space-y-3">
                             {student.health.opinions.map((op, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-sm font-medium">
                                   <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                   {op}
                                </div>
                             ))}
                          </div>
                       </div>
                       
     
                       <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Stan Zdrowia / Alergie</h4>
                          <div className="flex flex-wrap gap-2">
                             {student.health.conditions.map((cond, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-sm font-semibold">
                                   {cond}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>

      
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                       <h4 className="text-sm font-bold text-gray-900 mb-2">Ważne uwagi dla nauczycieli</h4>
                       <p className="text-gray-700 text-sm leading-relaxed">
                          {student.health.notes}
                       </p>
                    </div>
                 </div>
              )}

              {activeTab === 'docs' && (
                 <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-bold text-gray-900">Pliki ucznia</h3>
                       <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                          Dodaj plik
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {student.documents.map(doc => (
                          <div key={doc.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer bg-white group">
                             <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                                {doc.type}
                             </div>
                             <div className="ml-4 flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.date} • {doc.size}</p>
                             </div>
                             <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
              

              {activeTab === 'plans' && <div>Brak Planów </div>}
              {activeTab === 'history' && <div>Brak Historii </div>}

           </div>
        </div>

      </div>
    </div>
  );
}
