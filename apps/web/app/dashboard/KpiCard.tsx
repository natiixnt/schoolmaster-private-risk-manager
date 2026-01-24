import React from 'react'

export default function KpiCard({ title, value, color, loading, onClick }: any) {
  const colors:any = {
  red: {
    classes: 'border-red-100 text-[var(--sm-color-danger-500)]',
    shadow: 'hover:shadow-[0_8px_12px_-2px_rgba(239,68,68,0.5)]',
  },
  blue: {
    classes: 'border-indigo-100 text-[var(--sm-color-info-600)]',
    shadow: 'hover:shadow-[0_8px_12px_-2px_rgba(92,107,192,0.5)]',
  },
};
  return (
    <div 
      onClick={onClick}
      className={` bg-white p-6 rounded-[var(--sm-radius-md)] border-2${colors[color].classes} shadow-md transition-all ${onClick ? `cursor-pointer hover:scale-[1.02] ${colors[color].shadow}` : ''}
`}
    >
      <p className="text-xs font-extrabold uppercase tracking-wider opacity-60 ">{title}</p>
      {loading ? (
        <div className="h-8 w-12 bg-gray-100 animate-pulse mt-2 rounded" />
      ) : (
        <p className="text-3xl font-black mt-1 text-gray-800">{value}</p>
      )}
    </div>
  );
}
