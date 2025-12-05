"use client";
import React from "react";
import { Sour_Gummy } from "next/font/google";
import PlayerProfile from "./PlayerProfile";
import ElapsedTime from "./ElapsedTime";
import { PlayerType } from "@/constants/GameRoom";
import { getPlayerColor } from "@/constants/GameRoom";

const SourGummy = Sour_Gummy({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

function Header({
  roomId,
  players,
  currentPlayerId,
  userPlayerId,
}: Readonly<{
  roomId?: string;
  players?: PlayerType[];
  currentPlayerId?: number;
  userPlayerId?: string;
}>) {
  // Find current user and assign player colors
  const playersWithColors = players?.map((player, index) => ({
    ...player,
    color: getPlayerColor(index),
  }));

  const currentUser = playersWithColors?.find(
    (p) => p.VerificationId === userPlayerId
  );
  const otherPlayers = playersWithColors?.filter(
    (p) => p.VerificationId !== userPlayerId
  );

  return (
    <div className="z-30 mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:justify-between">
      {/* Main header with current user and game info */}
      <main className="flex flex-row items-center justify-between gap-4 rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-3xl lg:flex-1">
        {/* Current User */}
        {currentUser && (
          <PlayerProfile
            img={currentUser.avatar}
            name={currentUser.name}
            score={currentUser.score}
            playerId={currentUser.VerificationId}
            isCurrentTurn={
              currentUser.VerificationId.toString() === currentPlayerId?.toString()
            }
            playerColor={currentUser.color}
          />
        )}

        {/* Game Title and Room ID */}
        <div className="text-center">
          <h1 className={`${SourGummy.className} text-2xl uppercase`}>
            multiploter
          </h1>
          <h3 className={`${SourGummy.className} text-lg uppercase`}>
            mystery box
          </h3>
          {roomId && (
            <strong className="text-xs text-gray-400">Room-ID : #{roomId}</strong>
          )}
        </div>

        {/* First Opponent */}
        {otherPlayers && otherPlayers[0] && (
          <PlayerProfile
            img={otherPlayers[0].avatar}
            name={otherPlayers[0].name}
            score={otherPlayers[0].score}
            opponentId={otherPlayers[0].VerificationId}
            isCurrentTurn={
              otherPlayers[0].VerificationId.toString() ===
              currentPlayerId?.toString()
            }
            playerColor={otherPlayers[0].color}
          />
        )}
      </main>

      {/* Additional players and timer */}
      <div className="flex flex-row items-center gap-4">
        {/* Additional opponents (if more than 2 players) */}
        {otherPlayers && otherPlayers.length > 1 && (
          <div className="flex flex-row gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-3xl">
            {otherPlayers.slice(1).map((player) => (
              <PlayerProfile
                key={player.id}
                img={player.avatar}
                name={player.name}
                score={player.score}
                opponentId={player.VerificationId}
                isCurrentTurn={
                  player.VerificationId.toString() === currentPlayerId?.toString()
                }
                playerColor={player.color}
              />
            ))}
          </div>
        )}

        {/* Timer */}
        <div
          className={`${SourGummy.className} flex flex-row items-center justify-center`}
        >
          <ElapsedTime />
        </div>
      </div>

      {/* Player Color Legend */}
      {playersWithColors && playersWithColors.length > 1 && (
        <div className="absolute right-4 top-20 rounded-lg border border-white/20 bg-black/60 p-3 backdrop-blur-sm lg:top-4">
          <h4 className="mb-2 text-xs font-semibold text-white/70">
            Player Colors
          </h4>
          <div className="space-y-1">
            {playersWithColors.map((player, index) => (
              <div key={player.id} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-xs text-white">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;