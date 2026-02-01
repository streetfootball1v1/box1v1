import { useTimer } from '@/hooks/useTimer';
import type { TabId } from '@/types';

interface HeroSectionProps {
  onTabChange: (tab: TabId) => void;
}

export function HeroSection({ onTabChange }: HeroSectionProps) {
  const timer = useTimer();

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="pt-[calc(var(--box-nav-h)+60px)] pb-16" aria-label="Главная">
      <div className="max-w-[900px] mx-auto text-center px-5">
        {/* Product Label */}
        <span 
          className="block text-xs font-extrabold uppercase tracking-[0.2em] text-[#16a34a] mb-6 opacity-0 animate-[fadeInUp_0.6s_0.2s_forwards]"
        >
          Уличный футбол 1×1 • Медиа-лига • Сезон 2026
        </span>

        {/* Main Title */}
        <h1 
          className="text-[clamp(2.5rem,12vw,7rem)] leading-[0.9] mb-6 opacity-0 animate-[fadeInUp_0.6s_0.3s_forwards]"
        >
          BOX1V1
        </h1>

        {/* Product Description */}
        <p 
          className="text-[clamp(1rem,2.5vw,1.35rem)] text-[#374151] max-w-[480px] mx-auto mb-8 leading-relaxed opacity-0 animate-[fadeInUp_0.6s_0.4s_forwards]"
        >
          Медиа-лига, где каждый игрок — персонаж, каждый матч — контент, а рейтинг решает всё.
        </p>

        {/* Value Proposition */}
        <div 
          className="flex flex-wrap justify-center gap-4 mb-10 opacity-0 animate-[fadeInUp_0.6s_0.45s_forwards]"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[#374151]">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
            Следи за игроками
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#374151]">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
            Смотри матчи
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#374151]">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
            Участвуй сам
          </div>
        </div>

        {/* CTA Buttons */}
        <div 
          className="flex flex-wrap justify-center gap-4 mb-16 opacity-0 animate-[fadeInUp_0.6s_0.5s_forwards]"
        >
          <button 
            className="btn-primary"
            onClick={() => onTabChange('roster')}
          >
            Смотреть игроков
          </button>
          <button 
            className="btn-outline"
            onClick={() => onTabChange('howtojoin')}
          >
            Как попасть
          </button>
        </div>

        {/* Timer */}
        <div 
          className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-8 bg-white rounded-[100px] border border-[var(--box-border)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 md:px-12 py-6 md:py-7 opacity-0 animate-[fadeInUp_0.6s_0.6s_forwards]"
        >
          <span className="text-[13px] font-bold text-[#374151] uppercase tracking-[0.1em]">
            {timer.statusText}
          </span>
          {timer.isActive ? (
            <div className="flex gap-4 md:gap-6">
              <div className="text-center min-w-[50px] md:min-w-[60px]">
                <div className="text-[clamp(1.5rem,5vw,2.5rem)] font-black leading-none tabular-nums">
                  {formatNumber(timer.days)}
                </div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em] mt-1">
                  дн
                </div>
              </div>
              <div className="text-center min-w-[50px] md:min-w-[60px]">
                <div className="text-[clamp(1.5rem,5vw,2.5rem)] font-black leading-none tabular-nums">
                  {formatNumber(timer.hours)}
                </div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em] mt-1">
                  чс
                </div>
              </div>
              <div className="text-center min-w-[50px] md:min-w-[60px]">
                <div className="text-[clamp(1.5rem,5vw,2.5rem)] font-black leading-none tabular-nums">
                  {formatNumber(timer.mins)}
                </div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em] mt-1">
                  мин
                </div>
              </div>
              <div className="text-center min-w-[50px] md:min-w-[60px]">
                <div className="text-[clamp(1.5rem,5vw,2.5rem)] font-black leading-none tabular-nums">
                  {formatNumber(timer.secs)}
                </div>
                <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em] mt-1">
                  сек
                </div>
              </div>
            </div>
          ) : (
            <span className="text-2xl font-black text-[#22c55e]">СЕЗОН ОТКРЫТ!</span>
          )}
        </div>
      </div>
    </section>
  );
}
