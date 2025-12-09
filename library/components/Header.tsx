"use client";
import React from "react";
import { PlayerType } from "@/constants/GameRoom";
import PlayerProfile from "./PlayerProfile";
import { FaClock, FaGamepad } from "react-icons/fa";
import { motion } from "framer-motion";

interface HeaderProps {
  roomId: string;
  players: PlayerType[];
  currentPlayerId: number;
  userPlayerId: string;
  movesCount?: number;
  gameDuration?: number;
}

function Header({
  roomId,
  players,
  currentPlayerId,
  userPlayerId,
  movesCount = 0,
  gameDuration = 0,
}: HeaderProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Game Statistics */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Moves Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 rounded-lg border-2 border-blue-500/50 bg-blue-500/20 px-4 py-2 backdrop-blur-sm"
        >
          <FaGamepad className="text-blue-400" />
          <div>
            <p className="text-xs text-blue-300">Moves</p>
            <p className="text-lg font-bold text-white">{movesCount}</p>
          </div>
        </motion.div>

        {/* Duration Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 rounded-lg border-2 border-purple-500/50 bg-purple-500/20 px-4 py-2 backdrop-blur-sm"
        >
          <FaClock className="text-purple-400" />
          <div>
            <p className="text-xs text-purple-300">Duration</p>
            <p className="text-lg font-bold text-white">{formatDuration(gameDuration)}</p>
          </div>
        </motion.div>
      </div>

      {/* Players List with Avatars */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {players.map((player, index) => (
          <PlayerProfile
            key={player.VerificationId}
            player={player}
            isCurrentTurn={player.VerificationId.toString() === currentPlayerId.toString()}
            isCurrentUser={player.VerificationId === userPlayerId}
            playerIndex={index}
          />
        ))}
      </div>
    </div>
  );
}

export default Header;