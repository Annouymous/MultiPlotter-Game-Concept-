"use client";
import { Card } from "@/constants/GameRoom";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import mystery_box from "@/public/assets/mystery-box.png";
import { FaLock } from "react-icons/fa";
import { useGame } from "@/context/GameContext";
import toast from "react-hot-toast";
import FloatingScore from "./FloatingScore";
import ParticleEffects from "./ParticleEffects";
import { getPlayerColor } from "@/constants/GameRoom";
import { motion, AnimatePresence } from "framer-motion";

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
    { id: string; value: number; color: string; x: number; y: number }[]
  >([]);
  const [particleTriggers, setParticleTriggers] = useState<{ [key: number]: boolean }>({});

  const handleCardClick = (card: Card, event: React.MouseEvent) => {
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

  const showFloatingScore = (cardId: number, playerIndex: number, x: number, y: number) => {
    const color = getPlayerColor(playerIndex);
    const id = `${cardId}-${Date.now()}`;
    setFloatingScores((prev) => [...prev, { id, value: 1, color, x, y }]);
  };

  const removeFloatingScore = (id: string) => {
    setFloatingScores((prev) => prev.filter((score) => score.id !== id));
  };

  // Trigger particles and floating scores when card is matched
  useEffect(() => {
    if (OnlineGameSession?.gameCards) {
      OnlineGameSession.gameCards.forEach((card) => {
        if (card.isMatched && card.matchedAt && card.matchedAt > Date.now() - 1000) {
          // Trigger particles
          setParticleTriggers((prev) => ({ ...prev, [card.id!]: true }));
          setTimeout(() => {
            setParticleTriggers((prev) => ({ ...prev, [card.id!]: false }));
          }, 100);

          // Trigger floating score
          if (card.matchedBy) {
            const playerIndex = OnlineGameSession.players.findIndex(
              (p) => p.VerificationId === card.matchedBy
            );
            if (playerIndex >= 0) {
              // Calculate card position (approximate center of viewport)
              const x = window.innerWidth / 2;
              const y = window.innerHeight / 2;
              showFloatingScore(card.id!, playerIndex, x, y);
            }
          }
        }
      });
    }
  }, [OnlineGameSession?.gameCards]);

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
      <AnimatePresence>
        {!isMyTurn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4 rounded-xl border-2 border-red-500/50 bg-black/80 p-6 text-center shadow-2xl shadow-red-500/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaLock className="text-6xl text-red-500" />
              </motion.div>
              <p className="text-xl font-bold text-white">Waiting for your turn...</p>
              <p className="text-sm text-white/70">
                {OnlineGameSession?.players.find(
                  (p) =>
                    p.VerificationId.toString() ===
                    OnlineGameSession.currentPlayerId.toString()
                )?.name || "Opponent"}
                's turn
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {OnlineGameSession?.gameCards?.map((card, index) => {
        const playerIndex = card.flippedBy
          ? getPlayerIndex(card.flippedBy)
          : 0;
        const borderColor = card.flippedBy
          ? getPlayerColor(playerIndex)
          : "transparent";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            onClick={(e) => handleCardClick(card, e)}
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
            whileHover={
              isMyTurn && !card.isFlipped && !card.isMatched
                ? {
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(255,255,255,0.3)",
                    y: -5,
                  }
                : {}
            }
            className={`relative size-24 cursor-pointer rounded-lg transition-all duration-500 ease-in-out ${
              card.isMatched ? "opacity-80" : ""
            }`}
          >
            {/* Particle effects on match */}
            {particleTriggers[card.id!] && (
              <ParticleEffects trigger={true} color={borderColor} count={15} />
            )}

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

            {/* Matched indicator with animation */}
            {card.isMatched && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-green-500/30"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-4xl"
                >
                  ✓
                </motion.span>
              </motion.div>
            )}

            {/* Glow effect for selectable cards */}
            {isMyTurn && !card.isFlipped && !card.isMatched && (
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="pointer-events-none absolute inset-0 rounded-lg"
              />
            )}
          </motion.div>
        );
      })}

      {/* Floating score animations */}
      <AnimatePresence>
        {floatingScores.map((score) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onAnimationComplete={() => removeFloatingScore(score.id)}
            style={{
              position: "fixed",
              left: score.x,
              top: score.y,
              color: score.color,
              fontSize: "3rem",
              fontWeight: "bold",
              pointerEvents: "none",
              zIndex: 100,
              textShadow: `0 0 10px ${score.color}, 0 0 20px ${score.color}`,
            }}
          >
            +{score.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}

export default OnlineBoard;