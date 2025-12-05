import { Timestamp } from "firebase/firestore"; // Assuming you're using Firebase for timestamps
import { StaticImageData } from "next/image";

// Card type
export interface Card {
  picture?: string | StaticImageData | undefined;
  isFlipped?: boolean;
  identifier?: string;
  id?: number;
  flippedBy?: string;
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
}

// Game states enum
export enum GAME_STATES {
  LOBBY = "LOBBY",
  STARTED = "STARTED",
  ENDED = "ENDED",
  // Add other game states if needed
}

// Room type
export interface RoomType {
  roomId: string;
  Host: PlayerType;
  maxPlayers: number;
  players: PlayerType[];
  turnOrder: number[];
  currentPlayerId: number;
  gameMode: string; // You can make it an enum if gameMode has specific options
  gameState: GAME_STATES;
  gameCards: Card[];
  lastMove: Card | null;
  duration: number; // in seconds
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;
  lastMoveAt: Timestamp | null;
  lastMovePlayerId: string | null;
  createdAt: Timestamp;
  isGameFinished: boolean;
}
