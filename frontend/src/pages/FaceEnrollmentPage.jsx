import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamFeed from '../components/WebcamFeed';
import { faceAPI } from '../services/api';
import { Camera, RefreshCw, Save, CheckCircle, AlertCircle, Cpu, Sparkles } from 'lucide-react';

export default function FaceEnrollmentPage() {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFrameCapture = (base64) => {
    setCurrentFrame(base64);
  };

  const handleCaptureSnapshot = () => {
    if (!currentFrame) return;
    if (capturedImages.length >= 5) {
      setErrorMsg("Maximum 5 face samples allowed per enrollment batch");
      return;
    }
    setCapturedImages((prev) => [...prev, currentFrame]);
    setErrorMsg(null);
  };

  const handleRetake = () => {
    setCapturedImages([]);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSaveEmbeddings = async () => {
    if (capturedImages.length === 0) {
      setErrorMsg("Please capture at least 1 face image before saving embeddings.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await faceAPI.enroll({ image_base64_list: capturedImages });
      setSuccessMsg(res.data.message || "Face embeddings saved & synced with FAISS vector index!");
      setTimeout(() => {
        navigate('/recognition');
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to save face embeddings. Please try capturing clearer faces.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-cyan-400 mb-2">
            <Cpu className="w-3.5 h-3.5" /> ARC-FACE ENROLLMENT MODULE
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Biometric Face Enrollment</h1>
          <p className="text-sm text-slate-400 mt-1">Capture 3-5 facial angles for optimal 512-dimensional vector indexing</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Webcam Feed */}
        <div className="lg:col-span-2 space-y-4">
          <WebcamFeed
            onFrameCapture={handleFrameCapture}
            statusColor="cyan"
            overlayText="ALIGNED FACE PREVIEW"
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCaptureSnapshot}
                disabled={capturedImages.length >= 5}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Camera className="w-4 h-4" /> Capture Snapshot ({capturedImages.length}/5)
              </button>

              <button
                onClick={handleRetake}
                className="px-4 py-3 rounded-xl font-medium text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retake
              </button>
            </div>

            <button
              onClick={handleSaveEmbeddings}
              disabled={loading || capturedImages.length === 0}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Embeddings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Captured Face Previews */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Captured Face Vectors
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">{capturedImages.length} / 5</span>
            </div>

            {capturedImages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-800 rounded-xl">
                <Camera className="w-10 h-10 text-slate-600 mb-2 animate-bounce" />
                <p className="text-xs text-slate-400">No face samples captured yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">Look directly into webcam and click "Capture Snapshot".</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {capturedImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-cyan-500/40 group">
                    <img src={img} alt={`Sample ${idx+1}`} className="w-full h-24 object-cover" />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                      Sample #{idx+1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-mono text-cyan-400 font-bold mb-1">ArcFace FAISS Sync Notice</div>
            <p>Upon clicking "Save Embeddings", ArcFace extracts 512 normalized spatial features and commits to vector search RAM.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
