"use client";
import { Card } from "@/constants/GameRoom";
import Image from "next/image";
import React from "react";
import mystery_box from "@/public/assets/mystery-box.png";
import { FaLock } from "react-icons/fa";
import { useGame } from "@/context/GameContext";
import toast, { Toaster } from "react-hot-toast";

function OnlineBoard({
  roomId,
  userIdentification,
  cards,
}: {
  roomId: string;
  cards: Card[];
  userIdentification?: string;
}) {
  const { OnlineGameSession, HandleOnlineCardSystem } = useGame();
  return (
    <section
      style={{ perspective: "800px" }}
      className="grid grid-cols-12 gap-2"
      // className="flex flex-wrap items-center justify-center gap-4"
    >
      {OnlineGameSession?.gameCards?.map((card, index) => (
        <div
          onClick={() =>
            OnlineGameSession?.currentPlayerId.toString() === userIdentification
              ? HandleOnlineCardSystem(card, roomId, userIdentification)
              : toast.error("Not your turn !")
          }
          style={{
            transformStyle: "preserve-3d",
            transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          key={index}
          className={`relative size-24 transition-all duration-1000 ease-in-out`}
        >
          <Image
            width={80}
            height={80}
            className="pointer-events-none absolute h-full w-full -scale-x-100 rounded-lg"
            src={card.picture as string}
            alt={card.identifier as string}
          />
          <Image
            style={{ backfaceVisibility: "hidden" }}
            className="pointer-events-none absolute h-full w-full rounded-lg bg-black"
            src={mystery_box}
            alt={card.identifier as string}
          />
          {!card.isFlipped && (
            <div
              className={`absolute left-0 top-0 z-10 h-full w-full rounded-lg bg-black/50 p-1 text-center text-2xl font-semibold ${
                OnlineGameSession?.currentPlayerId.toString() ===
                  userIdentification && "hidden"
              } transition-all duration-1000 ease-in-out`}
            >
              <FaLock />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export default OnlineBoard;
