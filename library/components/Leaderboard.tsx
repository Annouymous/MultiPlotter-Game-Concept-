"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  avatar?: string;
  score: number;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  entries?: LeaderboardEntry[];
  currentPlayerId?: string;
}

type TimeFilter = "daily" | "weekly" | "all-time";

export const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  entries = [],
  currentPlayerId,
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all-time");
  const [viewType, setViewType] = useState<"global" | "friends">("global");

  // Mock data for demonstration
  const mockEntries: LeaderboardEntry[] = entries.length > 0 ? entries : [
    {
      rank: 1,
      playerId: "1",
      playerName: "ProGamer123",
      avatar: "🏆",
      score: 15420,
      wins: 89,
      gamesPlayed: 120,
      winRate: 74.2,
    },
    {
      rank: 2,
      playerId: "2",
      playerName: "CardMaster",
      avatar: "🎮",
      score: 14850,
      wins: 82,
      gamesPlayed: 115,
      winRate: 71.3,
    },
    {
      rank: 3,
      playerId: "3",
      playerName: "MemoryKing",
      avatar: "👑",
      score: 13990,
      wins: 75,
      gamesPlayed: 110,
      winRate: 68.2,
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-orange-500";
    if (rank === 2) return "from-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-600 to-orange-700";
    return "from-purple-500 to-blue-500";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
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
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    🏆 Leaderboard
                  </h2>
                  <p className="text-sm text-purple-300">
                    Top players across all games
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

              {/* View type tabs */}
              <div className="flex gap-2 mb-4">
                {(["global", "friends"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      viewType === type
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-white/10 text-purple-300 hover:bg-white/20"
                    }`}
                  >
                    {type === "global" ? "🌍 Global" : "👥 Friends"}
                  </button>
                ))}
              </div>

              {/* Time filters */}
              <div className="flex gap-2">
                {(["daily", "weekly", "all-time"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      timeFilter === filter
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    {filter === "daily"
                      ? "📅 Daily"
                      : filter === "weekly"
                      ? "📆 Weekly"
                      : "🏅 All Time"}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard entries */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {viewType === "friends" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">👥</span>
                  </div>
                  <p className="text-purple-300 text-lg mb-2">
                    Friends Leaderboard Coming Soon!
                  </p>
                  <p className="text-purple-400 text-sm">
                    Add friends to compete with them on the leaderboard
                  </p>
                </div>
              ) : mockEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <p className="text-purple-300 text-lg mb-2">No rankings yet</p>
                  <p className="text-purple-400 text-sm">
                    Be the first to make it to the leaderboard!
                  </p>
                </div>
              ) : (
                mockEntries.map((entry, index) => (
                  <LeaderboardEntryCard
                    key={entry.playerId}
                    entry={entry}
                    index={index}
                    isCurrentPlayer={entry.playerId === currentPlayerId}
                  />
                ))
              )}
            </div>

            {/* Current player position (if not in top 10) */}
            {currentPlayerId && !mockEntries.find((e) => e.playerId === currentPlayerId) && (
              <div className="p-4 border-t border-purple-500/30 bg-gradient-to-r from-purple-900/60 to-blue-900/60">
                <p className="text-xs text-purple-400 mb-2">Your Position</p>
                <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">#42</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">You</p>
                    <p className="text-sm text-purple-300">8,450 points</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-400">Win Rate</p>
                    <p className="text-white font-bold">65.5%</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Individual leaderboard entry card
const LeaderboardEntryCard: React.FC<{
  entry: LeaderboardEntry;
  index: number;
  isCurrentPlayer: boolean;
}> = ({ entry, index, isCurrentPlayer }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-orange-500";
    if (rank === 2) return "from-gray-400 to-gray-500";
    if (rank === 3) return "from-orange-600 to-orange-700";
    return "from-purple-500 to-blue-500";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
        isCurrentPlayer
          ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-2 border-purple-500"
          : "bg-white/5 hover:bg-white/10"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Rank badge */}
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(
          entry.rank
        )} flex items-center justify-center flex-shrink-0`}
      >
        <span className="text-white font-bold text-lg">
          {getRankIcon(entry.rank)}
        </span>
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl flex-shrink-0">
        {entry.avatar || "👤"}
      </div>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold truncate">
          {entry.playerName}
          {isCurrentPlayer && (
            <span className="ml-2 text-xs text-purple-300">(You)</span>
          )}
        </p>
        <p className="text-sm text-purple-300">
          {entry.wins} wins • {entry.gamesPlayed} games
        </p>
      </div>

      {/* Stats */}
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-bold text-white">{entry.score.toLocaleString()}</p>
        <p className="text-xs text-purple-400">{entry.winRate}% win rate</p>
      </div>
    </motion.div>
  );
};