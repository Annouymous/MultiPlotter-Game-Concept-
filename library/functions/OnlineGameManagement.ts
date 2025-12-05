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

// FIXED: Proper turn logic implementation
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

    // Validate it's the player's turn
    if (currentPlayerId.toString() !== playerId.toString()) {
      toast.error("Not your turn!", { icon: "⏳" });
      return;
    }

    // Validate card is not already flipped or matched
    if (card.isFlipped || card.isMatched) {
      return;
    }

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
      return;
    }

    // Second card flip - check for match
    // Prevent flipping the same card twice
    if (lastMove.id === card.id) {
      return;
    }

    // Check if cards match
    if (lastMove.identifier === card.identifier) {
      // ✅ MATCH FOUND! Player gets +1 point and KEEPS their turn
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
                flippedBy: playerId,
              }
            : c
        ),
        // CRITICAL: Player keeps their turn after match
        currentPlayerId: playerId,
        turnStartedAt: Timestamp.now(),
        lastMoveAt: Timestamp.now(),
      });

      // Check for winner after match
      setTimeout(() => {
        checkForWinner(roomId);
      }, 500);

      toast.success("Match! You get another turn! 🎉", {
        duration: 2000,
        icon: "✨",
      });
    } else {
      // ❌ NO MATCH - Turn passes to next player
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

      // After 2 seconds, flip both cards back and switch turn
      setTimeout(async () => {
        await updateDoc(roomRef, {
          lastMove: null,
          gameCards: gameCards.map((c: Card) =>
            c.id === card.id || c.id === lastMove.id
              ? { ...c, isFlipped: false, flippedBy: null }
              : c
          ),
          // CRITICAL: Turn passes to next player
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
      }, 2000);

      toast.error("No match! Turn passing...", {
        duration: 2000,
        icon: "❌",
      });
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
    const { turnStartedAt, turnTimeLimit = 30, currentPlayerId, turnOrder, players, gameCards, lastMove } = OnlineGameSession;
    
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
        gameCards: gameCards.map((c: Card) => ({
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

// Set player ready status
export const setPlayerReady = async (
  roomId: string,
  playerId: string,
  isReady: boolean
): Promise<void> => {
  try {
    const roomRef = doc(DB, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) return;
    
    const roomData = roomSnap.data() as RoomType;
    const updatedPlayers = roomData.players.map((p) => {
      if (p.VerificationId === playerId) {
        return { ...p, isReady };
      }
      return p;
    });
    
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
    
    toast.success(isReady ? "You are ready!" : "Ready status removed", {
      duration: 1500,
    });
  } catch (error) {
    console.error("Error setting player ready:", error);
    toast.error("Failed to update ready status");
  }
};

// Start game (host only)
export const startGame = async (roomId: string, hostId: string): Promise<void> => {
  try {
    const roomRef = doc(DB, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) return;
    
    const roomData = roomSnap.data() as RoomType;
    
    // Validate host
    if (roomData.Host.VerificationId !== hostId) {
      toast.error("Only the host can start the game!");
      return;
    }
    
    // Check if all players are ready
    const allReady = roomData.players.every((p) => p.isReady || p.VerificationId === hostId);
    
    if (!allReady) {
      toast.error("All players must be ready!");
      return;
    }
    
    // Check minimum players (at least 2)
    if (roomData.players.length < 2) {
      toast.error("Need at least 2 players to start!");
      return;
    }
    
    await updateDoc(roomRef, {
      gameState: GAME_STATES.PLAYING,
      startedAt: Timestamp.now(),
      turnStartedAt: Timestamp.now(),
    });
    
    toast.success("Game starting!", {
      duration: 2000,
      icon: "🎮",
    });
  } catch (error) {
    console.error("Error starting game:", error);
    toast.error("Failed to start game");
  }
};

// Leave room
export const leaveRoom = async (roomId: string, playerId: string): Promise<void> => {
  try {
    const roomRef = doc(DB, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) return;
    
    const roomData = roomSnap.data() as RoomType;
    const updatedPlayers = roomData.players.filter((p) => p.VerificationId !== playerId);
    
    await updateDoc(roomRef, {
      players: updatedPlayers,
    });
    
    toast.success("Left the room", { duration: 1500 });
  } catch (error) {
    console.error("Error leaving room:", error);
    toast.error("Failed to leave room");
  }
};