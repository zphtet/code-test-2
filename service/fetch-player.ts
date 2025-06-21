const API_URL = "https://api.balldontlie.io/epl/v1/players";
const API_KEY = "15d89067-fc43-4338-802f-22574f3a0f54";

export type PlayerRes = {
  id: number;
  name: string;
  position: string;
  national_team: string;
  height: number;
  weight: number;
  birth_date: string;
  age: string;
  first_name: string;
};

export type PlayerResponse = {
  data: PlayerRes[];
  meta: {
    next_cursor: string | null;
  };
};

type FetchPlayersParams = {
  pageParam: string | undefined;
};

export const fetchPlayers = async ({
  pageParam,
}: FetchPlayersParams): Promise<PlayerResponse> => {
  const url = new URL(API_URL);
  console.log("pageParam", pageParam);
  url.searchParams.append("season", "2024");
  url.searchParams.append("per_page", "10");
  if (pageParam) {
    url.searchParams.append("cursor", pageParam);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch players");

  return res.json();
};
