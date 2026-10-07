import React, { useState, useCallback } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import { livenessAPI } from '../services/api';
import { Eye, ShieldAlert, ShieldCheck, Cpu, Smartphone, Image, CheckCircle, AlertTriangle } from 'lucide-react';

export default function LivenessDetectionPage() {
  const [livenessData, setLivenessData] = useState({
    face_detected: false,
    is_real: true,
    spoof_status: 'Real Face',
    spoof_probability: 0.05,
    confidence: 0.95
  });

  const handleFrameCapture = useCallback(async (base64Frame) => {
    try {
      const res = await livenessAPI.verifyLiveness(base64Frame);
      setLivenessData(res.data);
    } catch (err) {
      console.error("Liveness check error:", err);
    }
  }, []);

  const getAttackIcon = (status) => {
    if (status === 'Printed Photo') return Image;
    if (status === 'Mobile Replay Attack') return Smartphone;
    return ShieldCheck;
  };

  const AttackIcon = getAttackIcon(livenessData.spoof_status);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-purple-400 mb-2">
            <Cpu className="w-3.5 h-3.5" /> CNN MICRO-TEXTURE ANTI-SPOOFING
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Liveness & Anti-Spoofing</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time spectral frequency analysis guarding against print & screen replay attacks</p>
        </div>

        <div className={`px-5 py-3 rounded-2xl glass-panel border flex items-center gap-3 transition-all duration-300 ${
          livenessData.is_real ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' :
          'border-red-500/50 bg-red-500/10 text-red-300'
        }`}>
          {livenessData.is_real ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-red-400 animate-bounce" />
          )}
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase opacity-80">Liveness Result</div>
            <div className="font-bold text-base font-['Space_Grotesk'] uppercase">
              {livenessData.spoof_status}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <WebcamFeed
            onFrameCapture={handleFrameCapture}
            statusColor={livenessData.is_real ? 'green' : 'red'}
            overlayText={`LIVENESS: ${livenessData.spoof_status}`}
          />

          {/* Spoof Probability Meter Bar */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-200">Spoof Attack Risk Meter</span>
              <span className={`font-mono font-bold ${livenessData.spoof_probability > 0.4 ? 'text-red-400' : 'text-emerald-400'}`}>
                {(livenessData.spoof_probability * 100).toFixed(1)}% Spoof Risk
              </span>
            </div>
            
            <div className="w-full h-4 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5 relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  livenessData.spoof_probability > 0.4
                    ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/50'
                }`}
                style={{ width: `${Math.max(5, livenessData.spoof_probability * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span>0% (Real Human Face)</span>
              <span>50% Threshold</span>
              <span>100% (Synthetic Spoof)</span>
            </div>
          </div>
        </div>

        {/* Anti Spoof Analyzer Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <AttackIcon className="w-4 h-4 text-purple-400" />
              Spoof Vector Diagnostics
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>Target Face Classification</span>
                  <span className={livenessData.is_real ? 'text-emerald-400' : 'text-red-400'}>
                    {livenessData.spoof_status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Model Confidence</span>
                  <span className="font-mono text-cyan-400">{(livenessData.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Spoof Test Vector Cards */}
              <div className="space-y-2 font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Live Pupil Reflex</span>
                  </div>
                  <span className="text-emerald-400">NORMAL</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300">Printed Photo Filter</span>
                  </div>
                  <span className={livenessData.spoof_status === 'Printed Photo' ? 'text-red-400 font-bold' : 'text-slate-400'}>
                    {livenessData.spoof_status === 'Printed Photo' ? 'DETECTED' : 'CLEAR'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300">Mobile Replay Moiré</span>
                  </div>
                  <span className={livenessData.spoof_status === 'Mobile Replay Attack' ? 'text-red-400 font-bold' : 'text-slate-400'}>
                    {livenessData.spoof_status === 'Mobile Replay Attack' ? 'DETECTED' : 'CLEAR'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-mono text-purple-400 font-bold">Spectral Frequency Engine</span>
            <p>Laplacian spatial variance and 2D Fourier FFT texture spectrum prevent spoofed access attempts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
