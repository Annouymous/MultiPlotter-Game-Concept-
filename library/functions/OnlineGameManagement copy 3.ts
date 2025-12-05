import { CardTypeOnline, RoomType } from "@config/session";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { DB } from "../../Firebase/config";

export const handleMatchLogic = async (
  card: CardTypeOnline,
  roomId: string,
  playerId: string,
  OnlineGameSession: RoomType,
) => {
  const roomRef = doc(DB, "rooms", roomId);

  await runTransaction(DB, async (transaction) => {
    const roomDoc = await transaction.get(roomRef);
    const roomData = roomDoc.data() as RoomType;

    if (!roomData) throw new Error("Room not found");

    const { lastMove, gameCards, currentPlayerId, turnOrder } = roomData;

    // Always flip the selected card immediately
    let updatedGameCards = gameCards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true, flippedBy: playerId } : c,
    );

    if (!lastMove) {
      // If no previous move, set the current card as `lastMove`
      transaction.update(roomRef, {
        lastMove: card,
        gameCards: updatedGameCards,
      });
    } else {
      if (lastMove.identifier === card.identifier) {
        // If cards match, keep them flipped and reset `lastMove`
        updatedGameCards = updatedGameCards.map((c) =>
          c.id === card.id || c.id === lastMove.id
            ? { ...c, isFlipped: true }
            : c,
        );
        transaction.update(roomRef, {
          lastMove: null,
          gameCards: updatedGameCards,
        });
      } else {
        // If cards don't match, flip them back after a delay
        const nextPlayerId =
          turnOrder[
            (turnOrder.indexOf(currentPlayerId) + 1) % turnOrder.length
          ];

        setTimeout(() => {
          runTransaction(DB, async (delayedTransaction) => {
            const delayedRoomDoc = await delayedTransaction.get(roomRef);
            const delayedRoomData = delayedRoomDoc.data() as RoomType;
            if (!delayedRoomData) throw new Error("Room not found");
            const delayedGameCards = delayedRoomData.gameCards.map((c) =>
              c.id === card.id || c.id === lastMove.id
                ? { ...c, isFlipped: false } // Flip both cards back
                : c,
            );
            delayedTransaction.update(roomRef, {
              lastMove: null,
              gameCards: delayedGameCards,
              currentPlayerId: nextPlayerId,
            });
          });
        }, 2000);
      }
    }
  });
};
