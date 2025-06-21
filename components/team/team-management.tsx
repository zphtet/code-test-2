"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { useTeamStore } from "@/zustand/team-store"
import { TeamCard } from "./team-card"
import { CreateTeamModal } from "./create-team-modal"
import { UpdateTeamModal } from "./update-team-modal"
import { DeleteTeamModal } from "./delete-team-modal"
import type { Team } from "@/types"

export default function TeamManagement() {
  const { teams } = useTeamStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team)
    setIsUpdateOpen(true)
  }

  const handleDeleteTeam = (team: Team) => {
    setSelectedTeam(team)
    setIsDeleteOpen(true)
  }

  const handleTeamDeleted = () => {
    // You can add a toast notification here if you want
    console.log(`Team deleted. ${selectedTeam?.players.length || 0} players are now available for other teams.`)
  }

  const handleCloseModals = () => {
    setIsUpdateOpen(false)
    setIsDeleteOpen(false)
    setSelectedTeam(null)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Create and manage your teams</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} onEdit={handleEditTeam} onDelete={handleDeleteTeam} />
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
          <p className="text-muted-foreground mb-4">Create your first team to get started</p>
        </div>
      )}

      <CreateTeamModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <UpdateTeamModal open={isUpdateOpen} onOpenChange={handleCloseModals} team={selectedTeam} />

      <DeleteTeamModal
        open={isDeleteOpen}
        onOpenChange={handleCloseModals}
        team={selectedTeam}
        onTeamDeleted={handleTeamDeleted}
      />
    </div>
  )
}
