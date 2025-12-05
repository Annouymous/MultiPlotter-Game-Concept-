import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { Card, RoomType, GAME_STATES } from "@/constants/GameRoom";
import { DB } from "@/Firebase/config";
import toast from "react-hot-toast";

// Check if all cards are matched and determine winner
export const checkForWinner = async (roomId: string): Promise<boolean> => {
  try {
    const roomRef = doc(DB, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) return false;
    
    const roomData = roomSnap.data() as RoomType;
    const allMatched = roomData.gameCards.every((card) => card.isMatched);
    
    if (allMatched) {
      // Find winner (player with highest score)
      const sortedPlayers = [...roomData.players].sort((a, b) => b.score - a.score);
      const winner = sortedPlayers[0];
      
      await updateDoc(roomRef, {
        gameState: GAME_STATES.FINISHED,
        isGameFinished: true,
        endedAt: Timestamp.now(),
        winner: {
          playerId: winner.VerificationId,
          playerName: winner.name,
          score: winner.score,
          finishedAt: Timestamp.now(),
        },
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for winner:", error);
    return false;
  }
};

// Get next player in turn order
const getNextPlayer = (
  currentPlayerId: number,
  turnOrder: number[],
  players: any[]
): number => {
  const currentIndex = turnOrder.indexOf(currentPlayerId);
  const nextIndex = (currentIndex + 1) % turnOrder.length;
  return turnOrder[nextIndex];
};

export const handleMatchLogic = async (
  card: Card,
  roomId: string,
  playerId: string,
  OnlineGameSession: RoomType
) => {
  try {
    const roomRef = doc(DB, "rooms", roomId);
    const { players, lastMove, gameCards, currentPlayerId, turnOrder } =
      OnlineGameSession;

    // Find current player
    const currentPlayer = players.find((p) => p.VerificationId === playerId);
    if (!currentPlayer) return;

    // First card flip
    if (!lastMove) {
      await updateDoc(roomRef, {
        lastMove: card,
        gameCards: gameCards.map((c: Card) =>
          c.id === card.id
            ? {
                ...c,
                isFlipped: true,
                flippedBy: playerId,
                flippedAt: Date.now(),
              }
            : c
        ),
        lastMoveAt: Timestamp.now(),
        lastMovePlayerId: playerId,
      });
    } else {
      // Second card flip - check for match
      if (lastMove.identifier === card.identifier) {
        // MATCH FOUND!
        const updatedPlayers = players.map((p) => {
          if (p.VerificationId === playerId) {
            return { ...p, score: p.score + 1 };
          }
          return p;
        });

        await updateDoc(roomRef, {
          lastMove: null,
          players: updatedPlayers,
          gameCards: gameCards.map((c: Card) =>
            c.id === card.id || c.id === lastMove.id
              ? {
                  ...c,
                  isFlipped: true,
                  isMatched: true,
                  matchedBy: playerId,
                  matchedAt: Date.now(),
                }
              : c
          ),
          currentPlayerId: playerId, // Same player gets another turn
          turnStartedAt: Timestamp.now(),
          lastMoveAt: Timestamp.now(),
        });

        // Check for winner after match
        setTimeout(() => {
          checkForWinner(roomId);
        }, 500);
      } else {
        // NO MATCH - flip cards back after delay
        const nextPlayerId = getNextPlayer(currentPlayerId, turnOrder, players);
        const nextPlayer = players.find(
          (p) => p.VerificationId.toString() === nextPlayerId.toString()
        );

        // Temporarily show both cards flipped
        await updateDoc(roomRef, {
          gameCards: gameCards.map((c: Card) =>
            c.id === card.id
              ? {
                  ...c,
                  isFlipped: true,
                  flippedBy: playerId,
                  flippedAt: Date.now(),
                }
              : c
          ),
        });

        // After 1 second, flip both cards back and switch turn
        setTimeout(async () => {
          await updateDoc(roomRef, {
            lastMove: null,
            gameCards: gameCards.map((c: Card) =>
              c.id === card.id || c.id === lastMove.id
                ? { ...c, isFlipped: false, flippedBy: null }
                : c
            ),
            currentPlayerId: nextPlayerId,
            turnStartedAt: Timestamp.now(),
            lastMoveAt: Timestamp.now(),
          });

          // Show turn change notification
          if (nextPlayer) {
            toast.success(`${nextPlayer.name}'s turn!`, {
              duration: 2000,
              icon: "🎮",
            });
          }
        }, 1000);
      }
    }
  } catch (error) {
    console.error("Error in handleMatchLogic:", error);
    toast.error("An error occurred. Please try again.");
  }
};

// Auto-pass turn if time limit exceeded
export const checkTurnTimeout = async (
  roomId: string,
  OnlineGameSession: RoomType
): Promise<void> => {
  try {
    const { turnStartedAt, turnTimeLimit = 30, currentPlayerId, turnOrder, players } = OnlineGameSession;
    
    if (!turnStartedAt) return;
    
    const turnStartTime = turnStartedAt.toMillis();
    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - turnStartTime) / 1000;
    
    if (elapsedSeconds >= turnTimeLimit) {
      // Time's up! Switch to next player
      const nextPlayerId = getNextPlayer(currentPlayerId, turnOrder, players);
      const nextPlayer = players.find(
        (p) => p.VerificationId.toString() === nextPlayerId.toString()
      );
      
      const roomRef = doc(DB, "rooms", roomId);
      await updateDoc(roomRef, {
        currentPlayerId: nextPlayerId,
        turnStartedAt: Timestamp.now(),
        lastMove: null,
        gameCards: OnlineGameSession.gameCards.map((c: Card) => ({
          ...c,
          isFlipped: c.isMatched ? c.isFlipped : false,
          flippedBy: c.isMatched ? c.flippedBy : null,
        })),
      });
      
      toast.error("Time's up! Turn passed.", { duration: 2000 });
      
      if (nextPlayer) {
        toast.success(`${nextPlayer.name}'s turn!`, {
          duration: 2000,
          icon: "🎮",
        });
      }
    }
  } catch (error) {
    console.error("Error checking turn timeout:", error);
  }
};