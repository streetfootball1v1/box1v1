import { useState, useMemo } from 'react';
import { Search, User, Shield } from 'lucide-react';
import type { Player } from '@/types';

interface RosterSectionProps {
  players: Player[];
  loading: boolean;
  onPlayerClick: (player: Player) => void;
}

type RoleFilter = 'Все' | 'Игрок' | 'Вратарь';

export function RosterSection({ players, loading, onPlayerClick }: RosterSectionProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('Все');

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'Все' || p.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [players, search, roleFilter]);

  // Loading state
  if (loading) {
    return (
      <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Участники">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-12">
            <h1 className="section-title">УЧАСТНИКИ</h1>
            <p className="text-xl text-[#374151] mt-4">Действующие участники BOX1V1</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[24px] border border-[var(--box-border)] p-8 h-[400px] animate-pulse">
                <div className="w-full h-full bg-black/5 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state - no players at all
  if (players.length === 0) {
    return (
      <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Участники">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-12">
            <h1 className="section-title">УЧАСТНИКИ</h1>
            <p className="text-xl text-[#374151] mt-4">Действующие участники BOX1V1</p>
          </div>
          
          <div className="bg-white rounded-[32px] border border-[var(--box-border)] p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-[#22c55e]" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-3">
              Ростер формируется
            </h3>
            <p className="text-[#374151] max-w-md mx-auto mb-8">
              Первые участники появятся здесь после открытия регистрации. Следи за обновлениями в Telegram.
            </p>
            <a 
              href="https://t.me/streetbox1v1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Перейти в Telegram
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Участники">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title">УЧАСТНИКИ</h1>
          <p className="text-xl text-[#374151] mt-4">
            {players.length} {players.length === 1 ? 'атлет' : players.length < 5 ? 'атлета' : 'атлетов'} в ростере
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-10">
          {/* Search */}
          <div className="relative max-w-[360px] w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-[1.5px] border-[var(--box-border)] bg-white font-medium transition-all hover:border-[var(--box-border-strong)] focus:outline-none focus:border-[#0a0a0a] focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
              aria-label="Поиск игрока"
              autoComplete="off"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide" role="group" aria-label="Фильтр по роли">
            <button
              onClick={() => setRoleFilter('Все')}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all min-h-11 ${
                roleFilter === 'Все'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-white border border-[var(--box-border)] text-[#374151] hover:border-[var(--box-border-strong)]'
              }`}
              aria-pressed={roleFilter === 'Все'}
            >
              Все
            </button>
            <button
              onClick={() => setRoleFilter('Игрок')}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all min-h-11 flex items-center gap-2 ${
                roleFilter === 'Игрок'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-white border border-[var(--box-border)] text-[#374151] hover:border-[var(--box-border-strong)]'
              }`}
              aria-pressed={roleFilter === 'Игрок'}
            >
              <User className="w-4 h-4" />
              Полевые
            </button>
            <button
              onClick={() => setRoleFilter('Вратарь')}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all min-h-11 flex items-center gap-2 ${
                roleFilter === 'Вратарь'
                  ? 'bg-[#0a0a0a] text-white'
                  : 'bg-white border border-[var(--box-border)] text-[#374151] hover:border-[var(--box-border-strong)]'
              }`}
              aria-pressed={roleFilter === 'Вратарь'}
            >
              <Shield className="w-4 h-4" />
              Вратари
            </button>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[#374151]">Атлеты не найдены</p>
            <p className="text-sm text-[#6b7280] mt-2">Попробуй изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="region" aria-live="polite">
            {filteredPlayers.map((player, index) => (
              <div
                key={player.name}
                className="relative min-h-[420px] bg-black text-white rounded-[24px] overflow-hidden cursor-pointer group isolation-isolate"
                onClick={() => onPlayerClick(player)}
                tabIndex={0}
                role="button"
                aria-label={`Карточка игрока ${player.name}, рейтинг ${player.ovr}`}
                onKeyDown={(e) => e.key === 'Enter' && onPlayerClick(player)}
                style={{ animation: `fadeInUp 0.5s ${index * 0.05}s forwards`, opacity: 0 }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center-top transition-all duration-1000 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-105"
                  style={{ backgroundImage: `url('${player.photo}')` }}
                  aria-hidden="true"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[1]" />

                {/* Status Badge */}
                {player.status && (
                  <div className="absolute top-6 right-6 z-[3] bg-[#22c55e] text-black text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wide">
                    {player.status}
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-[2] flex flex-col gap-2">
                  {/* Role */}
                  <span className="text-[11px] font-extrabold uppercase text-[#22c55e] tracking-[0.15em]">
                    {player.role}
                  </span>

                  {/* Name */}
                  <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-black italic uppercase leading-tight break-words">
                    {player.name}
                  </h3>

                  {/* Badge */}
                  {player.badges.length > 0 && (
                    <div className="text-xs text-white/70 mt-1">
                      {player.badges[0]}
                    </div>
                  )}

                  {/* OVR Badge */}
                  <div className="inline-flex items-center px-4 py-1.5 bg-[#22c55e] text-black rounded-xl font-black text-sm mt-3 w-fit shadow-[0_4px_12px_rgba(34,197,94,0.3)]">
                    OVR {player.ovr}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
