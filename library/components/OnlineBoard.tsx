"use client";
import { Card } from "@/constants/GameRoom";
import Image from "next/image";
import React, { useState } from "react";
import mystery_box from "@/public/assets/mystery-box.png";
import { FaLock } from "react-icons/fa";
import { useGame } from "@/context/GameContext";
import toast, { Toaster } from "react-hot-toast";
import FloatingScore from "./FloatingScore";
import { getPlayerColor } from "@/constants/GameRoom";

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
  const [floatingScores, setFloatingScores] = useState<
    { id: string; value: number; color: string }[]
  >([]);

  const handleCardClick = (card: Card) => {
    const isMyTurn =
      OnlineGameSession?.currentPlayerId.toString() === userIdentification;

    if (!isMyTurn) {
      toast.error("Not your turn!", { icon: "⏳" });
      return;
    }

    if (card.isFlipped || card.isMatched) {
      return;
    }

    HandleOnlineCardSystem(card, roomId, userIdentification);
  };

  const showFloatingScore = (cardId: number, playerIndex: number) => {
    const color = getPlayerColor(playerIndex);
    const id = `${cardId}-${Date.now()}`;
    setFloatingScores((prev) => [...prev, { id, value: 1, color }]);
  };

  const removeFloatingScore = (id: string) => {
    setFloatingScores((prev) => prev.filter((score) => score.id !== id));
  };

  // Get player index for color
  const getPlayerIndex = (playerId: string) => {
    return (
      OnlineGameSession?.players.findIndex(
        (p) => p.VerificationId === playerId
      ) || 0
    );
  };

  const isMyTurn =
    OnlineGameSession?.currentPlayerId.toString() === userIdentification;

  return (
    <section
      style={{ perspective: "800px" }}
      className="relative grid grid-cols-12 gap-2"
    >
      {/* Global lock overlay when not your turn */}
      {!isMyTurn && (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-red-500/50 bg-black/80 p-6 text-center shadow-2xl shadow-red-500/30">
            <FaLock className="text-6xl text-red-500 animate-pulse" />
            <p className="text-xl font-bold text-white">Waiting for your turn...</p>
            <p className="text-sm text-white/70">
              {OnlineGameSession?.players.find(
                (p) =>
                  p.VerificationId.toString() ===
                  OnlineGameSession.currentPlayerId.toString()
              )?.name || "Opponent"}
              's turn
            </p>
          </div>
        </div>
      )}

      {OnlineGameSession?.gameCards?.map((card, index) => {
        const playerIndex = card.flippedBy
          ? getPlayerIndex(card.flippedBy)
          : 0;
        const borderColor = card.flippedBy
          ? getPlayerColor(playerIndex)
          : "transparent";

        return (
          <div
            key={index}
            onClick={() => handleCardClick(card)}
            style={{
              transformStyle: "preserve-3d",
              transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              borderColor: card.isFlipped || card.isMatched ? borderColor : "transparent",
              borderWidth: card.isFlipped || card.isMatched ? "3px" : "0px",
              boxShadow:
                card.isFlipped || card.isMatched
                  ? `0 0 15px ${borderColor}, 0 0 30px ${borderColor}`
                  : "none",
            }}
            className={`relative size-24 cursor-pointer rounded-lg transition-all duration-1000 ease-in-out ${
              isMyTurn && !card.isFlipped && !card.isMatched
                ? "hover:scale-105 hover:shadow-xl"
                : ""
            } ${card.isMatched ? "opacity-80" : ""}`}
          >
            {/* Front of card (picture) */}
            <Image
              width={80}
              height={80}
              className="pointer-events-none absolute h-full w-full -scale-x-100 rounded-lg object-cover"
              src={card.picture as string}
              alt={card.identifier as string}
            />

            {/* Back of card (mystery box) */}
            <Image
              style={{ backfaceVisibility: "hidden" }}
              className="pointer-events-none absolute h-full w-full rounded-lg bg-black object-cover"
              src={mystery_box}
              alt="mystery box"
            />

            {/* Matched indicator */}
            {card.isMatched && (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-green-500/30">
                <span className="text-4xl animate-pulse">✓</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Floating score animations */}
      {floatingScores.map((score) => (
        <FloatingScore
          key={score.id}
          value={score.value}
          color={score.color}
          onComplete={() => removeFloatingScore(score.id)}
        />
      ))}
    </section>
  );
}

export default OnlineBoard;