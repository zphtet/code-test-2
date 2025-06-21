import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPlayers, PlayerResponse } from "@/service/fetch-player";

export const usePlayers = () => {
  return useInfiniteQuery<PlayerResponse, Error, PlayerResponse, string[]>({
    queryKey: ["players"],
    queryFn: ({ pageParam }) => fetchPlayers({ pageParam: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
  });
};