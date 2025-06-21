"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPlayers, type PlayersQueryParams } from "@/service/mock";
import { useTeamStore } from "@/zustand/team-store";
import type { Player } from "@/types";

interface UseInfinitePlayersResult {
  players: Player[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => void;
  refetch: () => void;
  totalCount: number;
}

export function useInfinitePlayers(
  params: PlayersQueryParams = {}
): UseInfinitePlayersResult {
  const { syncPlayers, players: storePlayersRaw, teams } = useTeamStore();
  const [apiPlayers, setApiPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>("0");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get players with updated team status from store and add team names
  const players = apiPlayers.map((apiPlayer) => {
    const storePlayer = storePlayersRaw.find((p) => p.id === apiPlayer.id);
    const playerWithTeamStatus = storePlayer || apiPlayer;

    // Add team name if player is in a team
    if (playerWithTeamStatus.teamId) {
      const team = teams.find((t) => t.id === playerWithTeamStatus.teamId);
      return {
        ...playerWithTeamStatus,
        teamName: team?.name || "Unknown Team",
      };
    }

    return playerWithTeamStatus;
  });

  const fetchInitialData = useCallback(async () => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchPlayers({ ...params, cursor: "0" });

      setApiPlayers(response.players);
      setNextCursor(response.nextCursor);
      setHasNextPage(response.hasNextPage);
      setTotalCount(response.totalCount);
      setIsInitialized(true);

      // Sync players with store
      syncPlayers(response.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch players");
    } finally {
      setIsLoading(false);
    }
  }, [params, isInitialized, syncPlayers]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || !nextCursor) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const response = await fetchPlayers({ ...params, cursor: nextCursor });

      setApiPlayers((prev) => [...prev, ...response.players]);
      setNextCursor(response.nextCursor);
      setHasNextPage(response.hasNextPage);

      // Sync new players with store
      syncPlayers(response.players);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more players"
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, nextCursor, params, syncPlayers]);

  const refetch = useCallback(() => {
    setApiPlayers([]);
    setNextCursor("0");
    setHasNextPage(true);
    setIsInitialized(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      fetchInitialData();
    }
  }, [fetchInitialData, isInitialized]);

  return {
    players, // Return all players, don't filter out those in teams
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    loadMore,
    refetch,
    totalCount: players.length,
  };
}
