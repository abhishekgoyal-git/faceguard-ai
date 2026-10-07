import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WebcamFeed({ onFrameCapture, boundingBox, overlayText, statusColor = 'cyan', active = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [simulatedMode, setSimulatedMode] = useState(false);

  useEffect(() => {
    let stream = null;

    const startWebcam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreamActive(true);
            setErrorMsg(null);
          }
        } else {
          throw new Error("Webcam access not supported in browser");
        }
      } catch (err) {
        console.warn("Webcam access error, activating AI fallback simulator:", err);
        setSimulatedMode(true);
        setStreamActive(true);
      }
    };

    if (active) {
      startWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [active]);

  // Frame Capture Interval loop
  useEffect(() => {
    if (!active || !onFrameCapture) return;

    const interval = setInterval(() => {
      if (simulatedMode) {
        // Generate high quality synthetic portrait canvas base64 image for simulator
        const simCanvas = document.createElement('canvas');
        simCanvas.width = 400;
        simCanvas.height = 300;
        const ctx = simCanvas.getContext('2d');
        
        // Dark cyber background
        ctx.fillStyle = '#080c14';
        ctx.fillRect(0, 0, 400, 300);
        
        // Draw face shape
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(200, 150, 75, 95, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw eyes & nose & mouth
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(170, 130, 8, 0, 2 * Math.PI);
        ctx.arc(230, 130, 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(200, 155, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(200, 185, 30, 0, Math.PI);
        ctx.stroke();

        const base64Str = simCanvas.toDataURL('image/jpeg', 0.8);
        onFrameCapture(base64Str);
      } else if (videoRef.current && canvasRef.current && streamActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Str = canvas.toDataURL('image/jpeg', 0.85);
          onFrameCapture(base64Str);
        }
      }
    }, 700);

    return () => clearInterval(interval);
  }, [active, streamActive, simulatedMode, onFrameCapture]);

  const borderColors = {
    cyan: 'border-cyan-500 shadow-cyan-500/30',
    green: 'border-emerald-500 shadow-emerald-500/30',
    red: 'border-red-500 shadow-red-500/30',
    purple: 'border-purple-500 shadow-purple-500/30',
  };

  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border-2 ${borderColors[statusColor] || borderColors.cyan} transition-all duration-300`}>
      {/* Real Video Stream */}
      {!simulatedMode ? (
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Synthetic AI Simulator Feed */
        <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          
          {/* Animated Face Target Avatar */}
          <div className="relative w-48 h-56 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center animate-pulse">
            <div className="w-36 h-44 rounded-full bg-cyan-950/40 border border-cyan-500/40 flex flex-col items-center justify-center gap-3">
              <div className="flex gap-8">
                <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
                <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="w-2 h-4 bg-purple-400 rounded-full" />
              <div className="w-12 h-2 bg-emerald-400 rounded-full" />
            </div>
          </div>

          <span className="mt-4 text-xs font-mono text-cyan-400 tracking-widest uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/30 z-10">
            [ AI Simulated Stream Active ]
          </span>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Futuristic Scan Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-lg shadow-cyan-400 z-10" />
      <div className="absolute inset-0 scanline-overlay pointer-events-none z-10" />

      {/* Bounding Box Render Overlay */}
      {boundingBox && (
        <div
          className={`absolute border-2 rounded-lg pointer-events-none transition-all duration-300 z-20 ${
            statusColor === 'green' ? 'border-emerald-400 shadow-emerald-400/50 bg-emerald-500/10' :
            statusColor === 'red' ? 'border-red-500 shadow-red-500/50 bg-red-500/10' :
            'border-cyan-400 shadow-cyan-400/50 bg-cyan-500/10'
          }`}
          style={{
            left: `${(boundingBox.x / 640) * 100}%`,
            top: `${(boundingBox.y / 480) * 100}%`,
            width: `${(boundingBox.width / 640) * 100}%`,
            height: `${(boundingBox.height / 480) * 100}%`,
          }}
        >
          {/* Box Corner Targets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />

          {/* Overlay Text Tag */}
          {overlayText && (
            <div className="absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-slate-900/90 text-white border border-cyan-400/40 whitespace-nowrap">
              {overlayText}
            </div>
          )}
        </div>
      )}

      {/* Stream Controls / Status Badge */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${streamActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          {streamActive ? 'RECOG-STREAM ONLINE' : 'STREAM OFFLINE'}
        </div>

        {simulatedMode && (
          <button
            onClick={() => setSimulatedMode(false)}
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Retry WebCam
          </button>
        )}
      </div>
    </div>
  );
}
