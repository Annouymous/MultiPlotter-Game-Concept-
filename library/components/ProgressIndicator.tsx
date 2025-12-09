"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  progress: number; // 0-100
  message?: string;
  steps?: string[];
  currentStep?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  message,
  steps,
  currentStep = 0,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Progress bar */}
      <div className="relative h-3 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/30">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* Percentage */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-purple-300">{message || "Loading..."}</span>
        <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
      </div>

      {/* Steps indicator */}
      {steps && steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.4,
                x: 0,
              }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Step indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  index < currentStep
                    ? "bg-green-500 border-green-500"
                    : index === currentStep
                    ? "bg-purple-500 border-purple-500 animate-pulse"
                    : "bg-transparent border-purple-500/30"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-xs text-purple-300">{index + 1}</span>
                )}
              </div>

              {/* Step text */}
              <span
                className={`text-sm ${
                  index <= currentStep ? "text-purple-200" : "text-purple-400/50"
                }`}
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Game initialization progress
export const GameInitProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    "Connecting to game server...",
    "Loading game assets...",
    "Shuffling cards...",
    "Preparing game board...",
    "Ready to play!",
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const step = Math.floor((progress / 100) * steps.length);
    setCurrentStep(Math.min(step, steps.length - 1));
  }, [progress, steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-lg px-8">
        <ProgressIndicator
          progress={progress}
          steps={steps}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
};