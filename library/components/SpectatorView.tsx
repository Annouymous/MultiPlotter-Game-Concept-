"use client";

import React from "react";
import { motion } from "framer-motion";

interface SpectatorViewProps {
  isSpectator: boolean;
  onJoinAsPlayer?: () => void;
  availableSlots?: number;
}

export const SpectatorView: React.FC<SpectatorViewProps> = ({
  isSpectator,
  onJoinAsPlayer,
  availableSlots = 0,
}) => {
  if (!isSpectator) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-sm border-b border-purple-500/30 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Spectator badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/50">
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="text-sm font-bold text-white">
              👁️ Spectator Mode
            </span>
          </div>

          <p className="text-sm text-purple-200 hidden md:block">
            You're watching this game. Interactions are disabled.
          </p>
        </div>

        {/* Join as player button */}
        {availableSlots > 0 && onJoinAsPlayer && (
          <motion.button
            onClick={onJoinAsPlayer}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join as Player ({availableSlots} {availableSlots === 1 ? "slot" : "slots"} available)
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Spectator badge for player list
export const SpectatorBadge: React.FC<{ count?: number }> = ({ count = 0 }) => {
  if (count === 0) return null;

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <svg
        className="w-4 h-4 text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className="text-xs font-medium text-purple-200">
        {count} {count === 1 ? "spectator" : "spectators"}
      </span>
    </motion.div>
  );
};

// Spectator overlay for cards (disables interaction)
export const SpectatorCardOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] rounded-lg flex items-center justify-center cursor-not-allowed">
      <div className="text-white/60 text-xs font-medium">Spectating</div>
    </div>
  );
};