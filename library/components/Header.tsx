"use client";
import React from "react";
import { PlayerType } from "@/constants/GameRoom";
import PlayerProfile from "./PlayerProfile";
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
  gameDuration = 0
}: HeaderProps) {
  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Players Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full flex-wrap items-center justify-center gap-4 rounded-xl border-2 border-white/20 bg-black/40 p-4 backdrop-blur-md"
      >
        {players.map((player, index) => (
          <PlayerProfile
            key={player.VerificationId}
            player={player}
            isCurrentTurn={currentPlayerId.toString() === player.VerificationId.toString()}
            isCurrentUser={userPlayerId === player.VerificationId}
            playerIndex={index}
          />
        ))}
      </motion.div>

      {/* Game Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex w-full items-center justify-center gap-4"
      >
        {/* Moves Counter */}
        <div className="flex items-center gap-2 rounded-full border-2 border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-2xl">🎯</span>
          <div className="text-left">
            <p className="text-xs font-semibold text-white/60">Moves</p>
            <p className="text-lg font-bold text-white">{movesCount}</p>
          </div>
        </div>

        {/* Game Duration */}
        <div className="flex items-center gap-2 rounded-full border-2 border-purple-500/30 bg-purple-500/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-2xl">⏱️</span>
          <div className="text-left">
            <p className="text-xs font-semibold text-white/60">Duration</p>
            <p className="text-lg font-bold text-white">{formatDuration(gameDuration)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Header;