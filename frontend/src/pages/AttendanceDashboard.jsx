import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { attendanceAPI } from '../services/api';
import { Users, UserCheck, UserX, Clock, Calendar, Download, Search, Filter } from 'lucide-react';

export default function AttendanceDashboard() {
  const [todayLogs, setTodayLogs] = useState([]);
  const [summary, setSummary] = useState({
    total_users: 0,
    present_today: 0,
    absent_today: 0,
    attendance_rate: 0,
    weekly_trend: []
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, summaryRes] = await Promise.all([
          attendanceAPI.getToday(),
          attendanceAPI.getSummary()
        ]);
        setTodayLogs(logsRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLogs = todayLogs.filter(log =>
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <Clock className="w-3.5 h-3.5" /> BIOMETRIC ATTENDANCE DASHBOARD
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Attendance Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Automated facial recognition timestamp records and attendance reports</p>
        </div>

        <button
          onClick={() => alert("Exporting Attendance CSV Report...")}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-400 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={summary.total_users}
          icon={Users}
          color="cyan"
          subtext="Active System Profiles"
        />
        <StatCard
          title="Present Today"
          value={summary.present_today}
          icon={UserCheck}
          color="green"
          trend="+ Today Verified"
        />
        <StatCard
          title="Absent Today"
          value={summary.absent_today}
          icon={UserX}
          color="red"
          subtext="Pending Biometric Check"
        />
        <StatCard
          title="Attendance Rate"
          value={`${summary.attendance_rate}%`}
          icon={Calendar}
          color="purple"
          subtext="Daily Turnout Ratio"
        />
      </div>

      {/* Weekly Trend Bar Visualization */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-200 text-sm font-['Space_Grotesk']">7-Day Attendance Trend</h3>
        <div className="grid grid-cols-7 gap-2 pt-2">
          {summary.weekly_trend.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-full h-32 bg-slate-950 rounded-xl p-1 border border-slate-800 flex items-end justify-center">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600 to-purple-500 rounded-lg transition-all duration-500"
                  style={{ height: `${Math.max(10, (day.count / max(1, summary.total_users)) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">Today's Attendance Logs</h3>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search user or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No attendance records found for today.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400">#{log.user_id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{log.user_name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{log.date}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{log.time}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function max(a, b) {
  return Math.max(a, b);
}
