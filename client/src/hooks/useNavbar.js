import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export const useNavbar = (spaceCode, usedBytes, totalBytes) => {
  const { theme, toggleTheme } = useTheme();

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb < 10 ? mb.toFixed(2) + ' MB' : mb.toFixed(1) + ' MB';
  };

  const percentage = Math.min((usedBytes / totalBytes) * 100, 100);
  
  let progressColor = "bg-emerald-600 shadow-sm"; 
  if (percentage > 90) progressColor = "bg-red-600 shadow-sm";
  else if (percentage > 75) progressColor = "bg-amber-600 shadow-sm";

  const copyCode = () => {
    navigator.clipboard.writeText(spaceCode);
    toast.success("Code copied!");
  };

  return {
    theme,
    toggleTheme,
    copyCode,
    formattedUsed: formatSize(usedBytes),
    formattedTotal: formatSize(totalBytes),
    percentage,
    progressColor
  };
};