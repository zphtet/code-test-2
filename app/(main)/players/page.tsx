"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePlayers } from "@/hooks/use-players";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoaderComponent from "@/components/loader";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

function getPositionVariant(position: string) {
  switch (position.toLowerCase()) {
    case "goalkeeper":
      return "secondary";
    case "defender":
      return "outline";
    case "midfielder":
      return "default";
    case "forward":
      return "destructive";
    default:
      return "default";
  }
}

const PlayersPage = () => {
  const { inView, ref } = useInView();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetching } =
    usePlayers();

  useEffect(() => {
    console.log("USE EFFECT");
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  console.log("data", data);
  if (isLoading) return <LoaderComponent />;

  return (
    <div className="container mx-auto space-y-5 py-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold ">Player List</h1>
        <p className="text-muted-foreground">
          This is a list of players from the API.
        </p>
      </div>

      {!data && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">API Connection Issue</h3>
          <p className="text-muted-foreground mb-4">
            The API is sometimes broken. Please try reloading the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {/* @ts-expect-error - data is not typed */}
        {data?.pages.map((page) =>
          // @ts-expect-error - data is not typed
          page.data.map((player) => (
            <Card
              key={player.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left section - Name and Position */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-full text-sm font-semibold">
                    #{player.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg truncate">
                      {player.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {player.first_name} {player.last_name}
                    </p>
                  </div>
                  <Badge variant={getPositionVariant(player.position)}>
                    {player.position}
                  </Badge>
                </div>

                {/* Middle section - Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{player.national_team}</p>
                    <p className="text-muted-foreground">Country</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{player.age.split(" ")[0]}</p>
                    <p className="text-muted-foreground">Years</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{player.height}cm</p>
                    <p className="text-muted-foreground">Height</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{player.weight}kg</p>
                    <p className="text-muted-foreground">Weight</p>
                  </div>
                </div>
              </div>

              {/* Mobile stats - shown only on small screens */}
              <div className="md:hidden mt-3 pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Country: </span>
                  <span className="text-muted-foreground">
                    {player.national_team}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Age: </span>
                  <span className="text-muted-foreground">
                    {player.age.split(" ")[0]} years
                  </span>
                </div>
                <div>
                  <span className="font-medium">Height: </span>
                  <span className="text-muted-foreground">
                    {player.height}cm
                  </span>
                </div>
                <div>
                  <span className="font-medium">Weight: </span>
                  <span className="text-muted-foreground">
                    {player.weight}kg
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {(hasNextPage || isLoading) && <LoaderComponent />}
      <div ref={ref} className=" bg-transparent min-h-10">
        {/* FETCH NEXT DATA WHEN YOU SEE ME */}
      </div>
    </div>
  );
};

export default PlayersPage;
