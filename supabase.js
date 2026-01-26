// supabase.js - сервис для работы с базой данных BOX1V1
class SupabaseService {
  constructor() {
    this.client = supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.publishableKey,
      {
        auth: {
          persistSession: false
        }
      }
    );
  }

  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('players')
        .select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      console.log('Supabase подключен');
      return { success: true, message: 'Подключение успешно' };
    } catch (error) {
      console.error('Ошибка подключения к Supabase:', error);
      return { success: false, message: error.message };
    }
  }

  async getAllPlayers() {
    try {
      const { data, error } = await this.client
        .from('players')
        .select('*')
        .eq('active', true)
        .order('elo_rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения игроков:', error);
      return [];
    }
  }

  async getPlayerByNickname(nickname) {
    try {
      const { data, error } = await this.client
        .from('players')
        .select('*')
        .eq('nickname', nickname)
        .eq('active', true)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ошибка получения игрока:', error);
      return null;
    }
  }

  async createPlayer(nickname, telegram = null, avatarUrl = null) {
    try {
      const { data: existingPlayer } = await this.client
        .from('players')
        .select('id')
        .eq('nickname', nickname)
        .single();
      
      if (existingPlayer) {
        return { 
          success: false, 
          error: 'Игрок с таким никнеймом уже существует' 
        };
      }
      
      const { data, error } = await this.client
        .from('players')
        .insert([{
          nickname: nickname.trim(),
          telegram: telegram ? telegram.trim() : null,
          avatar_url: avatarUrl,
          elo_rating: 1500,
          total_matches: 0,
          wins: 0,
          losses: 0,
          current_streak: 0,
          best_streak: 0,
          verified: false,
          active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { 
        success: true, 
        player: data,
        message: 'Профиль создан! Ожидайте подтверждения организатора.'
      };
    } catch (error) {
      console.error('Ошибка создания игрока:', error);
      return { 
        success: false, 
        error: error.message || 'Ошибка создания профиля' 
      };
    }
  }

  async createMatch(winnerNickname, loserNickname, score) {
    try {
      const { data: players, error: playersError } = await this.client
        .from('players')
        .select('*')
        .in('nickname', [winnerNickname, loserNickname]);
      
      if (playersError) throw playersError;
      
      if (players.length !== 2) {
        return { 
          success: false, 
          error: 'Не удалось найти одного из игроков' 
        };
      }
      
      const winner = players.find(p => p.nickname === winnerNickname);
      const loser = players.find(p => p.nickname === loserNickname);
      
      const eloResult = this.calculateElo(winner.elo_rating, loser.elo_rating);
      
      const { data: match, error: matchError } = await this.client
        .from('matches')
        .insert([{
          winner_id: winner.id,
          loser_id: loser.id,
          winner_elo_before: winner.elo_rating,
          loser_elo_before: loser.elo_rating,
          winner_elo_after: eloResult.winnerNewElo,
          loser_elo_after: eloResult.loserNewElo,
          elo_change: eloResult.eloChange,
          score: score,
          match_time: new Date().toISOString(),
          confirmed_by_admin: true,
          notes: 'Турнирный матч'
        }])
        .select()
        .single();
      
      if (matchError) throw matchError;
      
      await this.updatePlayerStats(winner.id, true);
      await this.updatePlayerStats(loser.id, false);
      
      return { 
        success: true, 
        match: match,
        message: `Матч сохранён! ${winnerNickname} победил ${loserNickname}`
      };
    } catch (error) {
      console.error('Ошибка создания матча:', error);
      return { 
        success: false, 
        error: error.message || 'Ошибка сохранения матча' 
      };
    }
  }

  async updatePlayerStats(playerId, isWinner) {
    try {
      const { data: player, error } = await this.client
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (error) throw error;
      
      const updates = {
        total_matches: player.total_matches + 1,
        last_match_at: new Date().toISOString()
      };
      
      if (isWinner) {
        updates.wins = player.wins + 1;
        updates.current_streak = player.current_streak + 1;
        updates.best_streak = Math.max(player.best_streak, player.current_streak + 1);
      } else {
        updates.losses = player.losses + 1;
        updates.current_streak = 0;
      }
      
      await this.client
        .from('players')
        .update(updates)
        .eq('id', playerId);
        
    } catch (error) {
      console.error('Ошибка обновления статистики:', error);
    }
  }

  async getRecentMatches(limit = 10) {
    try {
      const { data, error } = await this.client
        .from('matches')
        .select(`
          *,
          winner:players!winner_id(nickname, avatar_url),
          loser:players!loser_id(nickname, avatar_url)
        `)
        .order('match_time', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения матчей:', error);
      return [];
    }
  }

  calculateElo(playerElo, opponentElo, kFactor = 32) {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
    const eloChange = Math.round(kFactor * (1 - expectedScore));
    
    return {
      winnerNewElo: playerElo + eloChange,
      loserNewElo: opponentElo - eloChange,
      eloChange: eloChange
    };
  }

  async getUnverifiedPlayers() {
    try {
      const { data, error } = await this.client
        .from('players')
        .select('*')
        .eq('verified', false)
        .eq('active', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ошибка получения неподтверждённых игроков:', error);
      return [];
    }
  }

  async verifyPlayer(playerId) {
    try {
      const { data, error } = await this.client
        .from('players')
        .update({ verified: true })
        .eq('id', playerId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, player: data };
    } catch (error) {
      console.error('Ошибка подтверждения игрока:', error);
      return { success: false, error: error.message };
    }
  }
}

const db = new SupabaseService();
