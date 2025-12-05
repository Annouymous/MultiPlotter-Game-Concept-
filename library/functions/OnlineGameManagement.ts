import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { Card, RoomType } from "@/constants/GameRoom";
import { DB } from "@/Firebase/config";

export const handleMatchLogic = async (
  card: Card,
  roomId: string,
  playerId: string,
  OnlineGameSession: RoomType
) => {
  const opponent = OnlineGameSession.players.filter(
    (p) => p.VerificationId !== playerId
  );
  const roomRef = doc(DB, "rooms", roomId);
  const { players, lastMove, gameCards, currentPlayerId, turnOrder } =
    OnlineGameSession;
  if (!lastMove) {
    updateDoc(roomRef, {
      currentPlayerId: opponent[0]?.VerificationId, // Pass turn to the next player
      lastMove: card,
      gameCards: gameCards.map((c: Card) =>
        c.id === card.id ? { ...c, isFlipped: true, flippedBy: playerId } : c
      ),
    });
  } else {
    if (lastMove.identifier === card.identifier) {
      updateDoc(roomRef, {
        lastMove: null,
        players: players.map((p) => {
          if (p.VerificationId === playerId) {
            return { ...p, score: p.score + 1 };
          }
          return p;
        }),
        gameCards: gameCards.map((c: Card) =>
          c.id === card.id || c.id === lastMove.id
            ? { ...c, isFlipped: true } // Keep both cards flipped
            : c
        ),
        currentPlayerId: playerId, // Same player gets another turn
      });
    } else {
      const nextPlayerId =
        turnOrder[(turnOrder.indexOf(currentPlayerId) + 1) % turnOrder.length];
      setTimeout(() => {
        updateDoc(roomRef, {
          lastMove: null,
          gameCards: gameCards.map((c: Card) =>
            c.id === card.id || c.id === lastMove.id
              ? { ...c, isFlipped: false } // Flip both cards back
              : c
          ),
          currentPlayerId: opponent[0]?.VerificationId, // Pass turn to the next player
        });
      }, 1000);
    }
    updateDoc(roomRef, {
      lastMove: null,
      gameCards: gameCards.map((c: Card) =>
        c.id === card.id || c.id === lastMove.id
          ? { ...c, isFlipped: true } // Flip both cards back
          : c
      ),
    });
  }
};
