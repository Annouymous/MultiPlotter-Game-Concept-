"use client";

import React from "react";
import { motion } from "framer-motion";

interface GracefulDegradationProps {
  feature: string;
  fallbackContent?: React.ReactNode;
  onRetry?: () => void;
}

export const GracefulDegradation: React.FC<GracefulDegradationProps> = ({
  feature,
  fallbackContent,
  onRetry,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <div className="w-16 h-16 mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Message */}
      <h3 className="text-lg font-bold text-white mb-2">
        {feature} Unavailable
      </h3>
      <p className="text-sm text-purple-300 text-center mb-6 max-w-sm">
        This feature is temporarily unavailable. The game will continue with limited functionality.
      </p>

      {/* Fallback content */}
      {fallbackContent && (
        <div className="w-full mb-4">
          {fallbackContent}
        </div>
      )}

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-105"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

// Network error fallback
export const NetworkErrorFallback: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Disconnected icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Connection Lost
        </h2>
        <p className="text-purple-300 mb-6 max-w-md">
          Unable to connect to the game server. Please check your internet connection and try again.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Reconnect
          </button>
        )}
      </motion.div>
    </div>
  );
};

// Data loading error fallback
export const DataLoadErrorFallback: React.FC<{
  dataType: string;
  onRetry?: () => void;
}> = ({ dataType, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30">
      <div className="w-16 h-16 mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        Failed to Load {dataType}
      </h3>
      <p className="text-sm text-purple-300 text-center mb-6 max-w-sm">
        We couldn't load the {dataType.toLowerCase()}. This might be a temporary issue.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all transform hover:scale-105"
        >
          Retry Loading
        </button>
      )}
    </div>
  );
};