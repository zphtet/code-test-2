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
import { regions, countries } from "@/constants/data";
import type { Team, Player } from "@/types";
import { PlayerSelectionInfinite } from "./player-section-infinite";
import { usePlayers } from "@/hooks/use-players";
import { PlayerRes, PlayerResponse } from "@/service/fetch-player";
import { InfiniteData } from "@tanstack/react-query";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createTeamSchema = z
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

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { addTeam, getPlayerById, syncPlayers, isTeamNameUnique } =
    useTeamStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      playerCount: "",
      region: "",
      country: "",
      selectedPlayers: [],
    },
  });

  // Get players from API
  const { data } = usePlayers();

  // Sync API players with store
  useEffect(() => {
    if (data) {
      const apiPlayers = (
        data as unknown as InfiniteData<PlayerResponse>
      ).pages.flatMap((page) =>
        page.data.map(
          (apiPlayer: PlayerRes): Player => ({
            id: apiPlayer.id.toString(),
            name: apiPlayer.name,
            teamId: undefined,
            teamName: undefined,
          })
        )
      );
      syncPlayers(apiPlayers);
    }
  }, [data, syncPlayers]);

  const handleSubmit = async (formData: CreateTeamFormData) => {
    // Check if team name is unique
    if (!isTeamNameUnique(formData.name)) {
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
        .map((playerId) => {
          const player = getPlayerById(playerId);
          return player
            ? {
                id: player.id,
                name: player.name,
                teamId: undefined,
                teamName: undefined,
              }
            : null;
        })
        .filter(Boolean) as Player[];

      const newTeam: Team = {
        id: Date.now().toString(),
        name: formData.name,
        playerCount: Number.parseInt(formData.playerCount),
        region: formData.region,
        country: formData.country,
        players: selectedPlayerObjects,
      };

      addTeam(newTeam);

      setIsSubmitting(false);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating team:", error);
      form.setError("root", {
        type: "manual",
        message: "Failed to create team. Please try again.",
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Team</DialogTitle>
          <DialogDescription className="text-lg">
            Fill in the details to create a new team
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
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
