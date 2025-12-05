"use client";
import React, { useState } from "react";
import { RoomType, GAME_STATES, PlayerType } from "@/constants/GameRoom";
import { Button } from "@/components/ui/button";
import { FaCopy, FaCheck, FaShare, FaCrown, FaUser } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { setPlayerReady, startGame, leaveRoom } from "../functions/OnlineGameManagement";
import { useRouter } from "next/navigation";
import QRCodeShare from "./QRCodeShare";
import { motion } from "framer-motion";

interface LobbyScreenProps {
  room: RoomType;
  currentPlayerId: string;
}

function LobbyScreen({ room, currentPlayerId }: LobbyScreenProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const isHost = room.Host.VerificationId === currentPlayerId;
  const currentPlayer = room.players.find((p) => p.VerificationId === currentPlayerId);
  const allReady = room.players.every((p) => p.isReady || p.VerificationId === room.Host.VerificationId);
  const canStart = room.players.length >= 2 && allReady;

  const handleCopyRoomCode = () => {
    const roomUrl = `${window.location.origin}/modes/online/${room.gameMode}/${room.roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    toast.success("Room link copied!", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = async () => {
    if (!currentPlayer) return;
    await setPlayerReady(room.roomId, currentPlayerId, !currentPlayer.isReady);
  };

  const handleStartGame = async () => {
    if (!isHost) return;
    await startGame(room.roomId, currentPlayerId);
  };

  const handleLeaveRoom = async () => {
    await leaveRoom(room.roomId, currentPlayerId);
    router.push("/");
  };

  const handleShare = () => {
    const roomUrl = `${window.location.origin}/modes/online/${room.gameMode}/${room.roomId}`;
    if (navigator.share) {
      navigator.share({
        title: "Join my game!",
        text: `Join my multiplayer card game! Room: ${room.roomId}`,
        url: roomUrl,
      });
    } else {
      handleCopyRoomCode();
    }
  };

  const roomUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/modes/online/${room.gameMode}/${room.roomId}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-white">Game Lobby</h1>
          <p className="text-lg text-white/70">
            Waiting for players... ({room.players.length}/{room.maxPlayers})
          </p>
        </motion.div>

        {/* Room Code Card with Enhanced UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-white/20 bg-black/40 p-6 backdrop-blur-md"
        >
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/70">
            Room Code
          </p>
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="rounded-lg bg-white/10 px-8 py-4">
              <p className="font-mono text-4xl font-bold tracking-widest text-white">
                {room.roomId}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleCopyRoomCode}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              onClick={handleShare}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <FaShare />
              Share
            </Button>
            <QRCodeShare roomUrl={roomUrl} roomCode={room.roomId} />
          </div>
        </motion.div>

        {/* Players Grid with Animations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-white/20 bg-black/40 p-6 backdrop-blur-md"
        >
          <h2 className="mb-4 text-2xl font-bold text-white">Players</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {room.players.map((player, index) => (
              <PlayerSlot
                key={player.VerificationId}
                player={player}
                isHost={player.VerificationId === room.Host.VerificationId}
                playerIndex={index}
              />
            ))}
            {/* Empty slots */}
            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <EmptyPlayerSlot key={`empty-${i}`} />
            ))}
          </div>
        </motion.div>

        {/* Action Buttons with Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          {!isHost && (
            <Button
              onClick={handleToggleReady}
              className={`flex-1 py-6 text-lg font-bold sm:flex-none sm:px-12 ${
                currentPlayer?.isReady
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {currentPlayer?.isReady ? "✓ Ready" : "Ready Up"}
            </Button>
          )}
          {isHost && (
            <Button
              onClick={handleStartGame}
              disabled={!canStart}
              className={`flex-1 py-6 text-lg font-bold sm:flex-none sm:px-12 ${
                canStart
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-600"
              }`}
            >
              {canStart ? "🎮 Start Game" : "Waiting for players..."}
            </Button>
          )}
          <Button
            onClick={handleLeaveRoom}
            className="flex-1 bg-red-600 py-6 text-lg font-bold hover:bg-red-700 sm:flex-none sm:px-12"
          >
            Leave Room
          </Button>
        </motion.div>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-white/60"
        >
          <p>Game Mode: {room.gameMode}</p>
          <p>Turn Time Limit: {room.turnTimeLimit || 30} seconds</p>
        </motion.div>
      </div>
    </div>
  );
}

// Player Slot Component with Avatar Support
function PlayerSlot({
  player,
  isHost,
  playerIndex,
}: {
  player: PlayerType;
  isHost: boolean;
  playerIndex: number;
}) {
  const playerColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];
  const borderColor = playerColors[playerIndex % playerColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: playerIndex * 0.1 }}
      className="flex items-center gap-4 rounded-xl border-2 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
      style={{ borderColor }}
    >
      {/* Avatar */}
      <div
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white"
        style={{ backgroundColor: borderColor }}
      >
        {player.avatar ? (
          <Image
            src={player.avatar}
            alt={player.name}
            fill
            className="object-cover"
          />
        ) : (
          <FaUser />
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-white">{player.name}</p>
          {isHost && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black">
              <FaCrown /> HOST
            </span>
          )}
        </div>
        <p className="text-sm text-white/60">Score: {player.score}</p>
      </div>

      {/* Ready Status */}
      <div>
        {player.isReady || isHost ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white"
          >
            ✓ Ready
          </motion.span>
        ) : (
          <span className="rounded-full bg-gray-600 px-3 py-1 text-sm font-bold text-white">
            Not Ready
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Empty Player Slot Component
function EmptyPlayerSlot() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-4 backdrop-blur-sm"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl text-white/30">
        <FaUser />
      </div>
      <div className="flex-1">
        <p className="text-lg font-bold text-white/30">Waiting for player...</p>
      </div>
    </motion.div>
  );
}

export default LobbyScreen;