"use client";
import Image from "next/image";
import React from "react";

function PlayerProfile({
  img,
  name,
  score,
  playerId,
  opponentId,
  isCurrentTurn,
  playerColor,
}: Readonly<{
  img?: string;
  name?: string;
  score?: number;
  playerId?: string;
  opponentId?: string;
  isCurrentTurn?: boolean;
  playerColor?: string;
}>) {
  const ringColor = playerColor || (playerId ? "ring-yellow-500" : "ring-purple-600");
  const bgColor = playerColor || (playerId ? "bg-yellow-500 shadow-yellow-500" : "bg-purple-600 shadow-purple-600");
  
  return (
    <div className="relative flex flex-col items-center space-y-4">
      {img ? (
        <div className="relative">
          <Image
            width={64}
            height={64}
            className={`object-cover rounded-full size-16 ring-4 transition-all duration-300 ${
              isCurrentTurn ? `${ringColor} animate-pulse-glow ring-8` : ringColor
            }`}
            alt="player avatar"
            src={img}
            style={
              isCurrentTurn && playerColor
                ? {
                    boxShadow: `0 0 20px ${playerColor}, 0 0 40px ${playerColor}`,
                  }
                : undefined
            }
          />
          {isCurrentTurn && (
            <div
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/50 animate-pulse"
              title="Current Turn"
            >
              ▶
            </div>
          )}
        </div>
      ) : (
        <div className="flex size-[70px] items-center justify-center rounded-full bg-gray-600 text-center text-xs text-white/50">
          Not Presented
        </div>
      )}
      {name && (
        <div className="h-auto w-16 max-w-28 overflow-hidden truncate rounded-md border border-white/20 bg-white/10 px-2 text-center text-sm font-semibold text-white backdrop-blur-3xl">
          {name}
        </div>
      )}
      <div
        className={`absolute top-1/3 flex size-7 translate-y-2 items-center justify-center rounded-full border transition-all duration-300 ${
          playerId && `border-yellow-500 ${bgColor} shadow-xl`
        } ${opponentId && `border-purple-600 ${bgColor} shadow-xl`}`}
        style={
          playerColor
            ? {
                borderColor: playerColor,
                backgroundColor: playerColor,
                boxShadow: `0 0 10px ${playerColor}, 0 0 20px ${playerColor}`,
              }
            : undefined
        }
      >
        <span
          className={`font-semibold text-white shadow-xl ${
            playerId && "shadow-yellow-500"
          } ${opponentId && "shadow-purple-600"}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

export default PlayerProfile;