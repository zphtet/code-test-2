"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTeamStore } from "@/zustand/team-store";
import { PlayerSelectionInfinite } from "./player-section-infinite";
import { validateTeamForm } from "@/lib/validation";
import { regions, countries } from "@/constants/data";
import type { Team, TeamFormData, FormErrors } from "@/types";

interface UpdateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
}

export function UpdateTeamModal({
  open,
  onOpenChange,
  team,
}: UpdateTeamModalProps) {
  const { updateTeam, getPlayerById } = useTeamStore();
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    playerCount: "",
    region: "",
    country: "",
    selectedPlayers: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        playerCount: team.playerCount.toString(),
        region: team.region,
        country: team.country,
        selectedPlayers: team.players.map((p) => p.id),
      });
    }
  }, [team]);

  const handleSubmit = async () => {
    if (!team) return;

    const validationErrors = validateTeamForm(formData, team.id);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get selected players from store
      const selectedPlayerObjects = formData.selectedPlayers
        .map((playerId) => getPlayerById(playerId))
        .filter(Boolean) as unknown as  any[];

      const updatedTeam: Team = {
        ...team,
        name: formData.name,
        playerCount: Number.parseInt(formData.playerCount),
        region: formData.region,
        country: formData.country,
        players: selectedPlayerObjects,
      };

      updateTeam(team.id, updatedTeam);

      setIsSubmitting(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating team:", error);
      setErrors({ submit: "Failed to update team. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handlePlayerToggle = (playerId: string) => {
    const isSelected = formData.selectedPlayers.includes(playerId);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedPlayers: formData.selectedPlayers.filter(
          (id) => id !== playerId
        ),
      });
    } else {
      setFormData({
        ...formData,
        selectedPlayers: [...formData.selectedPlayers, playerId],
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Update Team</DialogTitle>
          <DialogDescription className="text-lg">
            Modify the team details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="update-name" className="text-base">
                Team Name
              </Label>
              <Input
                id="update-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter team name"
                className="h-12 text-base w-full"
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="update-playerCount" className="text-base">
                Player Count
              </Label>
              <Input
                id="update-playerCount"
                type="number"
                min="1"
                value={formData.playerCount}
                onChange={(e) =>
                  setFormData({ ...formData, playerCount: e.target.value })
                }
                placeholder="Enter player count"
                className="h-12 text-base w-full"
              />
              {errors.playerCount && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.playerCount}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="update-region" className="text-base">
                Region
              </Label>
              <Select
                value={formData.region}
                onValueChange={(value) =>
                  setFormData({ ...formData, region: value })
                }
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem
                      key={region}
                      value={region}
                      className="text-base"
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.region}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="update-country" className="text-base">
                Country
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country}
                      value={country}
                      className="text-base"
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.country}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <PlayerSelectionInfinite
            selectedPlayers={formData.selectedPlayers}
            onPlayerToggle={handlePlayerToggle}
            error={errors.players}
            excludeTeamId={team?.id}
          />
          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
