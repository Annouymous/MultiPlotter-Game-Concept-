import Image from "next/image";
import React from "react";

function PlayerProfile({
  img,
  name,
  score,
  playerId,
  opponentId,
}: Readonly<{
  img?: string;
  name?: string;
  score?: number;
  playerId?: string;
  opponentId?: string;
}>) {
  return (
    <div className="relative flex flex-col items-center space-y-4">
      {img ? (
        <Image
          width={64}
          height={64}
          className={`object-cover rounded-full size-16 ring-4 ${
            playerId && "ring-yellow-500"
          } ${opponentId && "ring-purple-600"}`}
          alt="mystery box"
          src={img}
        />
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
        className={`absolute top-1/3 flex size-7 translate-y-2 items-center justify-center rounded-full ${
          playerId &&
          "border border-yellow-500 bg-yellow-500 shadow-xl shadow-yellow-500"
        } ${
          opponentId &&
          "border border-purple-600 bg-purple-600 shadow-xl shadow-purple-600"
        } `}
      >
        <span
          className={`font-semibold text-white shadow-xl ${
            playerId && "shadow-yellow-500"
          } ${opponentId && "shadow-purple-600"} `}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

export default PlayerProfile;
