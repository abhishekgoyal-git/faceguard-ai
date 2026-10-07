import React, { useState, useEffect, useCallback } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import { accessAPI } from '../services/api';
import { KeyRound, ShieldCheck, ShieldAlert, Lock, CheckCircle, XCircle, Activity, Sparkles } from 'lucide-react';

export default function AccessControlDashboard() {
  const [accessResult, setAccessResult] = useState({
    access_status: 'Evaluating',
    reason: 'Position face towards camera...',
    face_detected: false,
    user_name: 'Unknown',
    similarity_score: 0.0,
    spoof_status: 'Real Face',
    spoof_probability: 0.05,
    emotion: 'Neutral',
    bounding_box: null
  });

  const [accessLogs, setAccessLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await accessAPI.getLogs();
      setAccessLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFrameCapture = useCallback(async (base64Frame) => {
    try {
      const res = await accessAPI.verifyAccess(base64Frame);
      setAccessResult(res.data);
      // Periodically refresh logs feed
      fetchLogs();
    } catch (err) {
      console.error("Access verification error:", err);
    }
  }, []);

  const isGranted = accessResult.access_status === 'Granted';
  const hasFace = accessResult.face_detected;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-emerald-400 mb-2">
            <KeyRound className="w-3.5 h-3.5" /> ZERO-TRUST ACCESS CONTROL GATEWAY
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Access Control Hub</h1>
          <p className="text-sm text-slate-400 mt-1">IF Recognized AND Liveness = Real THEN Access Granted ELSE Denied</p>
        </div>

        {/* Big Decision Badge */}
        <div className={`px-6 py-4 rounded-2xl glass-panel border flex items-center gap-4 transition-all duration-300 ${
          isGranted ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-xl shadow-emerald-500/20' :
          hasFace ? 'border-red-500/50 bg-red-500/10 text-red-300 shadow-xl shadow-red-500/20' :
          'border-slate-800 bg-slate-900/60 text-slate-400'
        }`}>
          {isGranted ? <ShieldCheck className="w-8 h-8 text-emerald-400 animate-bounce" /> : <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />}
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase opacity-80">Access Gateway</div>
            <div className="font-extrabold text-xl font-['Space_Grotesk'] tracking-wider">
              {accessResult.access_status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stream & Live Decision Viewport */}
        <div className="lg:col-span-2 space-y-6">
          <WebcamFeed
            onFrameCapture={handleFrameCapture}
            boundingBox={accessResult.bounding_box}
            overlayText={`GATEWAY: ${accessResult.access_status}`}
            statusColor={isGranted ? 'green' : hasFace ? 'red' : 'cyan'}
          />

          {/* Decision Reason & Breakdown */}
          <div className={`p-6 rounded-3xl glass-panel border transition-all ${
            isGranted ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800 bg-slate-950'
          }`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Decision Diagnostic Log</h3>
            <p className="text-lg font-bold text-white font-['Space_Grotesk']">{accessResult.reason}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">RECOGNIZED NAME</span>
                <strong className="text-white text-sm">{accessResult.user_name}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SIMILARITY SCORE</span>
                <strong className="text-cyan-400 text-sm">{(accessResult.similarity_score * 100).toFixed(1)}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">LIVENESS RESULT</span>
                <strong className={accessResult.spoof_status === 'Real Face' ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'}>
                  {accessResult.spoof_status}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">EMOTION DETECTED</span>
                <strong className="text-purple-400 text-sm">{accessResult.emotion}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Live Access Event Feed Table */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Access Log Stream
              </span>
              <span className="text-xs font-mono text-cyan-400">{accessLogs.length} Events</span>
            </h3>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {accessLogs.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No access events logged yet.
                </div>
              ) : (
                accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      log.access_status === 'Granted'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {log.access_status === 'Granted' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        {log.user_name}
                      </div>
                      <div className="text-[10px] opacity-75 font-mono mt-0.5">
                        Spoof: {log.spoof_status} | Emotion: {log.emotion}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <div className="font-bold">{log.access_status}</div>
                      <div className="opacity-60">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Policy: Strict Liveness + FAISS</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
