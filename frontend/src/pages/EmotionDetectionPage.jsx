import React, { useState, useCallback } from 'react';
import WebcamFeed from '../components/WebcamFeed';
import { emotionAPI } from '../services/api';
import { Smile, Activity, Heart, Sparkles, BarChart2 } from 'lucide-react';

export default function EmotionDetectionPage() {
  const [emotionData, setEmotionData] = useState({
    face_detected: false,
    dominant_emotion: 'Neutral',
    emoji: '😐',
    confidence: 0.85,
    probabilities: {
      Happy: 0.15,
      Neutral: 0.70,
      Surprise: 0.05,
      Sad: 0.04,
      Angry: 0.02,
      Fear: 0.02,
      Disgust: 0.02
    }
  });

  const handleFrameCapture = useCallback(async (base64Frame) => {
    try {
      const res = await emotionAPI.analyzeEmotion(base64Frame);
      setEmotionData(res.data);
    } catch (err) {
      console.error("Emotion analysis error:", err);
    }
  }, []);

  const emotionsList = [
    { name: 'Happy', emoji: '😊', color: 'from-emerald-500 to-teal-400' },
    { name: 'Neutral', emoji: '😐', color: 'from-cyan-500 to-blue-400' },
    { name: 'Surprise', emoji: '😲', color: 'from-amber-400 to-yellow-500' },
    { name: 'Sad', emoji: '😢', color: 'from-blue-500 to-indigo-500' },
    { name: 'Angry', emoji: '😡', color: 'from-red-500 to-rose-600' },
    { name: 'Fear', emoji: '😨', color: 'from-purple-500 to-violet-600' },
    { name: 'Disgust', emoji: '🤢', color: 'from-lime-500 to-emerald-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-amber-400 mb-2">
            <Smile className="w-3.5 h-3.5" /> FER+ FACIAL EXPRESSION NEURAL MODEL
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Facial Emotion Analysis</h1>
          <p className="text-sm text-slate-400 mt-1">Multi-class expression classification tracking 7 human emotional states</p>
        </div>

        <div className="px-6 py-3 rounded-2xl glass-panel border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-4">
          <span className="text-4xl animate-bounce">{emotionData.emoji}</span>
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase opacity-80">Dominant Expression</div>
            <div className="font-bold text-lg font-['Space_Grotesk'] capitalize">
              {emotionData.dominant_emotion} ({(emotionData.confidence * 100).toFixed(0)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <WebcamFeed
            onFrameCapture={handleFrameCapture}
            statusColor="purple"
            overlayText={`EMOTION: ${emotionData.emoji} ${emotionData.dominant_emotion}`}
          />
        </div>

        {/* Emotion Probabilities Graph */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                Expression Spectrum Graph
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-3">
              {emotionsList.map((item) => {
                const prob = emotionData.probabilities[item.name] || 0.05;
                const percentage = Math.round(prob * 100);
                const isDominant = emotionData.dominant_emotion === item.name;

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`flex items-center gap-2 ${isDominant ? 'font-bold text-amber-300' : 'text-slate-400'}`}>
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </span>
                      <span className={`font-bold ${isDominant ? 'text-amber-300' : 'text-slate-500'}`}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${item.color}`}
                        style={{ width: `${Math.max(4, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <span className="text-amber-400 font-bold">FER Classifier Active</span>
            <p className="mt-0.5 text-slate-500">Softmax confidence normalization evaluated across facial muscle geometry keypoints.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
