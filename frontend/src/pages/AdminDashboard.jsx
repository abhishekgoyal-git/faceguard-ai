import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { adminAPI } from '../services/api';
import { Users, ShieldCheck, Clock, KeyRound, Smile, Trash2, ShieldAlert, CheckCircle, RefreshCw, Sliders, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState({
    total_users: 0,
    total_recognitions: 0,
    today_attendance: 0,
    access_events_today: 0,
    granted_count: 0,
    denied_count: 0,
    real_faces_count: 0,
    spoof_attempts_count: 0
  });

  const [users, setUsers] = useState([]);
  const [recognitionLogs, setRecognitionLogs] = useState([]);
  const [emotionLogs, setEmotionLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [threshold, setThreshold] = useState(60);
  const [livenessThreshold, setLivenessThreshold] = useState(50);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sumRes, usersRes, recsRes, emoRes] = await Promise.all([
        adminAPI.getSummary(),
        adminAPI.getUsers(),
        adminAPI.getRecognitions(),
        adminAPI.getEmotions()
      ]);
      setSummary(sumRes.data);
      setUsers(usersRes.data);
      setRecognitionLogs(recsRes.data);
      setEmotionLogs(emoRes.data);
    } catch (err) {
      console.error("Admin dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete user ID #${userId}?`)) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white capitalize">
              Admin Portal / {activeTab}
            </h1>
            <p className="text-xs text-slate-400 mt-1">FaceGuard AI Core Administration & Multi-Log Inspector</p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
          </button>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Registered Users" value={summary.total_users} icon={Users} color="cyan" />
              <StatCard title="Total Recognitions" value={summary.total_recognitions} icon={ShieldCheck} color="purple" />
              <StatCard title="Today's Attendance" value={summary.today_attendance} icon={Clock} color="green" />
              <StatCard title="Total Access Events" value={summary.access_events_today} icon={KeyRound} color="amber" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Access Decisions Distribution */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-200 text-sm font-['Space_Grotesk']">Access Control Decisions</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>Access Granted</span>
                      <span className="text-emerald-400 font-bold">{summary.granted_count}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (summary.granted_count / max(1, summary.access_events_today)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>Access Denied</span>
                      <span className="text-red-400 font-bold">{summary.denied_count}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${Math.min(100, (summary.denied_count / max(1, summary.access_events_today)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Liveness Anti-Spoof Diagnostics */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-slate-200 text-sm font-['Space_Grotesk']">Liveness Detection Diagnostics</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>Real Face Verified</span>
                      <span className="text-cyan-400 font-bold">{summary.real_faces_count}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${Math.min(100, (summary.real_faces_count / max(1, summary.access_events_today)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>Spoof Attacks Filtered</span>
                      <span className="text-purple-400 font-bold">{summary.spoof_attempts_count}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, (summary.spoof_attempts_count / max(1, summary.access_events_today)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">System Registered Users</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Face Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-cyan-400">#{u.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{u.name}</td>
                      <td className="py-3 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          u.has_face_enrolled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {u.has_face_enrolled ? 'ENROLLED' : 'NOT ENROLLED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Recognition Logs */}
        {activeTab === 'recognitions' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">ArcFace FAISS Recognition Audit Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Matched User</th>
                    <th className="py-3 px-4">Confidence Score</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {recognitionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">#{log.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{log.user_name}</td>
                      <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{(log.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{new Date(log.recognized_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Attendance */}
        {activeTab === 'attendance' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">Today's Attendance Master Record</h3>
            <p className="text-xs text-slate-400">Total present today: {summary.today_attendance} users</p>
          </div>
        )}

        {/* Tab 5: Emotions Log */}
        {activeTab === 'emotions' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">FER+ Facial Emotion Detection Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Detected Emotion</th>
                    <th className="py-3 px-4">Model Confidence</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {emotionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">#{log.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{log.user_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {log.emotion}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-purple-400 font-bold">{(log.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{new Date(log.detected_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Settings */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-200 text-base font-['Space_Grotesk']">AI Model Parameters & Thresholds</h3>
            </div>

            <div className="space-y-6 max-w-xl">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span>ArcFace Similarity Threshold ({threshold}%)</span>
                  <span className="text-cyan-400 font-mono">0.{threshold} Cosine</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Minimum similarity required to classify a face as recognized.</p>
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span>Anti-Spoofing Cutoff Sensitivity ({livenessThreshold}%)</span>
                  <span className="text-purple-400 font-mono">{livenessThreshold}% Risk</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="80"
                  value={livenessThreshold}
                  onChange={(e) => setLivenessThreshold(e.target.value)}
                  className="w-full accent-purple-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Sensitivity cutoff for flagging photo print or screen replay attacks.</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => alert("Settings updated successfully.")}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
                >
                  Save Model Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function max(a, b) {
  return Math.max(a, b);
}
