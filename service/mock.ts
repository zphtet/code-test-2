import type { Player } from "@/types";

// Fixed first 10 players for consistent testing
const FIXED_TEST_PLAYERS: Player[] = [
  {
    id: "test-player-1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
  },
  {
    id: "test-player-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
  },
  {
    id: "test-player-3",
    name: "Mike Davis",
    email: "mike.davis@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=MD",
  },
  {
    id: "test-player-4",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=EW",
  },
  {
    id: "test-player-5",
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=DB",
  },
  {
    id: "test-player-6",
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=LG",
  },
  {
    id: "test-player-7",
    name: "James Miller",
    email: "james.miller@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=JM",
  },
  {
    id: "test-player-8",
    name: "Anna Martinez",
    email: "anna.martinez@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=AM",
  },
  {
    id: "test-player-9",
    name: "Chris Anderson",
    email: "chris.anderson@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=CA",
  },
  {
    id: "test-player-10",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=JT",
  },
];

// Generate additional random players for pagination testing
const generateRandomPlayers = (startIndex: number, count: number): Player[] => {
  const firstNames = [
    "Alex",
    "Ryan",
    "Ashley",
    "Kevin",
    "Amanda",
    "Brian",
    "Stephanie",
    "Jason",
    "Michelle",
    "Daniel",
    "Nicole",
    "Matthew",
    "Jennifer",
    "Andrew",
    "Elizabeth",
    "Joshua",
    "Megan",
    "Tyler",
    "Samantha",
    "Brandon",
    "Lauren",
    "Zachary",
    "Kayla",
    "Nathan",
    "Brittany",
    "Caleb",
    "Danielle",
    "Noah",
    "Alexis",
    "Logan",
    "Destiny",
    "Jose",
    "Victoria",
    "Mason",
    "Jasmine",
    "Luke",
    "Hannah",
    "Anthony",
    "Kimberly",
    "William",
  ];

  const lastNames = [
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
  ];

  const players: Player[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
      startIndex + i
    }@example.com`;

    players.push({
      id: `player-${startIndex + i + 1}`,
      name: `${firstName} ${lastName}`,
      email,
      avatar: `/placeholder.svg?height=32&width=32&text=${firstName[0]}${lastName[0]}`,
    });
  }

  return players;
};

// Combine fixed test players with generated ones
const ALL_MOCK_PLAYERS = [
  ...FIXED_TEST_PLAYERS,
  ...generateRandomPlayers(10, 490), // Generate 490 more players starting from index 10
];

export interface PlayersResponse {
  players: Player[];
  nextCursor: string | null;
  hasNextPage: boolean;
  totalCount: number;
}

export interface PlayersQueryParams {
  cursor?: string;
  limit?: number;
  excludeTeamId?: string;
}

// Mock API function that simulates fetching players with pagination
export const fetchPlayers = async (
  params: PlayersQueryParams = {}
): Promise<PlayersResponse> => {
  const { cursor = "0", limit = 20, excludeTeamId } = params;

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 300)
  );

  // Parse cursor to get the starting index
  const startIndex = Number.parseInt(cursor);

  // Filter players based on team exclusion
  const filteredPlayers = ALL_MOCK_PLAYERS.filter((player) => {
    const notInExcludedTeam = !excludeTeamId || player.teamId !== excludeTeamId;
    return notInExcludedTeam;
  });

  // Get the slice of players for this page
  const endIndex = startIndex + limit;
  const players = filteredPlayers.slice(startIndex, endIndex);

  // Determine if there are more pages
  const hasNextPage = endIndex < filteredPlayers.length;
  const nextCursor = hasNextPage ? endIndex.toString() : null;

  return {
    players,
    nextCursor,
    hasNextPage,
    totalCount: filteredPlayers.length,
  };
};
