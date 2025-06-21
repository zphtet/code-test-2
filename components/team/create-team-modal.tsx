"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeamStore } from "@/zustand/team-store"
import { validateTeamForm, getInitialFormData } from "@/lib/validation"
import { regions, countries } from "@/constants/data"
import type { Team, TeamFormData, FormErrors, Player } from "@/types"
import { PlayerSelectionInfinite } from "./player-section-infinite"
import { usePlayers } from "@/hooks/use-players"
import { PlayerRes, PlayerResponse } from "@/service/fetch-player"
import { InfiniteData } from "@tanstack/react-query"

interface CreateTeamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { addTeam, getPlayerById, syncPlayers } = useTeamStore()
  const [formData, setFormData] = useState<TeamFormData>(getInitialFormData())
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get players from API
  const { data } = usePlayers()
  
  // Sync API players with store
  useEffect(() => {
    if (data) {
      const apiPlayers = (data as unknown as InfiniteData<PlayerResponse>).pages.flatMap((page) => 
        page.data.map((apiPlayer: PlayerRes): Player => ({
          id: apiPlayer.id.toString(),
          name: apiPlayer.name,
          teamId: undefined,
          teamName: undefined
        }))
      );
      syncPlayers(apiPlayers);
    }
  }, [data, syncPlayers]);

  const resetForm = () => {
    setFormData(getInitialFormData())
    setErrors({})
  }

  const handleSubmit = async () => {
    const validationErrors = validateTeamForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get selected players from store
      const selectedPlayerObjects = formData.selectedPlayers
        .map((playerId) => {
          const player = getPlayerById(playerId)
          return player ? {
            id: player.id,
            name: player.name,
            teamId: undefined,
            teamName: undefined
          } : null
        })
        .filter(Boolean) as Player[]

      const newTeam: Team = {
        id: Date.now().toString(),
        name: formData.name,
        playerCount: Number.parseInt(formData.playerCount),
        region: formData.region,
        country: formData.country,
        players: selectedPlayerObjects,
      }

      addTeam(newTeam)

      setIsSubmitting(false)
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error creating team:", error)
      setErrors({ submit: "Failed to create team. Please try again." })
      setIsSubmitting(false)
    }
  }

  const handlePlayerToggle = (playerId: string) => {
    const isSelected = formData.selectedPlayers.includes(playerId)
    if (isSelected) {
      setFormData({
        ...formData,
        selectedPlayers: formData.selectedPlayers.filter((id) => id !== playerId),
      })
    } else {
      setFormData({
        ...formData,
        selectedPlayers: [...formData.selectedPlayers, playerId],
      })
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Team</DialogTitle>
          <DialogDescription className="text-lg">Fill in the details to create a new team</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                className="h-12 text-base w-full"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-3">
              <Label htmlFor="playerCount" className="text-base">Player Count</Label>
              <Input
                id="playerCount"
                type="number"
                min="1"
                value={formData.playerCount}
                onChange={(e) => setFormData({ ...formData, playerCount: e.target.value })}
                placeholder="Enter player count"
                className="h-12 text-base w-full"
              />
              {errors.playerCount && <p className="text-sm text-destructive">{errors.playerCount}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="region" className="text-base">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => {
                  setFormData({ ...formData, region: value })
                  if (errors.region) {
                    setErrors({ ...errors, region: "" })
                  }
                }}
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region} className="text-base">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-destructive">{errors.region}</p>}
            </div>
            <div className="space-y-3">
              <Label htmlFor="country" className="text-base">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => {
                  setFormData({ ...formData, country: value })
                  if (errors.country) {
                    setErrors({ ...errors, country: "" })
                  }
                }}
              >
                <SelectTrigger className="h-12 text-base w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country} className="text-base">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
            </div>
          </div>
          <PlayerSelectionInfinite
            selectedPlayers={formData.selectedPlayers}
            onPlayerToggle={handlePlayerToggle}
            error={errors.players}
          />
          {errors.players && <p className="text-sm text-destructive">{errors.players}</p>}
          {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
