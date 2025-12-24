import React from 'react';
import { Lock, FolderOpen, ArrowRight, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { useJoinSpace } from '../../hooks/useJoinSpace';

const JoinSpaceForm = () => {
  const { 
    code, setCode, 
    loading, 
    lockedData, setLockedData, 
    password, setPassword, 
    handleCreate, handleJoin, handleUnlock 
  } = useJoinSpace();

  if (lockedData) {
    return (
       <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
           <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 dark:border-amber-900/30">
             <Lock className="text-amber-600 dark:text-amber-500" size={32} />
           </div>
           <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Space Locked</h2>
           <p className="text-slate-500 dark:text-gray-400 mb-6">Enter password for space <span className="font-mono font-bold text-slate-900 dark:text-white">{lockedData.code}</span></p>
           
           <Input 
             type="password" 
             placeholder="Enter Password" 
             value={password} 
             onChange={e => setPassword(e.target.value)} 
             className="mb-4 text-center" 
             autoFocus
             onKeyDown={e => e.key === 'Enter' && handleUnlock()}
           />
           
           <div className="grid grid-cols-2 gap-3">
               <Button variant="secondary" onClick={() => setLockedData(null)}>Back</Button>
               <Button onClick={handleUnlock} disabled={loading}>{loading ? '...' : 'Unlock'}</Button>
           </div>
       </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-3">
              TempSpace
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-lg">Secure, ephemeral file sharing.</p>
        </div>

        <div className="space-y-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
                </div>
                <Input 
                   value={code} 
                   onChange={e => setCode(e.target.value.toUpperCase())} 
                   maxLength={4} 
                   placeholder="ENTER CODE (X7K9)" 
                   className="pl-12 text-center text-2xl font-mono tracking-[0.2em] font-bold text-slate-900 dark:text-white placeholder:tracking-normal placeholder:font-sans uppercase placeholder:text-slate-400" 
                   onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
            </div>

            <Button 
              onClick={() => handleJoin()} 
              disabled={code.length !== 4 || loading} 
              className="w-full py-4 text-lg"
              icon={ArrowRight}
            >
              {loading ? 'Joining...' : 'Join Space'}
            </Button>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-900 text-slate-400">or</span></div>
            </div>

            <Button 
              variant="secondary" 
              icon={FolderOpen} 
              onClick={handleCreate} 
              disabled={loading} 
              className="w-full py-3"
            >
              Create New Space
            </Button>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 dark:text-gray-600 flex items-center justify-center gap-2">
          <LinkIcon size={12} /> No signup required • Encrypted • Auto-deletes
        </p>
    </div>
  );
};
export default JoinSpaceForm;