"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePlayers } from "@/hooks/use-players";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoaderComponent from "@/components/loader";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
// interface Player {
//   id: number;
//   position: string;
//   national_team: string;
//   height: number;
//   weight: number;
//   birth_date: string;
//   age: string;
//   name: string;
//   first_name: string;
//   last_name: string;
//   team_ids: number[];
// }

// const mockPlayers: Player[] = [
//   {
//     id: 1,
//     position: "Goalkeeper",
//     national_team: "Brazil",
//     height: 193,
//     weight: 91,
//     birth_date: "1992-10-02T00:00:00.000Z",
//     age: "32 years 262 days",
//     name: "Alisson Becker",
//     first_name: "Alisson Ramsés",
//     last_name: "Becker",
//     team_ids: [26],
//   },
//   {
//     id: 2,
//     position: "Defender",
//     national_team: "Netherlands",
//     height: 193,
//     weight: 92,
//     birth_date: "1991-07-04T00:00:00.000Z",
//     age: "33 years 171 days",
//     name: "Virgil van Dijk",
//     first_name: "Virgil",
//     last_name: "van Dijk",
//     team_ids: [26],
//   },
//   {
//     id: 3,
//     position: "Forward",
//     national_team: "Egypt",
//     height: 175,
//     weight: 71,
//     birth_date: "1992-06-15T00:00:00.000Z",
//     age: "32 years 190 days",
//     name: "Mohamed Salah",
//     first_name: "Mohamed",
//     last_name: "Salah",
//     team_ids: [26],
//   },
//   {
//     id: 4,
//     position: "Midfielder",
//     national_team: "Spain",
//     height: 180,
//     weight: 68,
//     birth_date: "1991-01-08T00:00:00.000Z",
//     age: "33 years 348 days",
//     name: "Thiago Alcântara",
//     first_name: "Thiago",
//     last_name: "Alcântara",
//     team_ids: [26],
//   },
//   {
//     id: 5,
//     position: "Forward",
//     national_team: "Senegal",
//     height: 175,
//     weight: 69,
//     birth_date: "1992-04-10T00:00:00.000Z",
//     age: "32 years 256 days",
//     name: "Sadio Mané",
//     first_name: "Sadio",
//     last_name: "Mané",
//     team_ids: [15],
//   },
//   {
//     id: 6,
//     position: "Midfielder",
//     national_team: "England",
//     height: 180,
//     weight: 67,
//     birth_date: "1990-06-17T00:00:00.000Z",
//     age: "34 years 188 days",
//     name: "Jordan Henderson",
//     first_name: "Jordan",
//     last_name: "Henderson",
//     team_ids: [12],
//   },
//   {
//     id: 7,
//     position: "Defender",
//     national_team: "Scotland",
//     height: 178,
//     weight: 77,
//     birth_date: "1988-03-26T00:00:00.000Z",
//     age: "36 years 271 days",
//     name: "Andrew Robertson",
//     first_name: "Andrew",
//     last_name: "Robertson",
//     team_ids: [26],
//   },
//   {
//     id: 8,
//     position: "Forward",
//     national_team: "Portugal",
//     height: 187,
//     weight: 84,
//     birth_date: "1985-02-05T00:00:00.000Z",
//     age: "39 years 320 days",
//     name: "Cristiano Ronaldo",
//     first_name: "Cristiano",
//     last_name: "Ronaldo",
//     team_ids: [8],
//   },
//   {
//     id: 9,
//     position: "Forward",
//     national_team: "Argentina",
//     height: 170,
//     weight: 72,
//     birth_date: "1987-06-24T00:00:00.000Z",
//     age: "37 years 181 days",
//     name: "Lionel Messi",
//     first_name: "Lionel",
//     last_name: "Messi",
//     team_ids: [31],
//   },
//   {
//     id: 10,
//     position: "Midfielder",
//     national_team: "Belgium",
//     height: 181,
//     weight: 70,
//     birth_date: "1991-06-28T00:00:00.000Z",
//     age: "33 years 177 days",
//     name: "Kevin De Bruyne",
//     first_name: "Kevin",
//     last_name: "De Bruyne",
//     team_ids: [17],
//   },
//   {
//     id: 11,
//     position: "Forward",
//     national_team: "France",
//     height: 178,
//     weight: 73,
//     birth_date: "1998-12-20T00:00:00.000Z",
//     age: "25 years 363 days",
//     name: "Kylian Mbappé",
//     first_name: "Kylian",
//     last_name: "Mbappé",
//     team_ids: [9],
//   },
//   {
//     id: 12,
//     position: "Goalkeeper",
//     national_team: "Germany",
//     height: 193,
//     weight: 88,
//     birth_date: "1992-03-27T00:00:00.000Z",
//     age: "32 years 270 days",
//     name: "Manuel Neuer",
//     first_name: "Manuel",
//     last_name: "Neuer",
//     team_ids: [5],
//   },
//   {
//     id: 13,
//     position: "Defender",
//     national_team: "France",
//     height: 182,
//     weight: 73,
//     birth_date: "1993-07-08T00:00:00.000Z",
//     age: "31 years 167 days",
//     name: "Raphaël Varane",
//     first_name: "Raphaël",
//     last_name: "Varane",
//     team_ids: [11],
//   },
//   {
//     id: 14,
//     position: "Midfielder",
//     national_team: "Croatia",
//     height: 172,
//     weight: 66,
//     birth_date: "1985-09-09T00:00:00.000Z",
//     age: "39 years 104 days",
//     name: "Luka Modrić",
//     first_name: "Luka",
//     last_name: "Modrić",
//     team_ids: [9],
//   },
//   {
//     id: 15,
//     position: "Forward",
//     national_team: "Poland",
//     height: 185,
//     weight: 81,
//     birth_date: "1988-08-21T00:00:00.000Z",
//     age: "36 years 123 days",
//     name: "Robert Lewandowski",
//     first_name: "Robert",
//     last_name: "Lewandowski",
//     team_ids: [3],
//   },
//   {
//     id: 16,
//     position: "Defender",
//     national_team: "Italy",
//     height: 187,
//     weight: 85,
//     birth_date: "1987-05-19T00:00:00.000Z",
//     age: "37 years 217 days",
//     name: "Leonardo Bonucci",
//     first_name: "Leonardo",
//     last_name: "Bonucci",
//     team_ids: [1],
//   },
//   {
//     id: 17,
//     position: "Midfielder",
//     national_team: "England",
//     height: 188,
//     weight: 84,
//     birth_date: "1993-01-15T00:00:00.000Z",
//     age: "31 years 341 days",
//     name: "Harry Kane",
//     first_name: "Harry",
//     last_name: "Kane",
//     team_ids: [5],
//   },
//   {
//     id: 18,
//     position: "Forward",
//     national_team: "Norway",
//     height: 194,
//     weight: 88,
//     birth_date: "2000-07-21T00:00:00.000Z",
//     age: "24 years 154 days",
//     name: "Erling Haaland",
//     first_name: "Erling",
//     last_name: "Haaland",
//     team_ids: [17],
//   },
//   {
//     id: 19,
//     position: "Goalkeeper",
//     national_team: "Belgium",
//     height: 199,
//     weight: 96,
//     birth_date: "1992-01-15T00:00:00.000Z",
//     age: "32 years 341 days",
//     name: "Thibaut Courtois",
//     first_name: "Thibaut",
//     last_name: "Courtois",
//     team_ids: [9],
//   },
//   {
//     id: 20,
//     position: "Midfielder",
//     national_team: "Brazil",
//     height: 175,
//     weight: 68,
//     birth_date: "1992-02-05T00:00:00.000Z",
//     age: "32 years 320 days",
//     name: "Neymar Jr",
//     first_name: "Neymar",
//     last_name: "da Silva Santos Júnior",
//     team_ids: [31],
//   },
// ];

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
  }, [inView]);

  console.log("data", data);
  if (isLoading) return <LoaderComponent />;

  return (
    <div className="container mx-auto space-y-5 py-5">
      <div>
        <h1 className="text-3xl font-bold ">Player List</h1>
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
        {/*  */}
        {/* @ts-ignore */}
        {data?.pages.map((page) =>
          // @ts-ignoreF
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
