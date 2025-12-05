import { v4 as uuid4 } from "uuid";
import { Host } from "./GenerateHost";
import { GAME_STATES } from "@/constants/GameRoom";
import { serverTimestamp } from "firebase/firestore";

const host = Host;
export const RoomObj = {
  roomId: null,
  Host: host,
  maxPlayers: 2,
  players: [host],
  turnOrder: [0, 1],
  currentPlayerId: "",
  gameMode: null,
  gameState: GAME_STATES.LOBBY,
  gameCards: null,
  lastMove: null,
  duration: 0,
  startedAt: null,
  endedAt: null,
  lastMoveAt: null,
  lastMovePlayerId: null,
  // createdAt: Timestamp.now(), //Not Working Right now ...
  createdAt: serverTimestamp(),
  isGameFinished: false,
};