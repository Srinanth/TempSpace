import React, { useState } from 'react';
import Layout from '../components/layout/layout';
import Navbar from '../components/layout/navbar';
import UploadZone from '../features/files/upload';
import FileList from '../features/files/fileList';
import SettingsModal from '../features/space/settings';
import { useAuth } from '../context/auth';
import { useSpace } from '../hooks/useSpace';

const SpaceDashboard = () => {
  const { session, logout } = useAuth();
  const { space, refreshSpace } = useSpace();
  const [showSettings, setShowSettings] = useState(false);
  const [refreshFileTrigger, setRefreshFileTrigger] = useState(0);

  const handleUploadComplete = () => {
      refreshSpace(); // Update storage usage
      setRefreshFileTrigger(prev => prev + 1); // Reload list
  };

  if (!space) return <Layout><div className="text-white p-10">Loading Space...</div></Layout>;

  return (
    <Layout>
       <Navbar 
          spaceCode={space.share_code}
          usedBytes={space.total_size_bytes}
          totalBytes={50 * 1024 * 1024}
          onExit={logout}
          onSettings={session.role === 'ADMIN' ? () => setShowSettings(true) : null}
       />

       <main className="container mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <UploadZone 
                onUploadComplete={handleUploadComplete} 
                disabled={session.role !== 'ADMIN' && !space.settings.public_upload}
             />
             <FileList refreshTrigger={refreshFileTrigger} />
          </div>
          <div className="space-y-6">
              {/* Space Info / Stats Panel could go here using SpaceHeader if needed */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Space Info</h3>
                  <div className="flex justify-between text-gray-200 mb-2"><span>Status</span> <span className="text-emerald-400">Active</span></div>
                  <div className="flex justify-between text-gray-200"><span>Expires</span> <span>24 Hours</span></div>
              </div>
          </div>
       </main>

       {session.role === 'ADMIN' && (
         <SettingsModal 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
            settings={space.settings}
            onUpdate={refreshSpace}
         />
       )}
    </Layout>
  );
};
export default SpaceDashboard;