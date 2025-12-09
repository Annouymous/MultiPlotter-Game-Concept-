"use client";

import React from "react";
import { motion } from "framer-motion";

interface GameStatsProps {
  totalGames: number;
  wins: number;
  losses: number;
  averageScore: number;
  bestScore: number;
  totalPlayTime: number; // in seconds
  favoriteMode?: "16x16" | "32x32";
}

export const GameStats: React.FC<GameStatsProps> = ({
  totalGames,
  wins,
  losses,
  averageScore,
  bestScore,
  totalPlayTime,
  favoriteMode,
}) => {
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const stats = [
    {
      label: "Total Games",
      value: totalGames,
      icon: "🎮",
      color: "from-purple-500 to-blue-500",
    },
    {
      label: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      icon: "🏆",
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Best Score",
      value: bestScore,
      icon: "⭐",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Avg Score",
      value: averageScore.toFixed(1),
      icon: "📊",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Play Time",
      value: formatPlayTime(totalPlayTime),
      icon: "⏱️",
      color: "from-pink-500 to-rose-500",
    },
    {
      label: "Favorite Mode",
      value: favoriteMode || "N/A",
      icon: "❤️",
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`p-4 bg-gradient-to-br ${stat.color} bg-opacity-20 backdrop-blur-sm border border-white/20 rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-xs text-white/80">{stat.label}</p>
          </div>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </motion.div>
      ))}

      {/* Win/Loss breakdown */}
      <motion.div
        className="col-span-2 md:col-span-3 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-purple-500/30 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-purple-300 mb-3">Win/Loss Record</p>
        <div className="flex gap-2 mb-2">
          <div
            className="h-4 bg-green-500 rounded-l"
            style={{ width: `${(wins / totalGames) * 100}%` }}
          />
          <div
            className="h-4 bg-red-500 rounded-r"
            style={{ width: `${(losses / totalGames) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-400">{wins} Wins</span>
          <span className="text-red-400">{losses} Losses</span>
        </div>
      </motion.div>
    </div>
  );
};