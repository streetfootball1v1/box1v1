import { useState, useEffect } from 'react';
import type { TabId } from '@/types';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О проекте' },
  { id: 'roster', label: 'Участники' },
  { id: 'stats', label: 'Рейтинг' },
  { id: 'howtojoin', label: 'Как попасть' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: TabId) => {
    onTabChange(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.05)]' : 'bg-white/85'
        } backdrop-blur-xl border-b border-[var(--box-border)]`}
        role="navigation"
        aria-label="Главное меню"
        style={{ height: 'calc(var(--box-nav-h) + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-[1300px] mx-auto h-[var(--box-nav-h)] flex items-center justify-between px-5">
          <button
            onClick={() => handleNavClick('home')}
            className="text-2xl font-black italic tracking-tight hover:opacity-70 transition-opacity"
            aria-label="BOX1V1 - На главную"
          >
            BOX<span className="text-[#22c55e]">1</span>V1
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`inline-flex items-center justify-center text-xs font-bold tracking-wider uppercase min-h-11 px-5 rounded-[14px] transition-all ${
                  activeTab === item.id
                    ? 'bg-[#0a0a0a] text-white border border-[#0a0a0a]'
                    : 'text-[#374151] hover:text-[#0a0a0a] hover:bg-black/[0.03] border border-transparent'
                }`}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden w-12 h-12 flex flex-col justify-center items-center gap-[5px] rounded-[14px] bg-black/[0.03] border-none transition-all hover:bg-black/[0.06] hover:scale-105 active:scale-95"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <span
              className={`w-[22px] h-0.5 bg-[#0a0a0a] rounded-sm transition-all origin-center ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`w-[22px] h-0.5 bg-[#0a0a0a] rounded-sm transition-all ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`w-[22px] h-0.5 bg-[#0a0a0a] rounded-sm transition-all origin-center ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-lg z-[1999] transition-all duration-400 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 w-[min(86%,380px)] h-full h-[100dvh] bg-white z-[2000] flex flex-col gap-2 transition-all duration-500 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-[-20px_0_60px_rgba(0,0,0,0.15)] overflow-y-auto overscroll-contain`}
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
        role="dialog"
        aria-label="Мобильное меню"
        aria-modal="true"
      >
        <div className="mb-8 pb-4 border-b border-[var(--box-border)]">
          <div className="text-[1.75rem] font-black italic">
            BOX<span className="text-[#22c55e]">1</span>V1
          </div>
        </div>

        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-[1.75rem] font-black italic uppercase tracking-tight py-4 border-b border-[var(--box-border)] text-left transition-all hover:text-[#16a34a] hover:pl-2 ${
              menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
            }`}
            style={{ transitionDelay: `${0.1 + index * 0.05}s` }}
          >
            {item.label}
          </button>
        ))}

        <div className="mt-auto pt-8">
          <button
            onClick={() => handleNavClick('howtojoin')}
            className="btn-primary w-full"
          >
            Стать частью
          </button>
        </div>
      </div>
    </>
  );
}
