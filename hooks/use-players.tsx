import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPlayers, PlayerResponse } from "@/service/fetch-player";

export const usePlayers = () => {
  return useInfiniteQuery<PlayerResponse, Error, PlayerResponse, string[]>({
    queryKey: ["players"],
    staleTime: 1000 * 60 * 60, // 1 hour
    queryFn: ({ pageParam }) =>
      fetchPlayers({ pageParam: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < 10) return undefined;
      return lastPage.meta.next_cursor;
    },
  });
};
