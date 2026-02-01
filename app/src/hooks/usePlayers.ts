import { useState, useEffect, useCallback } from 'react';
import type { Player } from '@/types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREjbeB6jNrU01kw1npVtFTvqGdP134ERjmyROoOYeYXbzjgL0ZCNK6KwF0VTk3c1yxZEZEUsJjy2Ur/pub?output=csv';

function parseCSV(text: string): Player[] {
  const rows = text.replace(/\r/g, '').split('\n').filter(r => r.trim());
  return rows.slice(1).map(row => {
    const matches = row.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g);
    const c = matches ? matches.map(m => m.replace(/^"|"$/g, '').trim()) : [];
    return {
      name: c[0] || '',
      ovr: parseInt(c[1]) || 0,
      role: (c[2] as 'Игрок' | 'Вратарь') || 'Игрок',
      drib: parseInt(c[3]) || 0,
      speed: parseInt(c[4]) || 0,
      shot: parseInt(c[5]) || 0,
      phys: parseInt(c[6]) || 0,
      photo: c[7] || 'https://via.placeholder.com/400x600?text=No+Photo',
      status: c[8] || '',
      badges: c[9] ? c[9].split('|').map(b => b.trim()).filter(Boolean) : []
    };
  }).filter(p => p.name);
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Network error');
        const text = await response.text();
        const parsed = parseCSV(text);
        setPlayers(parsed);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  const getPlayerByName = useCallback((name: string): Player | undefined => {
    return players.find(p => p.name.toLowerCase() === name.toLowerCase());
  }, [players]);

  const getSortedPlayers = useCallback((sortBy: keyof Player = 'ovr', desc: boolean = true): Player[] => {
    return [...players].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return desc ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });
  }, [players]);

  const filterPlayers = useCallback((search: string, role: string): Player[] => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === 'Все' || p.role === role;
      return matchesSearch && matchesRole;
    });
  }, [players]);

  return {
    players,
    loading,
    error,
    getPlayerByName,
    getSortedPlayers,
    filterPlayers
  };
}
