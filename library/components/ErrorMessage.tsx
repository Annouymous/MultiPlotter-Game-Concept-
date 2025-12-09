"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning" | "info";
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = "error",
  onClose,
  action,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const config = {
    error: {
      bg: "from-red-900/40 to-red-800/40",
      border: "border-red-500/50",
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
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
      ),
    },
    warning: {
      bg: "from-yellow-900/40 to-yellow-800/40",
      border: "border-yellow-500/50",
      icon: (
        <svg
          className="w-6 h-6 text-yellow-500"
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
      ),
    },
    info: {
      bg: "from-blue-900/40 to-blue-800/40",
      border: "border-blue-500/50",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const currentConfig = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r ${currentConfig.bg} backdrop-blur-xl border ${currentConfig.border} shadow-lg`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">{currentConfig.icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white">{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium text-purple-300 hover:text-purple-200 underline"
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Error message container for multiple messages
export const ErrorMessageContainer: React.FC<{
  messages: Array<{ id: string; message: string; type?: "error" | "warning" | "info" }>;
  onRemove: (id: string) => void;
}> = ({ messages, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
      <AnimatePresence>
        {messages.map((msg) => (
          <ErrorMessage
            key={msg.id}
            message={msg.message}
            type={msg.type}
            onClose={() => onRemove(msg.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};