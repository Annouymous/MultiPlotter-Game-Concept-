"use client";
import React from "react";
import { useSoundManager } from "@/hooks/useSoundManger";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

function SoundControl() {
  const { isMuted, toggleMute } = useSoundManager();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/70"
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <FaVolumeMute className="text-2xl" />
      ) : (
        <FaVolumeUp className="text-2xl" />
      )}
    </button>
  );
}

export default SoundControl;