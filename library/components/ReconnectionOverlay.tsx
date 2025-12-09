"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

interface ReconnectionOverlayProps {
  show?: boolean;
  onReconnect?: () => void;
}

export const ReconnectionOverlay: React.FC<ReconnectionOverlayProps> = ({
  show: externalShow,
  onReconnect,
}) => {
  const { status, isReconnecting, reconnectAttempts, manualReconnect, latency } =
    useConnectionStatus();

  const show = externalShow !== undefined ? externalShow : isReconnecting;

  const handleReconnect = () => {
    manualReconnect();
    onReconnect?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-md w-full mx-4 p-8 bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Animated connection icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Pulsing rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-purple-500"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                      scale: [1, 2, 2.5],
                      opacity: [0.5, 0.2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}

                {/* Center icon */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  </images/SVGIcon.jpg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </motion.svg>
                </div>
              </div>
            </div>

            {/* Status message */}
            <h2 className="text-2xl font-bold text-center text-white mb-3">
              Reconnecting...
            </h2>
            <p className="text-purple-200 text-center mb-6">
              {reconnectAttempts > 0
                ? `Attempt ${reconnectAttempts + 1} - Please wait while we restore your connection.`
                : "Please wait while we restore your connection."}
            </p>

            {/* Connection quality indicator */}
            {latency !== null && (
              <div className="mb-6 p-4 bg-black/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">Connection Quality:</span>
                  <span
                    className={`font-bold ${
                      latency < 200
                        ? "text-green-400"
                        : latency < 500
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {latency}ms
                  </span>
                </div>
                <div className="mt-2 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      latency < 200
                        ? "bg-green-500"
                        : latency < 500
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, 100 - latency / 10)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Loading dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Manual reconnect button */}
            {reconnectAttempts > 2 && (
              <button
                onClick={handleReconnect}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Try Again Now
              </button>
            )}

            {/* Tips */}
            <p className="text-xs text-purple-400 text-center mt-4">
              💡 Tip: Check your internet connection if this takes too long
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Connection status indicator (small badge)
export const ConnectionStatusBadge: React.FC = () => {
  const { status, latency } = useConnectionStatus();

  const config = {
    online: {
      color: "bg-green-500",
      text: "Connected",
      icon: "●",
    },
    offline: {
      color: "bg-red-500",
      text: "Offline",
      icon: "●",
    },
    reconnecting: {
      color: "bg-yellow-500",
      text: "Reconnecting",
      icon: "●",
    },
    unstable: {
      color: "bg-orange-500",
      text: "Unstable",
      icon: "●",
    },
  };

  const current = config[status];

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full border border-purple-500/30"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.span
        className={`w-2 h-2 rounded-full ${current.color}`}
        animate={
          status === "reconnecting"
            ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
            : {}
        }
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className="text-xs text-white font-medium">{current.text}</span>
      {latency !== null && status === "online" && (
        <span className="text-xs text-purple-300">({latency}ms)</span>
      )}
    </motion.div>
  );
};