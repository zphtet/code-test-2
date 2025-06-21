export interface Player {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teamId?: string;
  teamName?: string; // Add this for displaying team name
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
