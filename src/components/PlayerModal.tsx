import { useEffect, useRef, useCallback } from 'react';
import { X, Download, Share2, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { Player } from '@/types';

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}

const statDefs: Record<string, string> = {
  'DRI': 'Техника контроля мяча и ведения дриблинга',
  'SPD': 'Стартовый рывок и скорость перемещения',
  'SHT': 'Мощность и точность завершающего удара',
  'PHY': 'Физическая мощь, борьба и атлетизм',
  'REF': 'Молниеносная реакция на удары в упор',
  'DIV': 'Дальность прыжка и охват створа ворот',
  'HAN': 'Надежность фиксации и отражения мяча',
  'POS': 'Грамотный выбор позиции в створе ворот'
};

export function PlayerModal({ player, isOpen, onClose, onToast }: PlayerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Animate stat bars
  useEffect(() => {
    if (!isOpen || !player) return;

    const timer = setTimeout(() => {
      const bars = document.querySelectorAll<HTMLElement>('[data-stat-bar]');
      bars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) bar.style.width = width;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, player]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !player) return;

    try {
      onToast('Создаём карточку...');

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      if (!blob) throw new Error('Canvas to Blob failed');

      const file = new File([blob], `BOX1V1_${player.name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.png`, { type: 'image/png' });

      // Try Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `BOX1V1 ${player.name}`, text: 'Карточка игрока' });
          onToast('Готово!');
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BOX1V1_${player.name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      onToast('Карточка сохранена!');
    } catch (error) {
      console.error('Download error:', error);
      onToast('Ошибка при создании карточки');
    }
  }, [player, onToast]);

  const handleShare = useCallback(async () => {
    if (!player) return;

    const url = `${window.location.origin}#stats?player=${player.name.replace(/\s+/g, '-').toLowerCase()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `BOX1V1 | ${player.name}`,
          text: `Карточка атлета ${player.name} в системе BOX1V1`,
          url: url
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') onToast('Ошибка при отправке');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        onToast('Ссылка скопирована');
      } catch {
        onToast('Не удалось скопировать ссылку');
      }
    }
  }, [player, onToast]);

  const handleCopyID = useCallback(async () => {
    if (!player) return;
    try {
      await navigator.clipboard.writeText(player.name);
      onToast('ID скопирован');
    } catch {
      onToast('Не удалось скопировать');
    }
  }, [player, onToast]);

  if (!isOpen || !player) return null;

  const isGK = player.role === 'Вратарь';
  const stats = [
    { key: isGK ? 'REF' : 'DRI', value: player.drib },
    { key: isGK ? 'DIV' : 'SPD', value: player.speed },
    { key: isGK ? 'HAN' : 'SHT', value: player.shot },
    { key: isGK ? 'POS' : 'PHY', value: player.phys }
  ];

  return (
    <div
      className="fixed inset-0 bg-white/80 backdrop-blur-2xl z-[3000] flex justify-center items-center p-4 md:p-5 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-name"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-[520px] rounded-[32px] p-6 md:p-12 relative max-h-[90vh] max-h-[90dvh] overflow-y-auto shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-[var(--box-border)] animate-[fadeInUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header Buttons */}
        <div className="absolute top-4 right-4 left-4 flex justify-between z-10">
          <button
            onClick={handleDownload}
            className="w-11 h-11 rounded-full bg-black/[0.03] border border-[var(--box-border)] flex items-center justify-center text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] hover:scale-110 transition-all"
            aria-label="Скачать карточку игрока"
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-black/[0.03] flex items-center justify-center text-[#374151] hover:bg-black/[0.08] hover:text-[#0a0a0a] hover:rotate-90 transition-all"
            aria-label="Закрыть карточку игрока"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Card Content for Screenshot */}
        <div ref={cardRef} className="bg-white pt-12">
          {/* Player Image */}
          <div className="w-full aspect-square max-h-[280px] md:max-h-[320px] rounded-[20px] overflow-hidden bg-gradient-to-r from-[#f0f0f0] via-[#e8e8e8] to-[#f0f0f0] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] mb-8">
            <img
              src={player.photo}
              alt={`Фото ${player.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <span
                id="player-role"
                className="inline-block text-[11px] font-extrabold uppercase text-[#16a34a] bg-[#22c55e]/10 px-4 py-2 rounded-full mb-3 tracking-[0.1em]"
              >
                {player.role}
              </span>
              <h2
                id="player-name"
                className="text-[clamp(1.5rem,5vw,2.5rem)] font-black italic leading-tight break-words"
              >
                {player.name}
              </h2>
              {player.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {player.badges.map(badge => (
                    <span
                      key={badge}
                      className="text-[10px] font-extrabold bg-[#0a0a0a] text-white px-3 py-1.5 rounded-full uppercase tracking-wide"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-[clamp(2rem,6vw,3.5rem)] font-black italic leading-none tracking-tight text-[#0a0a0a] flex-shrink-0">
              {player.ovr}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.key} className="relative">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div
                    className="flex items-center gap-2 group cursor-help"
                    title={statDefs[stat.key]}
                  >
                    <span className="text-[13px] font-extrabold text-[#374151] uppercase tracking-wide">
                      {stat.key}
                    </span>
                    <span className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--box-border-strong)] flex items-center justify-center text-[10px] text-[#6b7280] font-extrabold group-hover:bg-[#0a0a0a] group-hover:text-white group-hover:border-[#0a0a0a] transition-all">
                      ?
                    </span>
                  </div>
                  <span className="text-[13px] font-black text-[#0a0a0a]">{stat.value}</span>
                </div>
                <div className="h-1.5 bg-[var(--box-border)] rounded-full overflow-hidden">
                  <div
                    data-stat-bar
                    data-width={`${stat.value}%`}
                    className="h-full bg-[#0a0a0a] rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: '0%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer-bar_2s_infinite]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCopyID}
            className="btn-primary flex-1 min-w-[120px] flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Копировать ID
          </button>
          <button
            onClick={handleShare}
            className="btn-outline flex-1 min-w-[120px] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
}
