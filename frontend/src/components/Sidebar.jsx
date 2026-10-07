import React from 'react';
import { LayoutDashboard, Users, Clock, ShieldCheck, Smile, Settings, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'recognitions', label: 'Recognition Logs', icon: ShieldCheck },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'emotions', label: 'Emotions Log', icon: Smile },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel rounded-2xl p-4 flex flex-col justify-between shrink-0 hidden md:flex border border-cyan-500/20">
      <div className="space-y-6">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-800 pb-4">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Control Panel</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footnote */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>FAISS Vector Engine</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="text-[11px] font-mono text-cyan-400/80">ArcFace 512-d Active</div>
      </div>
    </aside>
  );
}
