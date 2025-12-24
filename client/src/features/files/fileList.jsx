import { FileText, Download, Trash2, FileArchive, Image, Video, Music, Code, Eye } from 'lucide-react';
import { useFileList } from '../../hooks/useFileList';
import { formatBytes, formatDate } from '../../utils/file';
import Button from '../../components/ui/Button';

const getFileIcon = (mimeType) => {
    if (!mimeType) return FileText;
    if (mimeType.includes('image')) return Image;
    if (mimeType.includes('video')) return Video;
    if (mimeType.includes('audio')) return Music;
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return FileArchive;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return Code;
    return FileText;
};

const FileList = ({ refreshTrigger, onPreview }) => {
  const { files, loading, isAdmin, handleDownload, handleDelete } = useFileList(refreshTrigger);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
            <h2 className="font-bold text-slate-800 dark:text-gray-200">Files</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white dark:bg-white/10 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/5 shadow-sm">
              {files.length} Items
            </span>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-white/5">
            {files.map(f => {
                const Icon = getFileIcon(f.mime_type);
                const isImage = f.mime_type?.startsWith('image/');
                
                return (
                    <div key={f.id} className="group flex items-center p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 mr-4 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                           <Icon size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0 mr-4 cursor-pointer" onClick={() => isImage && onPreview(f)}>
                            <p className={`font-semibold truncate mb-0.5 ${isImage ? 'text-slate-900 dark:text-white hover:underline' : 'text-slate-700 dark:text-gray-200'}`}>
                                {f.filename}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                                <span>{formatDate(f.created_at)}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600"></span>
                                <span>{f.download_count} downloads</span>
                            </p>
                        </div>
                        
                        <div className="px-4 text-sm font-mono text-slate-500 dark:text-gray-500 hidden sm:block text-right min-w-20">
                           {formatBytes(f.size_bytes)}
                        </div>
                        
                        <div className="flex gap-2">
                            {isImage && (
                                <Button variant="ghost" icon={Eye} onClick={() => onPreview(f)} className="p-2 text-slate-600 hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-white/10" />
                            )}
                            <Button variant="ghost" icon={Download} onClick={() => handleDownload(f)} className="p-2 text-slate-600 hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-white/10" />
                            
                            {isAdmin && (
                                <Button variant="ghost" icon={Trash2} onClick={() => handleDelete(f.id)} className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20" />
                            )}
                        </div>
                    </div>
                );
            })}
            
            {!loading && files.length === 0 && (
                <div className="p-12 text-center">
                   <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                     <FileText className="text-slate-400 dark:text-gray-600" />
                   </div>
                   <p className="text-slate-500 dark:text-gray-400 font-medium">No files uploaded yet.</p>
                </div>
            )}
        </div>
    </div>
  );
};
export default FileList;