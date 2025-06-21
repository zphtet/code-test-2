"use client";

import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { usePlayers } from "@/hooks/use-players";
import { PlayerRes, PlayerResponse } from "@/service/fetch-player";
import { InfiniteData } from "@tanstack/react-query";
import { useTeamStore } from "@/zustand/team-store";
import { useInView } from "react-intersection-observer";

interface ExtendedPlayer extends Omit<PlayerRes, "id"> {
  id: string;
  teamId?: string;
  teamName?: string;
}

interface PlayerSelectionInfiniteProps {
  selectedPlayers: string[];
  onPlayerToggle: (playerId: string) => void;
  error?: string;
  excludeTeamId?: string;
}

export function PlayerSelectionInfinite({
  selectedPlayers,
  onPlayerToggle,
  error,
  excludeTeamId,
}: PlayerSelectionInfiniteProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "20px",
  });

  const {
    data,
    isLoading,
    isFetchingNextPage: isLoadingMore,
    error: apiError,
    hasNextPage,
    fetchNextPage: loadMore,
    refetch,
  } = usePlayers();

  // Get team store to check player assignments
  const { getPlayerById } = useTeamStore();

  // Transform the API response to include team information
  const players: ExtendedPlayer[] = (
    (data as unknown as InfiniteData<PlayerResponse>)?.pages ?? []
  ).flatMap((page) =>
    page.data.map((apiPlayer: PlayerRes): ExtendedPlayer => {
      // Get player from store to check team assignment
      const storePlayer = getPlayerById(apiPlayer.id.toString());
      return {
        ...apiPlayer,
        id: apiPlayer.id.toString(),
        teamId: storePlayer?.teamId,
        teamName: storePlayer?.teamName,
      };
    })
  );
  const totalCount = players.length;

  // Trigger fetch when inView changes
  useEffect(() => {
    if (inView && hasNextPage && !isLoadingMore) {
      loadMore();
    }
  }, [inView, hasNextPage, isLoadingMore, loadMore]);

  const handleRetry = () => {
    refetch();
  };

  const selectedCount = selectedPlayers.length;
  const availableCount = players.filter(
    (p: ExtendedPlayer) =>
      !p.teamId || (excludeTeamId && p.teamId === excludeTeamId)
  ).length;

  const isPlayerSelectable = (player: ExtendedPlayer) => {
    // Player is selectable if:
    // 1. They're not in any team, OR
    // 2. They're in the team being edited (excludeTeamId)
    return !player.teamId || (excludeTeamId && player.teamId === excludeTeamId);
  };

  const getPlayerStatus = (player: ExtendedPlayer) => {
    if (!player.teamId) return null;
    if (excludeTeamId && player.teamId === excludeTeamId) return "Current Team";
    return `In ${player.teamName || "Another Team"}`;
  };

  const getStatusBadgeColor = (player: ExtendedPlayer) => {
    if (!player.teamId) return "";
    if (excludeTeamId && player.teamId === excludeTeamId)
      return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Select Players</Label>
        <div className="text-sm text-muted-foreground">
          {selectedCount} selected • {availableCount} available • {totalCount}{" "}
          total
        </div>
      </div>

      {/* Players List */}
      <div
        ref={scrollContainerRef}
        className="border rounded-lg max-h-80 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading players...</span>
          </div>
        ) : apiError ? (
          <div className="p-4 text-center space-y-3">
            <div className="flex items-center justify-center text-destructive">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Failed to load players</span>
            </div>
            <p className="text-sm text-muted-foreground">{apiError.message}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              type="button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : players.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No players available</p>
          </div>
        ) : (
          <div className="p-2">
            {players.map((player) => {
              const isSelectable = isPlayerSelectable(player);
              const status = getPlayerStatus(player);
              const statusColor = getStatusBadgeColor(player);

              return (
                <div
                  key={player.id}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    isSelectable
                      ? "hover:bg-muted/50"
                      : "opacity-60 bg-muted/20"
                  }`}
                >
                  <Checkbox
                    id={player.id}
                    checked={selectedPlayers.includes(player.id)}
                    onCheckedChange={() =>
                      isSelectable && onPlayerToggle(player.id)
                    }
                    disabled={!isSelectable}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        !isSelectable ? "text-muted-foreground" : ""
                      }`}
                    >
                      {player.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {player.position}
                    </p>
                  </div>
                  {status && (
                    <div className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                      {status}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Load More Trigger */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center p-4"
              >
                {isLoadingMore ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Loading more players...</span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadMore()}
                    className="text-muted-foreground"
                  >
                    Load more players
                  </Button>
                )}
              </div>
            )}

            {!hasNextPage && players.length > 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground border-t">
                All players loaded ({totalCount} total)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
