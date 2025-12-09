"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  type?: "card" | "player" | "stat" | "custom";
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "card",
  count = 1,
  className = "",
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <motion.div
            className={`relative aspect-square rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 ${className}`}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg" />
          </motion.div>
        );

      case "player":
        return (
          <motion.div
            className={`flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 ${className}`}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Avatar skeleton */}
            <div className="w-12 h-12 rounded-full bg-purple-500/20" />
            
            {/* Name and score skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-purple-500/20 rounded w-24" />
              <div className="h-3 bg-purple-500/20 rounded w-16" />
            </div>
            
            {/* Status skeleton */}
            <div className="w-20 h-6 bg-purple-500/20 rounded" />
          </motion.div>
        );

      case "stat":
        return (
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 ${className}`}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-5 h-5 rounded bg-purple-500/20" />
            <div className="h-4 bg-purple-500/20 rounded w-16" />
          </motion.div>
        );

      case "custom":
        return (
          <motion.div
            className={`bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg ${className}`}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

// Grid skeleton for card layout
export const CardGridSkeleton: React.FC<{ gridSize: "4x4" | "8x8" }> = ({
  gridSize,
}) => {
  const cardCount = gridSize === "4x4" ? 16 : 64;
  const gridCols = gridSize === "4x4" ? "grid-cols-4" : "grid-cols-8";

  return (
    <div className={`grid ${gridCols} gap-2 md:gap-4 p-4`}>
      <SkeletonLoader type="card" count={cardCount} />
    </div>
  );
};

// Player list skeleton
export const PlayerListSkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => {
  return (
    <div className="space-y-3">
      <SkeletonLoader type="player" count={count} />
    </div>
  );
};