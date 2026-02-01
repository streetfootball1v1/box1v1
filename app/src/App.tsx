import { useState, useEffect, useCallback } from 'react';
import { Preloader } from '@/components/Preloader';
import { ToastContainer } from '@/components/Toast';
import { Navigation } from '@/components/Navigation';
import { PlayerModal } from '@/components/PlayerModal';
import { HeroSection } from '@/sections/HeroSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { QuickLinksSection } from '@/sections/QuickLinksSection';
import { RosterSection } from '@/sections/RosterSection';
import { RankingSection } from '@/sections/RankingSection';
import { AboutSection } from '@/sections/AboutSection';
import { HowToJoinSection } from '@/sections/HowToJoinSection';
import { usePlayers } from '@/hooks/usePlayers';
import { useToast } from '@/hooks/useToast';
import type { Player, TabId } from '@/types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  
  const { players, loading } = usePlayers();
  const { toasts, showToast, removeToast } = useToast();

  // Handle hash navigation on load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      
      const [hashPart] = hash.split('?');
      const cleanHash = hashPart.replace('#', '') as TabId;
      
      const validTabs: TabId[] = ['home', 'about', 'roster', 'stats', 'howtojoin'];
      if (validTabs.includes(cleanHash)) {
        setActiveTab(cleanHash);
      }
    };

    // Handle initial hash
    if (!isPreloading) {
      handleHash();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isPreloading]);

  // Handle player deep link
  useEffect(() => {
    if (isPreloading || loading) return;

    const hash = window.location.hash;
    if (!hash) return;

    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return;

    const queryString = hash.slice(queryIndex + 1);
    const params = new URLSearchParams(queryString);
    const playerName = params.get('player');

    if (playerName) {
      const name = playerName.replace(/-/g, ' ');
      const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (player) {
        setTimeout(() => {
          setSelectedPlayer(player);
          setIsModalOpen(true);
        }, 300);
      }
    }
  }, [isPreloading, loading, players]);

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePlayerClick = useCallback((player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
    
    // Update URL with player slug
    const slug = player.name.replace(/\s+/g, '-').toLowerCase();
    window.history.replaceState(null, '', `#${activeTab}?player=${slug}`);
  }, [activeTab]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    
    // Remove player from URL
    window.history.replaceState(null, '', `#${activeTab}`);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection onTabChange={handleTabChange} />
            <HowItWorksSection />
            <QuickLinksSection onTabChange={handleTabChange} />
          </>
        );
      case 'about':
        return <AboutSection />;
      case 'roster':
        return (
          <RosterSection
            players={players}
            loading={loading}
            onPlayerClick={handlePlayerClick}
          />
        );
      case 'stats':
        return (
          <RankingSection
            players={players}
            loading={loading}
            onPlayerClick={handlePlayerClick}
          />
        );
      case 'howtojoin':
        return <HowToJoinSection />;
      default:
        return <HeroSection onTabChange={handleTabChange} />;
    }
  };

  return (
    <>
      {/* Preloader */}
      {isPreloading && (
        <Preloader onLoaded={() => setIsPreloading(false)} />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Navigation */}
      {!isPreloading && (
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Main Content */}
      <main 
        className={`min-h-screen transition-opacity duration-500 ${
          isPreloading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ paddingTop: 'var(--box-nav-h)' }}
      >
        {renderContent()}
      </main>

      {/* Player Modal */}
      <PlayerModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onToast={showToast}
      />

      {/* Skip Link */}
      <a
        href="#main"
        className="absolute -top-10 left-0 bg-[#0a0a0a] text-white px-4 py-2 text-sm font-medium transition-all focus:top-0 z-[10000]"
      >
        Перейти к содержимому
      </a>
    </>
  );
}

export default App;
