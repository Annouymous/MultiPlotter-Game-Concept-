"use client";
import React from "react";
import { PlayerType, getPlayerColor } from "@/constants/GameRoom";
import { FaUser, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

interface PlayerProfileProps {
  player: PlayerType;
  isCurrentTurn: boolean;
  isCurrentUser: boolean;
  playerIndex: number;
}

function PlayerProfile({
  player,
  isCurrentTurn,
  isCurrentUser,
  playerIndex,
}: PlayerProfileProps) {
  const borderColor = getPlayerColor(playerIndex);

  return (
    <motion.div
      animate={
        isCurrentTurn
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 0px ${borderColor}`,
                `0 0 30px ${borderColor}`,
                `0 0 0px ${borderColor}`,
              ],
            }
          : {}
      }
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`relative flex items-center gap-3 rounded-xl border-2 bg-white/5 p-3 backdrop-blur-sm transition-all ${
        isCurrentUser ? "ring-2 ring-yellow-400" : ""
      }`}
      style={{
        borderColor: isCurrentTurn ? borderColor : "transparent",
      }}
    >
      {/* Turn Indicator */}
      {isCurrentTurn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
        >
          ▶
        </motion.div>
      )}

      {/* Avatar */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ backgroundColor: borderColor }}
      >
        <FaUser />
      </div>

      {/* Player Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-white">{player.name}</p>
          {isCurrentUser && (
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
              YOU
            </span>
          )}
        </div>
        <motion.p
          key={player.score}
          initial={{ scale: 1.5, color: "#10b981" }}
          animate={{ scale: 1, color: "#ffffff" }}
          className="text-lg font-bold"
        >
          Score: {player.score}
        </motion.p>
      </div>

      {/* Connection Status */}
      <div
        className={`h-2 w-2 rounded-full ${
          player.isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </motion.div>
  );
}

export default PlayerProfile;