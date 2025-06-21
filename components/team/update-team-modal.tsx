"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamStore } from "@/zustand/team-store";
import { PlayerSelectionInfinite } from "./player-section-infinite";
import { regions, countries } from "@/constants/data";
import type { Team, Player } from "@/types";

interface UpdateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
}

const updateTeamSchema = z
  .object({
    name: z.string().min(1, "Team name is required"),
    playerCount: z.string().refine((val) => Number(val) >= 1, {
      message: "Player count must be at least 1",
    }),
    region: z.string().min(1, "Region is required"),
    country: z.string().min(1, "Country is required"),
    selectedPlayers: z
      .array(z.string())
      .min(1, "At least one player must be selected"),
  })
  .refine(
    (data) => {
      const playerCount = Number(data.playerCount);
      return data.selectedPlayers.length <= playerCount;
    },
    {
      message: "Cannot select more players than the player count",
      path: ["selectedPlayers"],
    }
  );

type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

export function UpdateTeamModal({
  open,
  onOpenChange,
  team,
}: UpdateTeamModalProps) {
  const { updateTeam, getPlayerById, isTeamNameUnique } = useTeamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateTeamFormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: "",
      playerCount: "",
      region: "",
      country: "",
      selectedPlayers: [],
    },
  });

  // Update form values when team changes
  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        playerCount: team.playerCount.toString(),
        region: team.region,
        country: team.country,
        selectedPlayers: team.players.map((p) => p.id),
      });
    }
  }, [team, form]);

  const handleSubmit = async (formData: UpdateTeamFormData) => {
    if (!team) return;

    // Check if team name is unique (excluding current team)
    if (!isTeamNameUnique(formData.name, team.id)) {
      form.setError("name", {
        type: "manual",
        message: "Team name must be unique",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get selected players from store
      const selectedPlayerObjects = formData.selectedPlayers
        .map((playerId) => getPlayerById(playerId))
        .filter(Boolean) as Player[];

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
      form.setError("root", {
        type: "manual",
        message: "Failed to update team. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handlePlayerToggle = (playerId: string) => {
    const currentPlayers = form.getValues("selectedPlayers");
    const isSelected = currentPlayers.includes(playerId);

    if (isSelected) {
      form.setValue(
        "selectedPlayers",
        currentPlayers.filter((id) => id !== playerId)
      );
    } else {
      form.setValue("selectedPlayers", [...currentPlayers, playerId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Update Team</DialogTitle>
          <DialogDescription className="text-lg">
            Modify the team details
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter team name"
                          className="h-12 text-base w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="playerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter player count"
                          className="h-12 text-base w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 text-base w-full">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 text-base w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="selectedPlayers"
                render={({ field }) => (
                  <FormItem>
                    <PlayerSelectionInfinite
                      selectedPlayers={field.value}
                      onPlayerToggle={handlePlayerToggle}
                      error={form.formState.errors.selectedPlayers?.message}
                      excludeTeamId={team?.id}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Team"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
