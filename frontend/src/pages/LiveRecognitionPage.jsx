import React, { useState, useCallback } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import { recognitionAPI } from '../services/api';
import { Camera, ShieldCheck, UserCheck, UserX, Activity, Award, ShieldAlert } from 'lucide-react';

export default function LiveRecognitionPage() {
  const [recognitionResult, setRecognitionResult] = useState({
    face_detected: false,
    user_name: 'Scanning...',
    similarity_score: 0,
    confidence: 0,
    status: 'Scanning',
    bounding_box: null
  });

  const [recentLogs, setRecentLogs] = useState([]);

  const handleFrameCapture = useCallback(async (base64Frame) => {
    try {
      const res = await recognitionAPI.verifyFrame(base64Frame);
      const data = res.data;
      setRecognitionResult(data);

      if (data.face_detected && data.user_name !== 'Scanning...') {
        setRecentLogs((prev) => [
          {
            id: Date.now(),
            name: data.user_name,
            confidence: (data.confidence * 100).toFixed(1),
            status: data.status,
            time: new Date().toLocaleTimeString()
          },
          ...prev.slice(0, 7)
        ]);
      }
    } catch (err) {
      console.error("Recognition stream frame error:", err);
    }
  }, []);

  const isRecognized = recognitionResult.status === 'Recognized';
  const hasFace = recognitionResult.face_detected;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE FAISS VECTOR MATCHER
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Live Face Recognition</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time ArcFace 512-d feature extraction & FAISS vector identification</p>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`px-5 py-3 rounded-2xl glass-panel border flex items-center gap-3 transition-all duration-300 ${
          isRecognized ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' :
          hasFace ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' :
          'border-slate-800 bg-slate-900/60 text-slate-400'
        }`}>
          {isRecognized ? <UserCheck className="w-6 h-6 text-emerald-400 animate-bounce" /> :
           hasFace ? <ShieldAlert className="w-6 h-6 text-amber-400" /> :
           <UserX className="w-6 h-6 text-slate-500" />}
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase opacity-80">Recognition Status</div>
            <div className="font-bold text-base font-['Space_Grotesk']">
              {isRecognized ? 'RECOGNIZED USER' : hasFace ? 'UNKNOWN USER' : 'WAITING FOR FACE'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stream Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <WebcamFeed
            onFrameCapture={handleFrameCapture}
            boundingBox={recognitionResult.bounding_box}
            overlayText={hasFace ? `${recognitionResult.user_name} (${(recognitionResult.confidence*100).toFixed(0)}%)` : null}
            statusColor={isRecognized ? 'green' : hasFace ? 'red' : 'cyan'}
          />

          {/* Real-time Metric Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Target Identity</span>
              <div className="text-lg font-bold text-white mt-1 truncate font-['Space_Grotesk']">
                {recognitionResult.user_name || 'Searching...'}
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Cosine Similarity</span>
              <div className="text-lg font-bold text-cyan-400 mt-1 font-['Space_Grotesk']">
                {(recognitionResult.similarity_score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400">FAISS Match Rate</span>
              <div className="text-lg font-bold text-purple-400 mt-1 font-['Space_Grotesk']">
                {(recognitionResult.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Live Event Stream Log Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-200 text-sm flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Live Verification Feed
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {recentLogs.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  <Camera className="w-8 h-8 mx-auto text-slate-600 mb-2 animate-pulse" />
                  Streaming camera feed into ArcFace FAISS index...
                </div>
              ) : (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      log.status === 'Recognized'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{log.name}</div>
                      <div className="text-[10px] opacity-75 font-mono">{log.time}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold">{log.confidence}%</div>
                      <div className="text-[10px] uppercase tracking-wider">{log.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>ArcFace Threshold: 60.0%</span>
            <span className="text-cyan-400">FAISS Index Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
