import { Timestamp } from "firebase/firestore";
import { StaticImageData } from "next/image";

// Card type
export interface Card {
  picture?: string | StaticImageData | undefined;
  isFlipped?: boolean;
  isMatched?: boolean;
  identifier?: string;
  id?: number;
  flippedBy?: string;
  matchedBy?: string;
  flippedAt?: number | null;
  matchedAt?: number | null;
}

// Player type
export interface PlayerType {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isConnected: boolean;
  isJoined: boolean;
  VerificationId: string;
  color?: string; // Player color for card borders
}

// Game states enum - UNIFIED
export enum GAME_STATES {
  LOBBY = "LOBBY",
  WAITING = "WAITING",
  READY = "READY",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
}

// Player colors for card borders
export const PLAYER_COLORS = {
  PLAYER_1: "#3b82f6", // Blue
  PLAYER_2: "#ef4444", // Red
  PLAYER_3: "#10b981", // Green
  PLAYER_4: "#f59e0b", // Amber
};

// Get player color by index
export const getPlayerColor = (playerIndex: number): string => {
  const colors = Object.values(PLAYER_COLORS);
  return colors[playerIndex % colors.length];
};

// Room type
export interface RoomType {
  roomId: string;
  Host: PlayerType;
  maxPlayers: number;
  players: PlayerType[];
  turnOrder: number[];
  currentPlayerId: number;
  gameMode: string;
  gameState: GAME_STATES;
  gameCards: Card[];
  lastMove: Card | null;
  duration: number; // in seconds
  turnStartedAt?: Timestamp | null; // When current turn started
  turnTimeLimit?: number; // Time limit per turn in seconds (default 30)
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  lastMoveAt: Timestamp | null;
  lastMovePlayerId: string | null;
  createdAt: Timestamp;
  isGameFinished: boolean;
  winner?: {
    playerId: string;
    playerName: string;
    score: number;
    finishedAt: Timestamp;
  } | null;
}

// Move history type for tracking
export interface MoveHistory {
  playerId: string;
  playerName: string;
  cardId: number;
  timestamp: Timestamp;
  wasMatch: boolean;
  scoreChange: number;
}