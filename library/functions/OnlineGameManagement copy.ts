import { CardTypeOnline } from "@config/session";
import { doc, runTransaction } from "firebase/firestore";
import { DB } from "../../Firebase/config";

export const handleMatchLogic = async (
  card: CardTypeOnline,
  roomId: string,
  playerId: string,
) => {
  const roomRef = doc(DB, "rooms", roomId);

  await runTransaction(DB, async (transaction) => {
    const roomDoc = await transaction.get(roomRef);
    const roomData = roomDoc.data();

    if (!roomData) throw new Error("Room not found");

    const { players, lastMove, gameCards, currentPlayerId, turnOrder } =
      roomData;

    if (!lastMove) {
      transaction.update(roomRef, {
        lastMove: card,
        gameCards: gameCards.map((c: CardTypeOnline) =>
          c.id === card.id ? { ...c, isFlipped: true, flippedBy: playerId } : c,
        ),
      });
    } else {
      if (lastMove.identifier === card.identifier) {
        transaction.update(roomRef, {
          lastMove: null,
          gameCards: gameCards.map((c: CardTypeOnline) =>
            c.id === card.id || c.id === lastMove.id
              ? { ...c, isFlipped: true } // Keep both cards flipped
              : c,
          ),
          currentPlayerId, // Same player gets another turn
        });
      } else {
        const nextPlayerId =
          turnOrder[
            (turnOrder.indexOf(currentPlayerId) + 1) % turnOrder.length
          ];
        transaction.update(roomRef, {
          lastMove: null,
          gameCards: gameCards.map((c: CardTypeOnline) =>
            c.id === card.id || c.id === lastMove.id
              ? { ...c, isFlipped: false } // Flip both cards back
              : c,
          ),
          currentPlayerId: nextPlayerId, // Pass turn to the next player
        });
      }
    }
  });
};
