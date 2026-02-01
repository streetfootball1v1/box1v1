import { useState, useEffect } from 'react';

const TARGET_DATE = new Date("March 1, 2026 00:00:00").getTime();

interface TimerState {
  days: number;
  hours: number;
  mins: number;
  secs: number;
  isActive: boolean;
  statusText: string;
}

export function useTimer(): TimerState {
  const [timeLeft, setTimeLeft] = useState<TimerState>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
    isActive: true,
    statusText: 'До старта сезона:'
  });

  useEffect(() => {
    function updateTimer() {
      const now = Date.now();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          mins: 0,
          secs: 0,
          isActive: false,
          statusText: 'Сезон открыт!'
        });
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft({
        days,
        hours,
        mins,
        secs,
        isActive: true,
        statusText: 'До старта сезона:'
      });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
