import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Cpu, Database, Lock, CheckCircle2, ArrowRight, Zap, Scan, Layers, Activity, Mail, Send } from 'lucide-react';

export default function LandingPage() {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const features = [
    {
      icon: Eye,
      title: 'RetinaFace Detection',
      desc: 'High-precision facial landmark localization, alignment, and sub-millisecond bounding box cropping.',
      color: 'cyan'
    },
    {
      icon: Shield,
      title: 'ArcFace Embeddings',
      desc: 'Generates 512-dimensional normalized facial vectors matching against FAISS similarity indices.',
      color: 'purple'
    },
    {
      icon: Scan,
      title: 'Anti-Spoofing Liveness',
      desc: 'Deep texture & frequency spectrum analysis shielding against printed photos and mobile replay attacks.',
      color: 'green'
    },
    {
      icon: Activity,
      title: 'FER Emotion Classifier',
      desc: 'Real-time multi-class facial expression detection for 7 core human emotion dynamics.',
      color: 'amber'
    },
    {
      icon: Lock,
      title: 'Access Control Gateway',
      desc: 'Automated 9-step decision engine enforcing immediate Grant/Deny policies with full audit trails.',
      color: 'cyan'
    },
    {
      icon: Database,
      title: 'FAISS Vector Index',
      desc: 'Sub-millisecond high-dimensional vector search engine processing thousands of enrolled identities.',
      color: 'purple'
    }
  ];

  const techStack = [
    { name: 'React 18 & Vite', category: 'Frontend Architecture', color: 'border-cyan-500/40 text-cyan-300' },
    { name: 'FastAPI Python', category: 'High-Speed Backend', color: 'border-emerald-500/40 text-emerald-300' },
    { name: 'ArcFace & RetinaFace', category: 'Deep Neural Networks', color: 'border-purple-500/40 text-purple-300' },
    { name: 'FAISS Vector DB', category: 'Nearest Neighbor Search', color: 'border-cyan-500/40 text-cyan-300' },
    { name: 'OpenCV & PyTorch', category: 'Computer Vision Core', color: 'border-amber-500/40 text-amber-300' },
    { name: 'PostgreSQL & SQLAlchemy', category: 'Relational Store', color: 'border-blue-500/40 text-blue-300' }
  ];

  const handleSubmitContact = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow background accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>NEXT-GEN AI BIOMETRIC ACCESS CONTROL</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight max-w-4xl"
        >
          Zero-Trust Biometric Security Powered by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
            FaceGuard AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Combining RetinaFace detection, ArcFace 512-d embeddings, FAISS vector search, Anti-Spoofing liveness, and Emotion recognition into a single unified security platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/recognition"
            className="px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-2 group"
          >
            Launch Live Recognition
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl font-semibold text-base glass-panel border border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all"
          >
            Register Profile
          </Link>
        </motion.div>

        {/* Hero Interactive Scanning Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-4xl glass-panel rounded-3xl p-4 border border-cyan-500/30 shadow-2xl relative group"
        >
          <div className="relative aspect-video rounded-2xl bg-slate-900/90 overflow-hidden flex items-center justify-center border border-slate-800">
            {/* Scanline */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-lg shadow-cyan-400 animate-scan" />

            {/* Simulated Face Vector Matrix */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-40 h-48 rounded-full border-2 border-cyan-400/80 p-2 flex items-center justify-center shadow-lg shadow-cyan-500/40 relative">
                <div className="w-full h-full rounded-full border border-dashed border-purple-400 flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-6">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <div className="w-8 h-1 bg-emerald-400" />
                </div>
                {/* Target Corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
              </div>

              <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-cyan-500/40 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Identity: <strong className="text-cyan-300">Verified User</strong></span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Similarity: <strong className="text-emerald-400">98.7%</strong></span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Liveness: <strong className="text-purple-400">REAL</strong></span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">System Core Capabilities</h2>
          <p className="mt-3 text-slate-400">Powered by state-of-the-art Deep Neural Architectures</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 glass-panel-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">{feat.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Enterprise AI Tech Stack</h2>
            <p className="mt-2 text-slate-400">Production-ready stack designed for microsecond vector query scalability</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className={`p-4 rounded-xl glass-panel border ${tech.color} text-center flex flex-col items-center justify-center`}>
                <span className="font-bold text-sm">{tech.name}</span>
                <span className="text-[11px] text-slate-400 mt-1">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">About FaceGuard AI</span>
            <h2 className="text-3xl font-bold text-white font-['Space_Grotesk'] mt-2">
              Next-Generation Facial Recognition & Multi-Tier Access Control
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed text-sm">
              FaceGuard AI is an advanced security ecosystem engineered to solve real-world physical and digital security vulnerabilities. Traditional access control cards or simple face detection systems can be bypassed with high-resolution photos or screen replays.
            </p>
            <p className="mt-3 text-slate-400 leading-relaxed text-sm">
              FaceGuard AI integrates RetinaFace landmark detection with ArcFace 512-dimensional hyper-sphere embeddings, combined with dual-tier anti-spoofing micro-frequency checks and FER+ emotion tracking to ensure only real, authorized individuals are granted entry.
            </p>
            
            <div className="mt-6 space-y-3">
              {['Real-time webcam stream processing', 'FAISS 512-d cosine vector indexing', 'Anti-spoofing print & screen replay filter', 'Automated attendance logging & analytics'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/20 bg-slate-900/60 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Automated Decision Pipeline</h3>
                <p className="text-xs text-slate-400">9-Step Autonomous Verification Workflow</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">1. Webcam Frame Capture</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">2. RetinaFace Alignment</span>
                <span className="text-emerald-400">ALIGNED</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">3. ArcFace FAISS Search</span>
                <span className="text-cyan-400">98.4% SIMILARITY</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">4. CNN Anti-Spoof Liveness</span>
                <span className="text-purple-400">REAL FACE</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex justify-between font-bold text-emerald-300">
                <span>5. Decision Logic Output</span>
                <span>ACCESS GRANTED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-900/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white font-['Space_Grotesk']">Get In Touch</h2>
            <p className="mt-2 text-slate-400 text-sm">Have questions regarding deployment, custom models, or enterprise licensing?</p>
          </div>

          <form onSubmit={handleSubmitContact} className="glass-panel p-8 rounded-3xl border border-cyan-500/20 space-y-5">
            {contactSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm text-center">
                Thank you! Your message has been sent to our AI engineering team.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
              <textarea
                rows="4"
                required
                placeholder="Inquire about custom FaceGuard AI integration..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 FaceGuard AI Access Control Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
