"use client";
import Image from "next/image";
import React from "react";
import { Sour_Gummy } from "next/font/google";
import PlayerProfile from "./PlayerProfile";
import ElapsedTime from "./ElapsedTime";

const SourGummy = Sour_Gummy({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

function Header({
  img,
  name,
  score,
  roomId,
  playerId,
  opponentId,
  opponentImg,
  opponentName,
  opponentScore,
}: Readonly<{
  img?: string;
  name?: string;
  score?: number;
  roomId?: string;
  playerId?: string;
  opponentId?: string;
  opponentImg?: string;
  opponentName?: string;
  opponentScore?: number;
}>) {
  return (
    <div className="z-30 mx-auto flex w-full max-w-7xl flex-row justify-between space-y-6">
      <main className="gap-4 flex flex-row justify-between space-x-5 rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-3xl">
        <PlayerProfile
          img={img}
          name={name}
          score={score}
          playerId={playerId}
        />
        <div className="text-center">
          <h1 className={`${SourGummy.className} text-2xl uppercase`}>
            multiploter
          </h1>
          <h3 className={`${SourGummy.className} text-lg uppercase`}>
            {" "}
            mystery box{" "}
          </h3>
          <strong className="text-xs text-gray-400">Room-ID : #{roomId}</strong>
        </div>
        <PlayerProfile
          img={opponentImg}
          name={opponentName}
          score={opponentScore}
          opponentId={opponentId}
        />
      </main>
      <div
        className={`${SourGummy.className} flex flex-row items-center justify-center`}
      >
        <ElapsedTime />
      </div>
    </div>
  );
  3;
}

export default Header;
