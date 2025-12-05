"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCog, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface RoomSettingsProps {
  onSave: (settings: GameSettings) => void;
  currentSettings?: GameSettings;
}

export interface GameSettings {
  gameMode: "16x16" | "32x32";
  maxPlayers: 2 | 3 | 4;
  turnTimeLimit: 15 | 30 | 45 | 60;
  isPrivate: boolean;
}

export default function RoomSettings({ onSave, currentSettings }: RoomSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(
    currentSettings || {
      gameMode: "16x16",
      maxPlayers: 4,
      turnTimeLimit: 30,
      isPrivate: false,
    }
  );

  const handleSave = () => {
    onSave(settings);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <FaCog /> Room Settings
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md space-y-6 rounded-2xl border-2 border-white/20 bg-black/90 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Room Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                {/* Game Mode */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Game Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["16x16", "32x32"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSettings({ ...settings, gameMode: mode })}
                        className={`rounded-lg border-2 py-3 font-bold transition-all ${
                          settings.gameMode === mode
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Players */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Max Players
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([2, 3, 4] as const).map((num) => (
                      <button
                        key={num}
                        onClick={() => setSettings({ ...settings, maxPlayers: num })}
                        className={`rounded-lg border-2 py-3 font-bold transition-all ${
                          settings.maxPlayers === num
                            ? "border-green-500 bg-green-500/20 text-green-400"
                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Turn Time Limit */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Turn Time Limit (seconds)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {([15, 30, 45, 60] as const).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSettings({ ...settings, turnTimeLimit: time })}
                        className={`rounded-lg border-2 py-3 text-sm font-bold transition-all ${
                          settings.turnTimeLimit === time
                            ? "border-yellow-500 bg-yellow-500/20 text-yellow-400"
                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {time}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private Room Toggle */}
                <div className="flex items-center justify-between rounded-lg border-2 border-white/20 bg-white/5 p-4">
                  <span className="font-semibold text-white">Private Room</span>
                  <button
                    onClick={() => setSettings({ ...settings, isPrivate: !settings.isPrivate })}
                    className={`relative h-8 w-14 rounded-full transition-colors ${
                      settings.isPrivate ? "bg-purple-500" : "bg-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.isPrivate ? 24 : 0 }}
                      className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-lg"
                    />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-bold hover:from-blue-700 hover:to-purple-700"
              >
                Save Settings
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}