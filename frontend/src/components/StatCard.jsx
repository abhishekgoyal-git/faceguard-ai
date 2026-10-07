import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'cyan', subtext, trend }) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30 shadow-purple-500/10',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
    red: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/30 shadow-red-500/10',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30 shadow-amber-500/10',
  };

  const iconBgs = {
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br glass-panel border shadow-lg ${colors[color]} glass-panel-hover`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">{title}</p>
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconBgs[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
