import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Team, Player } from "@/types";

interface TeamStore {
  teams: Team[];
  players: Player[];

  // Team actions
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updatedTeam: Team) => void;
  deleteTeam: (teamId: string) => void;

  // Player actions
  syncPlayers: (newPlayers: Player[]) => void;
  assignPlayersToTeam: (playerIds: string[], teamId: string) => void;
  removePlayersFromTeam: (teamId: string) => void;
  getAvailablePlayers: (excludeTeamId?: string) => Player[];
  getPlayerById: (playerId: string) => Player | undefined;
  updatePlayerTeamStatus: (playerId: string, teamId?: string) => void;

  // Utility
  isTeamNameUnique: (name: string, excludeTeamId?: string) => boolean;
  getPlayersInTeam: (teamId: string) => Player[];
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      players: [],

      addTeam: (team) => {
        // First add the team
        set((state) => ({
          teams: [...state.teams, team],
        }));

        // Then assign players to the team
        get().assignPlayersToTeam(
          team.players.map((p) => p.id),
          team.id
        );
      },

      updateTeam: (teamId, updatedTeam) => {
        // Update the team
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? updatedTeam : team
          ),
        }));

        // Remove all players from this team first
        get().removePlayersFromTeam(teamId);

        // Then assign new players
        get().assignPlayersToTeam(
          updatedTeam.players.map((p) => p.id),
          teamId
        );
      },

      deleteTeam: (teamId) => {
        // Remove team assignment from players first
        get().removePlayersFromTeam(teamId);

        // Then remove the team
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
        }));
      },

      syncPlayers: (newPlayers) => {
        set((state) => {
          const existingPlayerIds = new Set(state.players.map((p) => p.id));
          const playersToAdd = newPlayers.filter(
            (p) => !existingPlayerIds.has(p.id)
          );

          return {
            players: [...state.players, ...playersToAdd],
          };
        });
      },

      assignPlayersToTeam: (playerIds, teamId) => {
        set((state) => ({
          players: state.players.map((player) =>
            playerIds.includes(player.id) ? { ...player, teamId } : player
          ),
        }));
      },

      removePlayersFromTeam: (teamId) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.teamId === teamId ? { ...player, teamId: undefined } : player
          ),
        }));
      },

      getAvailablePlayers: (excludeTeamId) => {
        const { players } = get();
        return players.filter(
          (player) =>
            !player.teamId || (excludeTeamId && player.teamId === excludeTeamId)
        );
      },

      getPlayerById: (playerId) => {
        const { players } = get();
        return players.find((p) => p.id === playerId);
      },

      updatePlayerTeamStatus: (playerId, teamId) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.id === playerId ? { ...player, teamId } : player
          ),
        }));
      },

      isTeamNameUnique: (name, excludeTeamId) => {
        const { teams } = get();
        return !teams.some(
          (team) =>
            team.name.toLowerCase() === name.toLowerCase() &&
            team.id !== excludeTeamId
        );
      },

      getPlayersInTeam: (teamId) => {
        const { players } = get();
        return players.filter((p) => p.teamId === teamId);
      },
    }),
    {
      name: "team-storage",
    }
  )
);
