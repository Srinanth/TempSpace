import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Zap, Lock, ArrowRight, FileText, Cookie, Github } from 'lucide-react';
import Layout from '../components/layout/layout';
import JoinSpaceForm from '../features/auth/join';

const LandingPage = () => {
  const { code } = useParams();
  
  const [showJoinForm, setShowJoinForm] = useState(!!code);

  if (showJoinForm) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
           <div className="w-full max-w-lg mb-4">
             <button 
               onClick={() => setShowJoinForm(false)}
               className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-2 transition-colors"
             >
               &larr; Back to Home
             </button>
           </div>
           
           <div className="w-full max-w-lg relative z-10">
              <JoinSpaceForm initialCode={code} />
           </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 border border-indigo-100 dark:border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
              No Sign-up Required
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-3xl">
            Share files instantly, <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-cyan-500">
              without a trace.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a temporary space. Upload files. Share the code.
            Everything is encrypted and destroyed automatically when the timer runs out.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => setShowJoinForm(true)}
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start Sharing <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setShowJoinForm(true)}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
            >
              Join Existing Space
            </button>
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50/50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why use TempSpace?</h2>
              <p className="text-slate-500 dark:text-slate-400">Built for privacy, speed, and simplicity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Zap} 
                title="Lightning Fast" 
                desc="Optimized high-performance uploads and downloads. Experience minimal latency regardless of file size."
              />
              <FeatureCard 
                icon={Lock} 
                title="End-to-End Encrypted" 
                desc="Your data is encrypted in transit. We don't read your files, and we don't sell your data."
              />
              <FeatureCard 
                icon={Shield} 
                title="Auto-Destruction" 
                desc="Spaces are temporary. Once the timer hits zero, every file and message is permanently wiped."
              />
            </div>
          </div>
        </section>

        <footer className="py-12 px-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            
            <div className="text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-2 flex items-center gap-2">
                <Shield size={20} className="text-indigo-500" /> TempSpace
              </p>
              <p>&copy; {new Date().getFullYear()} TempSpace. All rights reserved.</p>
              <p className="mt-2 text-xs opacity-70">Secure, temporary file sharing.</p>
              
              <div className="mt-4">
                 <a href="https://github.com/Srinanth/TempSpace" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github size={16} /> <span>Source Code</span>
                 </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-16">
              
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Legal</h4>
                <FooterLink href="/terms" icon={FileText} text="Terms" />
                <FooterLink href="/privacy" icon={Lock} text="Privacy" />
              </div>
              
              <div className="flex flex-col gap-3">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Safety</h4>
                <FooterLink href="/security" icon={Shield} text="Security" />
                <FooterLink href="/cookies" icon={Cookie} text="Cookies" />
              </div>

            </div>

          </div>
        </footer>

      </div>
    </Layout>
  );
};

const FooterLink = ({ href, icon: Icon, text }) => (
  <a 
    href={href} 
    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors group"
  >
    <Icon size={16} className="opacity-70 group-hover:opacity-100" />
    <span>{text}</span>
  </a>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default LandingPage;