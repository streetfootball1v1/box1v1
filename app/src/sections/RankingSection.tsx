import { useMemo } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import type { Player } from '@/types';

interface RankingSectionProps {
  players: Player[];
  loading: boolean;
  onPlayerClick: (player: Player) => void;
}

export function RankingSection({ players, loading, onPlayerClick }: RankingSectionProps) {
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.ovr - a.ovr);
  }, [players]);

  const topThree = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  if (loading) {
    return (
      <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Рейтинг">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-12">
            <h1 className="section-title">РЕЙТИНГ</h1>
          </div>
          <div className="bg-white rounded-[24px] border border-[var(--box-border)] p-8 animate-pulse">
            <div className="h-96 bg-black/5 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (players.length === 0) {
    return (
      <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Рейтинг">
        <div className="max-w-[1300px] mx-auto">
          <div className="mb-12">
            <h1 className="section-title">РЕЙТИНГ</h1>
          </div>
          
          <div className="bg-white rounded-[32px] border border-[var(--box-border)] p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-[#22c55e]" />
            </div>
            <h3 className="text-2xl font-black italic uppercase mb-3">
              Рейтинг скоро появится
            </h3>
            <p className="text-[#374151] max-w-md mx-auto">
              Таблица будет сформирована после начала сезона и первых матчей.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Рейтинг">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-title">РЕЙТИНГ</h1>
          <p className="text-xl text-[#374151] mt-4 max-w-2xl">
            Рейтинг формируется по общему показателю OVR. Чем выше навыки — тем выше позиция.
          </p>
        </div>

        {/* Mechanics Explanation */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-2xl border border-[var(--box-border)] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0a0a0a]">OVR — главное</div>
              <div className="text-xs text-[#6b7280]">Сумма всех навыков</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[var(--box-border)] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0a0a0a]">Два типа</div>
              <div className="text-xs text-[#6b7280]">Полевые и вратари</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[var(--box-border)] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0a0a0a]">Обновления</div>
              <div className="text-xs text-[#6b7280]">После каждого матча</div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#6b7280] mb-6">
              Топ-3 сезона
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              {topThree[1] && (
                <div
                  className="bg-white rounded-[24px] border border-[var(--box-border)] p-6 cursor-pointer hover:border-[var(--box-border-strong)] hover:shadow-lg transition-all order-2 md:order-1"
                  onClick={() => onPlayerClick(topThree[1])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onPlayerClick(topThree[1])}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Medal className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-2xl font-black italic text-gray-400">#2</span>
                  </div>
                  <img
                    src={topThree[1].photo}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover mb-4"
                  />
                  <h3 className="text-xl font-black italic uppercase">{topThree[1].name}</h3>
                  <p className="text-sm text-[#6b7280] mb-3">{topThree[1].role}</p>
                  <div className="inline-flex items-center px-4 py-1.5 bg-[#0a0a0a] text-white rounded-xl font-black text-lg">
                    {topThree[1].ovr}
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div
                  className="bg-white rounded-[24px] border-2 border-[#22c55e] p-6 cursor-pointer hover:shadow-xl transition-all order-1 md:order-2 relative"
                  onClick={() => onPlayerClick(topThree[0])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onPlayerClick(topThree[0])}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c55e] text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                    Лидер
                  </div>
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-[#22c55e]" />
                    </div>
                    <span className="text-3xl font-black italic text-[#22c55e]">#1</span>
                  </div>
                  <img
                    src={topThree[0].photo}
                    alt=""
                    className="w-20 h-20 rounded-2xl object-cover mb-4"
                  />
                  <h3 className="text-2xl font-black italic uppercase">{topThree[0].name}</h3>
                  <p className="text-sm text-[#6b7280] mb-3">{topThree[0].role}</p>
                  <div className="inline-flex items-center px-5 py-2 bg-[#22c55e] text-black rounded-xl font-black text-xl">
                    {topThree[0].ovr}
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div
                  className="bg-white rounded-[24px] border border-[var(--box-border)] p-6 cursor-pointer hover:border-[var(--box-border-strong)] hover:shadow-lg transition-all order-3"
                  onClick={() => onPlayerClick(topThree[2])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onPlayerClick(topThree[2])}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-2xl font-black italic text-amber-600">#3</span>
                  </div>
                  <img
                    src={topThree[2].photo}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover mb-4"
                  />
                  <h3 className="text-xl font-black italic uppercase">{topThree[2].name}</h3>
                  <p className="text-sm text-[#6b7280] mb-3">{topThree[2].role}</p>
                  <div className="inline-flex items-center px-4 py-1.5 bg-[#0a0a0a] text-white rounded-xl font-black text-lg">
                    {topThree[2].ovr}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Table */}
        {rest.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#6b7280] mb-6">
              Полная таблица
            </h2>
            <div className="bg-white rounded-[24px] border border-[var(--box-border)] overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[400px]" role="table" aria-label="Рейтинг игроков">
                <thead>
                  <tr className="border-b border-[var(--box-border)]">
                    <th className="text-left py-5 px-6 text-[11px] font-extrabold uppercase text-[#6b7280] tracking-[0.1em]" scope="col">
                      #
                    </th>
                    <th className="text-left py-5 px-6 text-[11px] font-extrabold uppercase text-[#6b7280] tracking-[0.1em]" scope="col">
                      Игрок
                    </th>
                    <th className="text-right py-5 px-6 text-[11px] font-extrabold uppercase text-[#6b7280] tracking-[0.1em]" scope="col">
                      OVR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((player, index) => (
                    <tr
                      key={player.name}
                      className="border-b border-[var(--box-border)] last:border-b-0 cursor-pointer hover:bg-black/[0.02] transition-colors"
                      onClick={() => onPlayerClick(player)}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => e.key === 'Enter' && onPlayerClick(player)}
                      aria-label={`${index + 4} место, ${player.name}, ${player.role}, рейтинг ${player.ovr}`}
                      style={{ animation: `fadeInUp 0.3s ${index * 0.03}s forwards`, opacity: 0 }}
                    >
                      <td className="py-4 px-6 font-extrabold text-[#6b7280] tabular-nums">
                        {(index + 4).toString().padStart(2, '0')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={player.photo}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-[var(--box-bg)]"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=?';
                            }}
                          />
                          <div>
                            <div className="font-extrabold italic uppercase tracking-tight">{player.name}</div>
                            <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wide">{player.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center px-3 py-1 bg-[#0a0a0a] text-white rounded-xl font-black text-sm">
                          {player.ovr}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
