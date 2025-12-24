import { Globe, Shield, Lock } from 'lucide-react';
import Modal from '../../components/ui/modal';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import ConfirmModal from '../../components/ui/confirm';
import { useSettings } from '../../hooks/useSettings';

const SettingsModal = ({ isOpen, onClose, settings, onUpdate }) => {
  const {
    view, setView,
    passwordInput, setPasswordInput,
    loading,
    showRemoveConfirm, setShowRemoveConfirm,
    handleClose,
    handleTogglePublic,
    onPasswordToggleClick,
    handleRemovePassword,
    handleSubmitPassword
  } = useSettings(settings, onUpdate, onClose);

  return (
    <>
        <Modal isOpen={isOpen} onClose={handleClose} title={view === 'MENU' ? "Space Settings" : "Set Password"}>
            {view === 'MENU' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 shadow-sm"><Globe size={20} /></div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-gray-100">Public Uploads</div>
                                <div className="text-xs text-slate-500">Allow guests to upload files</div>
                            </div>
                        </div>
                        <Toggle checked={settings?.public_upload} onChange={handleTogglePublic} />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 shadow-sm"><Shield size={20} /></div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-gray-100">Password Protection</div>
                                <div className="text-xs text-slate-500">Require password to join</div>
                            </div>
                        </div>
                        <div onClick={onPasswordToggleClick}>
                            <Toggle checked={settings?.password_protected} readOnly />
                        </div>
                    </div>
                </div>
            )}

            {view === 'PASSWORD_INPUT' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-200">
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        Enter a password to lock this space.
                    </p>
                    
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            autoFocus
                            type="password"
                            autoComplete="new-password"
                            placeholder="New Password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="pl-10"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitPassword()}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setView('MENU')} className="flex-1">Back</Button>
                        <Button onClick={handleSubmitPassword} disabled={loading} className="flex-1">
                            {loading ? 'Locking...' : 'Set Password'}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>

        <ConfirmModal 
            isOpen={showRemoveConfirm}
            onClose={() => setShowRemoveConfirm(false)}
            onConfirm={handleRemovePassword}
            title="Remove Password?"
            message="This will make the space accessible to anyone with the share code."
            confirmText="Remove Protection"
            isDangerous={true}
        />
    </>
  );
};

export default SettingsModal;