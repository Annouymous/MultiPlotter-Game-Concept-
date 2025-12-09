"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameRecord {
  id: string;
  date: Date;
  gameMode: "16x16" | "32x32";
  duration: number; // in seconds
  players: Array<{
    id: string;
    name: string;
    avatar?: string;
    score: number;
    isWinner: boolean;
  }>;
  totalMoves: number;
  roomCode: string;
}

interface GameHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  games?: GameRecord[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  isOpen,
  onClose,
  games = [],
}) => {
  const [filter, setFilter] = useState<"all" | "won" | "lost">("all");

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    const currentPlayer = game.players.find((p) => p.id === "current-user-id"); // Replace with actual user ID
    if (filter === "won") return currentPlayer?.isWinner;
    if (filter === "lost") return !currentPlayer?.isWinner;
    return true;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] z-50 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Game History
                </h2>
                <p className="text-sm text-purple-300">
                  {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-4 border-b border-purple-500/30">
              {(["all", "won", "lost"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-white/10 text-purple-300 hover:bg-white/20"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Games list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredGames.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-purple-300 text-lg mb-2">No games found</p>
                  <p className="text-purple-400 text-sm">
                    Start playing to build your game history!
                  </p>
                </div>
              ) : (
                filteredGames.map((game, index) => (
                  <GameHistoryCard key={game.id} game={game} index={index} />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Individual game card
const GameHistoryCard: React.FC<{ game: GameRecord; index: number }> = ({
  game,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const winner = game.players.find((p) => p.isWinner);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Card header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Winner badge */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>

          {/* Game info */}
          <div className="text-left">
            <h3 className="text-white font-bold mb-1">
              {game.gameMode} Game
            </h3>
            <p className="text-sm text-purple-300">
              {formatDate(game.date)} • {formatDuration(game.duration)}
            </p>
          </div>
        </div>

        {/* Expand icon */}
        </images/Game.jpg
          className="w-6 h-6 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </images/Animation.jpg>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-purple-500/30 p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {/* Winner */}
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-400 mb-2">Winner</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">
                  {winner?.avatar || "👤"}
                </div>
                <div>
                  <p className="text-white font-bold">{winner?.name}</p>
                  <p className="text-sm text-yellow-300">{winner?.score} points</p>
                </div>
              </div>
            </div>

            {/* All players */}
            <div className="space-y-2">
              <p className="text-xs text-purple-400 mb-2">All Players</p>
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                      {player.avatar || "👤"}
                    </div>
                    <span className="text-sm text-white">{player.name}</span>
                  </div>
                  <span className="text-sm font-bold text-purple-300">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-purple-400 mb-1">Total Moves</p>
                <p className="text-lg font-bold text-white">{game.totalMoves}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-purple-400 mb-1">Room Code</p>
                <p className="text-lg font-bold text-white font-mono">
                  {game.roomCode}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};