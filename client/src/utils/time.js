import { useState, useEffect } from 'react';

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const distance = new Date(targetDate) - new Date();

      if (distance < 0) {
        setTimeLeft("Expired");
        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60));
      
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    calculate();
    
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};