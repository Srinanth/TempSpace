import { Clock, Zap, Trash2, Download, X, Shield, Calendar, Link, LogOut } from 'lucide-react';
import Layout from '../components/layout/layout';
import Navbar from '../components/layout/navbar';
import UploadZone from '../features/files/upload';
import FileList from '../features/files/fileList';
import SettingsModal from '../features/space/settings';
import ConfirmModal from '../components/ui/confirm';
import Button from '../components/ui/Button';
import LoadingScreen from '../components/ui/LoadingScreen';
import { useSpaceDashboard } from '../hooks/useSpaceDashboard';
import { timeAgo } from '../utils/time';

const SpaceDashboard = () => {
  const {
    space, isAdmin, timeLeft,
    refreshSpace, setRefreshFileTrigger, refreshFileTrigger,
    showSettings, setShowSettings,
    activeModal, setActiveModal,
    previewFile, previewUrl,
    logout,
    handleCopyLink, handleDownloadAll, handleExtend, 
    handleDeleteAllFiles, handleDeleteSpace,
    handlePreview, closePreview
  } = useSpaceDashboard();

  if (!space) return <LoadingScreen message="Retrieving Space Data..." />;

  return (
    <Layout>
       <Navbar 
          spaceCode={space.share_code}
          usedBytes={space.total_size_bytes}
          totalBytes={50 * 1024 * 1024}
          onExit={logout}
          onSettings={isAdmin ? () => setShowSettings(true) : null}
       />

       <main className="container mx-auto px-3 md:px-6 py-4 md:py-8 grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <div className="bg-white/90 dark:bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                     <div className="text-[10px] md:text-xs text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Total Files</div>
                     <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{space.file_count || 0}</div>
                 </div>
                 <div className="bg-white/90 dark:bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                     <div className="text-[10px] md:text-xs text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Time Left</div>
                     <div className="text-lg md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{timeLeft || "..."}</div>
                 </div>
                 <div className="bg-white/90 dark:bg-slate-900/60 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                     <div className="text-[10px] md:text-xs text-slate-500 dark:text-gray-400 uppercase font-bold tracking-wider">Active Users</div>
                     <div className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">{space.visit_count || 1}</div>
                 </div>
             </div>

             <UploadZone 
                onUploadComplete={() => { refreshSpace(); setRefreshFileTrigger(p => p+1); }} 
                disabled={!isAdmin && !space.settings.public_upload}
             />
             
             <FileList refreshTrigger={refreshFileTrigger} onPreview={handlePreview} />
          </div>

          <div className="space-y-4 md:space-y-6">
              
              <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                  <div className="p-3 md:p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Space Details</h3>
                  </div>
                  <div className="p-2">
                      <div className="flex items-center justify-between p-2.5 md:p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 md:gap-3 text-slate-600 dark:text-gray-400 min-w-0">
                              <Clock size={16} className="shrink-0" />
                              <span className="text-xs md:text-sm font-medium truncate">Created</span>
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap">
                              {timeAgo(space.created_at)}
                          </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 md:p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 md:gap-3 text-slate-600 dark:text-gray-400 min-w-0">
                              <Calendar size={16} className="shrink-0" />
                              <span className="text-xs md:text-sm font-medium truncate">Expires</span>
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-gray-200 whitespace-nowrap">
                             {new Date(space.expires_at).toLocaleDateString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                          </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 md:p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 md:gap-3 text-slate-600 dark:text-gray-400 min-w-0">
                              <Shield size={16} className="shrink-0" />
                              <span className="text-xs md:text-sm font-medium truncate">Security</span>
                          </div>
                          <span className={`text-[10px] md:text-sm font-bold px-2 py-0.5 rounded ${space.settings.password_protected ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                              {space.settings.password_protected ? 'LOCKED' : 'OPEN'}
                          </span>
                      </div>
                      
                      {isAdmin && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5">
                            <button 
                                onClick={() => setActiveModal('DELETE_SPACE')}
                                className="w-full flex items-center justify-between p-2.5 md:p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors group"
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <LogOut size={16} className="shrink-0" />
                                    <span className="text-xs md:text-sm font-medium">Delete Space</span>
                                </div>
                                <X size={16} className="opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                      )}
                  </div>
              </div>

              <div className="bg-white/90 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                      <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Quick Actions</h3>
                  </div>
                  <div className="p-3 md:p-4 space-y-3">
                      <Button variant="secondary" icon={Link} onClick={handleCopyLink} className="w-full justify-start text-xs md:text-sm h-auto min-h-10 py-2">
                          Copy Link
                      </Button>

                      <Button variant="secondary" icon={Download} onClick={handleDownloadAll} className="w-full justify-start text-xs md:text-sm h-auto min-h-10 py-2">
                          Download All
                      </Button>
                      
                      {isAdmin && (
                        <>
                          <Button 
                            variant="secondary" 
                            icon={Zap} 
                            onClick={() => setActiveModal('EXTEND')} 
                            className="w-full justify-start text-xs md:text-sm h-auto min-h-10 py-2 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          >
                              <div className="flex w-full justify-between items-center">
                                  <span>Extend (+24h)</span>
                                  <span className="opacity-70 text-[10px] font-mono ml-1">[{space.extend_count || 0}/3]</span>
                              </div>
                          </Button>
                          
                          <Button 
                            variant="danger" 
                            icon={Trash2} 
                            onClick={() => setActiveModal('DELETE_FILES')} 
                            className="w-full justify-start text-xs md:text-sm h-auto min-h-10 py-2"
                          >
                              Delete All Files
                          </Button>
                        </>
                      )}
                  </div>
              </div>
          </div>
       </main>

       
       {previewFile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 backdrop-blur-sm" onClick={closePreview}>
             <button onClick={closePreview} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50">
                <X size={20} />
             </button>
             <img src={previewUrl} alt="Preview" className="max-w-full max-h-[80vh] md:max-h-[85vh] rounded-lg shadow-2xl object-contain border border-white/10" onClick={e => e.stopPropagation()} />
             <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-4 md:px-6 py-2 rounded-full text-white text-xs md:text-sm backdrop-blur-md border border-white/20 whitespace-nowrap max-w-[90%] truncate">
                {previewFile.filename}
             </div>
         </div>
       )}

       {isAdmin && (
         <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} settings={space.settings} onUpdate={refreshSpace} />
       )}

       <ConfirmModal 
         isOpen={activeModal === 'EXTEND'}
         onClose={() => setActiveModal(null)}
         onConfirm={handleExtend}
         title="Extend Expiry"
         message="Add 24 hours to space duration."
         confirmText="Extend (+24h)"
       />

       <ConfirmModal 
         isOpen={activeModal === 'DELETE_FILES'}
         onClose={() => setActiveModal(null)}
         onConfirm={handleDeleteAllFiles}
         title="Delete All Files?"
         message="This action cannot be undone."
         confirmText="Delete All"
         isDangerous={true}
       />
       
       <ConfirmModal 
         isOpen={activeModal === 'DELETE_SPACE'}
         onClose={() => setActiveModal(null)}
         onConfirm={handleDeleteSpace}
         title="Delete Space?"
         message="Destroy space and disconnect users."
         confirmText="Delete Space"
         isDangerous={true}
       />

    </Layout>
  );
};
export default SpaceDashboard;