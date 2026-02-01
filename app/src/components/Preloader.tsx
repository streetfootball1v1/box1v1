import { useState, useEffect } from 'react';

interface PreloaderProps {
  onLoaded?: () => void;
}

export function Preloader({ onLoaded }: PreloaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      onLoaded?.();
    }, 800);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 bg-[#fafafa] z-[9999] flex justify-center items-center transition-all duration-500 ${
        loaded ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
      }`}
      role="status"
      aria-label="Загрузка"
    >
      <div className="text-center px-5">
        <div className="text-[clamp(2rem,8vw,3rem)] font-black italic tracking-tight mb-6 animate-[pulse_2s_infinite]">
          BOX<span className="text-[#22c55e]">1</span>V1
        </div>
        <div className="w-40 h-[3px] bg-black/5 rounded-full overflow-hidden mx-auto relative">
          <div className="absolute -left-1/2 w-1/2 h-full bg-[#0a0a0a] animate-[load_1.2s_infinite_ease-in-out] rounded-full" />
        </div>
      </div>
    </div>
  );
}
