"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sour_Gummy } from "next/font/google";
import { PlayerType } from "@/constants/GameRoom";

const SourGummy = Sour_Gummy({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

interface WinnerModalProps {
  winner: {
    playerId: string;
    playerName: string;
    score: number;
  };
  players: PlayerType[];
  roomId: string;
  onPlayAgain?: () => void;
}

function WinnerModal({ winner, players, roomId, onPlayAgain }: WinnerModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const handleReturnToLobby = () => {
    router.push("/");
  };

  const handleShare = () => {
    const shareText = `🎮 I just won a game with ${winner.score} points! Room: ${roomId}`;
    if (navigator.share) {
      navigator.share({
        title: "Multiplotter Game Victory!",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#3b82f6",
                    "#ef4444",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#ec4899",
                  ][Math.floor(Math.random() * 6)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-b from-purple-900/95 to-black/95 p-8 shadow-2xl shadow-yellow-500/30">
        {/* Trophy Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-6xl shadow-lg shadow-yellow-500/50 animate-pulse">
            🏆
          </div>
        </div>

        {/* Winner Announcement */}
        <h1
          className={`${SourGummy.className} mb-2 text-center text-5xl font-bold text-yellow-400 drop-shadow-lg`}
        >
          WINNER!
        </h1>
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          {winner.playerName}
        </h2>

        {/* Final Scores */}
        <div className="mb-8 space-y-3">
          <h3 className="mb-4 text-center text-xl font-semibold text-white/80">
            Final Scores
          </h3>
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                player.VerificationId === winner.playerId
                  ? "border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/30"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-white/60">
                  #{index + 1}
                </span>
                {player.avatar && (
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-white/30"
                  />
                )}
                <span className="text-lg font-semibold text-white">
                  {player.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-400">
                  {player.score}
                </span>
                <span className="text-sm text-white/60">points</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/70"
            >
              🎮 Play Again
            </button>
          )}
          <button
            onClick={handleReturnToLobby}
            className="flex-1 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-yellow-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/70"
          >
            🏠 Return to Lobby
            </button>
          <button
            onClick={handleShare}
            className="flex-1 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20"
          >
            📤 Share Results
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default WinnerModal;