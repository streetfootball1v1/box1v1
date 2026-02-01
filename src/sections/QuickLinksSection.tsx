import { FileText, Send, Instagram } from 'lucide-react';
import type { TabId } from '@/types';

interface QuickLinksSectionProps {
  onTabChange: (tab: TabId) => void;
}

export function QuickLinksSection({ onTabChange }: QuickLinksSectionProps) {
  return (
    <section className="py-10 px-5" aria-label="Быстрые ссылки">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Rules Card - Large */}
          <div 
            className="card-box md:col-span-2 cursor-pointer group"
            onClick={() => onTabChange('about')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onTabChange('about')}
            aria-label="Открыть регламент"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#16a34a]">
              Документация
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] leading-none mt-4 mb-3">
              РЕГЛАМЕНТ
            </h2>
            <p className="text-[#374151]">
              Свод правил проведения матчей.
            </p>
            <div className="mt-auto pt-8 text-xs font-extrabold uppercase text-[#374151] flex items-center gap-2 group-hover:text-[#0a0a0a] transition-colors">
              <FileText className="w-4 h-4" />
              Изучить правила →
            </div>
          </div>

          {/* Telegram Card */}
          <a
            href="https://t.me/streetbox1v1"
            target="_blank"
            rel="noopener noreferrer"
            className="card-box cursor-pointer hover:border-[#229ED9]/30 group"
            role="link"
            aria-label="Открыть Telegram"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9]/10 flex items-center justify-center mb-4 group-hover:bg-[#229ED9]/20 transition-colors">
              <Send className="w-5 h-5 text-[#229ED9]" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">
              TELEGRAM
            </h3>
            <p className="text-[#374151] text-sm">
              Свежие новости и актуальная информация.
            </p>
          </a>

          {/* Instagram Card */}
          <a
            href="https://instagram.com/box.1v1"
            target="_blank"
            rel="noopener noreferrer"
            className="card-box cursor-pointer hover:border-[#E4405F]/30 group"
            role="link"
            aria-label="Открыть Instagram"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center mb-4 group-hover:bg-[#E4405F]/20 transition-colors">
              <Instagram className="w-5 h-5 text-[#E4405F]" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-2">
              INSTAGRAM
            </h3>
            <p className="text-[#374151] text-sm">
              Главные новости в медиа формате.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
