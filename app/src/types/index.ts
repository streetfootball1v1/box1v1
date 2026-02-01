// BOX1V1 Player Types

export interface Player {
  name: string;
  ovr: number;
  role: 'Игрок' | 'Вратарь';
  drib: number;
  speed: number;
  shot: number;
  phys: number;
  photo: string;
  status: string;
  badges: string[];
}

export interface PlayerStats {
  key: string;
  value: number;
}

export interface StatDefinition {
  [key: string]: string;
}

export type TabId = 'home' | 'about' | 'roster' | 'stats' | 'howtojoin';

export interface NavItem {
  id: TabId;
  label: string;
}
