import React from 'react'

export default function KpiCard({ title, value, color, loading, onClick }: any) {
  const colors: any = {
    red: 'border-red-100 text-red-600',
    amber: 'border-amber-100 text-amber-600',
    indigo: 'border-indigo-100 text-indigo-600',
    emerald: 'border-emerald-100 text-emerald-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border-2 ${colors[color]} shadow-sm ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} transition-all`}
    >
      <p className="text-xs font-bold uppercase tracking-wider opacity-60">{title}</p>
      {loading ? (
        <div className="h-8 w-12 bg-gray-100 animate-pulse mt-2 rounded" />
      ) : (
        <p className="text-3xl font-black mt-1 text-gray-900">{value}</p>
      )}
    </div>
  );
}
