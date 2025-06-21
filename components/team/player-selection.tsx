import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Player } from "@/types";

interface PlayerSelectionProps {
  players: Player[];
  selectedPlayers: string[];
  onPlayerToggle: (playerId: string) => void;
  error?: string;
}

export function PlayerSelection({
  players,
  selectedPlayers,
  onPlayerToggle,
  error,
}: PlayerSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Select Players</Label>
      <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
        {players.map((player) => (
          <div key={player.id} className="flex items-center space-x-3 py-2">
            <Checkbox
              id={player.id}
              checked={selectedPlayers.includes(player.id)}
              onCheckedChange={() => onPlayerToggle(player.id)}
            />
            <Avatar className="w-8 h-8">
              <AvatarImage src={player.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{player.name}</p>
              <p className="text-xs text-muted-foreground">{player.email}</p>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
