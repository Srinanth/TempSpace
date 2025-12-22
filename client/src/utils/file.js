const MAX_FILE_SIZE = 50 * 1024 * 1024;

const BLOCKED_EXTENSIONS = [
    '.exe', '.msi', '.com', '.scr', '.pif', '.gadget',
    '.bat', '.cmd', '.vbs', '.vbe', '.wsf', '.wsc',
    '.bin',
];

export const validateFile = (file) => {
    if (!file) return "No file selected.";

    if (file.size > MAX_FILE_SIZE) {
        return `File too large. Limit is ${formatBytes(MAX_FILE_SIZE)}.`;
    }
    if (file.size === 0) {
        return "File is empty (0 bytes).";
    }
    const lowerName = file.name.toLowerCase();
    const isDangerous = BLOCKED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
    if (isDangerous) {
        return "Executables (.exe, .bat) are not allowed. Please zip them if necessary.";
    }
    const hasDoubleExtension = BLOCKED_EXTENSIONS.some(ext => lowerName.includes(ext + "."));
    if (hasDoubleExtension) {
        return "Suspicious file format detected (Double Extension).";
    }
    if (file.name.length > 255) {
        return "Filename is too long (Max 255 chars).";
    }
    return null;
};

export const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};