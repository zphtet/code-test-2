export interface Player {
  id: string;
  name: string;
  teamId?: string;
  teamName?: string;
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
}

export interface TeamFormData {
  name: string;
  playerCount: string;
  region: string;
  country: string;
  selectedPlayers: string[];
}

export interface FormErrors {
  [key: string]: string;
}
