import React from 'react';

type KpiColor = 'red' | 'amber' | 'indigo' | 'emerald';

interface KpiCardProps {
  title: string;
  value: number | string;
  color: KpiColor;
  loading?: boolean;
  onClick?: () => void;
}

export default function KpiCard({ title, value, color, loading, onClick }: KpiCardProps) {
  
  // Style dla ikony/tła w zależności od koloru
  const themeStyles = {
    red: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  };

  const currentTheme = themeStyles[color];

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 
        transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 hover:ring-indigo-200' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</h3>
            )}
        </div>
        
     
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${currentTheme.bg} ${currentTheme.text} ring-1 ring-inset ${currentTheme.ring}`}>
            
            {color === 'red' && (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            )}
            {color === 'amber' && (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            )}
            {color === 'indigo' && (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            )}
            {color === 'emerald' && (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 h-1 w-full ${currentTheme.bg.replace('50', '500')} opacity-10`}></div>
    </div>
  );
}
