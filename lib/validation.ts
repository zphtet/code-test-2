import type { TeamFormData, FormErrors } from "@/types"
import { useTeamStore } from "@/zustand/team-store"

export const validateTeamForm = (formData: TeamFormData, excludeTeamId?: string): FormErrors => {
  const errors: FormErrors = {}
  const { isTeamNameUnique } = useTeamStore.getState()

  if (!formData.name.trim()) {
    errors.name = "Team name is required"
  } else if (!isTeamNameUnique(formData.name, excludeTeamId)) {
    errors.name = "Team name must be unique"
  }

  if (!formData.playerCount || Number.parseInt(formData.playerCount) < 1) {
    errors.playerCount = "Player count must be at least 1"
  }

  if (!formData.region) {
    errors.region = "Region is required"
  }

  if (!formData.country) {
    errors.country = "Country is required"
  }

  if (formData.selectedPlayers.length === 0) {
    errors.players = "At least one player must be selected"
  }

  if (
    Number.parseInt(formData.playerCount) > 0 &&
    formData.selectedPlayers.length > Number.parseInt(formData.playerCount)
  ) {
    errors.players = `Cannot select more than ${formData.playerCount} players`
  }

  return errors
}

export const getInitialFormData = (): TeamFormData => ({
  name: "",
  playerCount: "",
  region: "",
  country: "",
  selectedPlayers: [],
})
