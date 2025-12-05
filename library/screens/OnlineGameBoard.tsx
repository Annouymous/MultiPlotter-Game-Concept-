"use client";
import { Card, RoomType, GAME_STATES } from "@/constants/GameRoom";
import { useGame } from "@/context/GameContext";
import { DB } from "@/Firebase/config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { VerifyRoomApi } from "../functions/Room-Functions";
import BackgroundWrapper from "../components/BackgroundWrapper";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import ContentWrapper from "../components/ContentWrapper";
import OnlineBoard from "../components/OnlineBoard";
import WinnerModal from "../components/WinnerModal";
import SoundControl from "../components/SoundControl";
import { Button } from "@/components/ui/button";
import LoadingSystem from "../components/Loading";
import GameLoading from "../components/GameLoading";
import { useSoundManager } from "@/hooks/useSoundManger";
import { checkTurnTimeout } from "../functions/OnlineGameManagement";

function OnlineGameBoard({ room, type }: { room: string; type: string }) {
  const [userIdentification, setUserIdentification] = useState<string>("");
  const [roomId, setRoomId] = useState(room);
  const { OnlineGameSession, setOnlineGameSession } = useGame();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [GameInitialization, setGameInitialization] = useState(true);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState<number>(30);
  const { playSound, stopSound } = useSoundManager();
  const [backgroundMusicStarted, setBackgroundMusicStarted] = useState(false);

  // Start background music when game starts
  useEffect(() => {
    if (
      OnlineGameSession?.gameState === GAME_STATES.PLAYING &&
      !backgroundMusicStarted
    ) {
      playSound("background-music");
      setBackgroundMusicStarted(true);
    }

    // Stop music when game ends
    if (OnlineGameSession?.gameState === GAME_STATES.FINISHED) {
      stopSound("background-music");
      playSound("winner-celebration");
    }

    return () => {
      if (OnlineGameSession?.gameState === GAME_STATES.FINISHED) {
        stopSound("background-music");
      }
    };
  }, [OnlineGameSession?.gameState, backgroundMusicStarted]);

  // Show winner modal when game finishes
  useEffect(() => {
    if (
      OnlineGameSession?.gameState === GAME_STATES.FINISHED &&
      OnlineGameSession?.winner
    ) {
      setShowWinnerModal(true);
    }
  }, [OnlineGameSession?.gameState, OnlineGameSession?.winner]);

  // Turn timer countdown
  useEffect(() => {
    if (!OnlineGameSession?.turnStartedAt) return;

    const interval = setInterval(() => {
      const turnStartTime = OnlineGameSession.turnStartedAt?.toMillis() || 0;
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - turnStartTime) / 1000;
      const timeLimit = OnlineGameSession.turnTimeLimit || 30;
      const remaining = Math.max(0, timeLimit - elapsedSeconds);

      setTurnTimeRemaining(Math.ceil(remaining));

      // Check for timeout
      if (remaining <= 0) {
        checkTurnTimeout(roomId, OnlineGameSession);
      }

      // Warning sound at 5 seconds
      if (remaining === 5 && OnlineGameSession.currentPlayerId.toString() === userIdentification) {
        playSound("Notification");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [OnlineGameSession?.turnStartedAt, OnlineGameSession?.currentPlayerId, roomId, userIdentification]);

  // Listen for game state changes
  useEffect(() => {
    if (userIdentification) {
      const roomRef = doc(DB, "rooms", roomId);
      const unsubscribe = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
          const roomData = doc.data() as RoomType;
          const prevState = OnlineGameSession?.gameState;
          const newState = roomData.gameState;

          // Play turn change sound when turn switches
          if (
            OnlineGameSession &&
            OnlineGameSession.currentPlayerId !== roomData.currentPlayerId
          ) {
            playSound("turn-change");
          }

          // Play match sounds
          if (roomData.lastMove === null && OnlineGameSession?.lastMove !== null) {
            const prevLastMove = OnlineGameSession.lastMove;
            const matchedCards = roomData.gameCards.filter(
              (c) => c.isMatched && c.matchedAt && c.matchedAt > Date.now() - 2000
            );

            if (matchedCards.length > 0) {
              playSound("match-success");
            } else if (prevLastMove) {
              playSound("match-fail");
            }
          }

          setOnlineGameSession(roomData as RoomType);
        }
      });
      return () => unsubscribe();
    }
  }, [userIdentification, roomId]);

  const VerifyRoom = async () => {
    try {
      const res = await VerifyRoomApi(roomId, type);
      const result = await res.json();
      if (!res.ok) {
        throw new Error("internal error");
      }
      if (res.status === 500) {
        if (result.message === "Room data unavailable") {
          setGameInitialization(false);
          setResponseMessage(result.message);
        }
        if (result.message === "your are not authorized to join this room ") {
          setGameInitialization(false);
          setResponseMessage(result.message);
        }
      }
      if (res.status === 200) {
        setUserIdentification(result.identifier);
        setRoomId(result.roomId);

        if (result.identifier.length > 0) {
          const result = doc(DB, "rooms", room as string);
          const func = async () => {
            const docSnap = await getDoc(result);
            if (docSnap.exists()) {
              console.log(docSnap.data());
              setOnlineGameSession(docSnap.data() as RoomType);
              setGameInitialization(false);
            } else {
              console.log("No such document!");
            }
          };
          func();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify room");
      setResponseMessage("Failed to verify room");
      setGameInitialization(false);
    }
  };

  useEffect(() => {
    VerifyRoom();
  }, []);

  const handlePlayAgain = () => {
    // Implement play again logic - would need to reset the room state
    toast.success("Play Again feature - to be implemented by host");
  };

  return (
    <BackgroundWrapper background="Colorful">
      <Toaster />
      <SoundControl />
      
      {/* Turn Timer Display */}
      {OnlineGameSession?.gameState === GAME_STATES.PLAYING && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform">
          <div
            className={`rounded-full border-2 px-6 py-2 font-bold shadow-lg backdrop-blur-sm ${
              turnTimeRemaining <= 5
                ? "animate-pulse border-red-500 bg-red-500/20 text-red-500 shadow-red-500/50"
                : "border-white/30 bg-white/10 text-white shadow-white/20"
            }`}
          >
            ⏱️ {turnTimeRemaining}s
          </div>
        </div>
      )}

      <div className="z-30 mx-auto max-w-7xl space-y-3">
        {OnlineGameSession?.gameCards && (
          <div className="z-40 flex w-full flex-row items-center justify-between">
            <Header
              roomId={roomId}
              players={OnlineGameSession?.players}
              currentPlayerId={OnlineGameSession?.currentPlayerId}
              userPlayerId={userIdentification}
            />
          </div>
        )}
        <ContentWrapper>
          {GameInitialization && (
            <div className="text-center text-lg font-semibold italic text-gray-400">
              Game initializing...
            </div>
          )}
          {responseMessage && (
            <div className="text-center text-lg text-red-500">
              {responseMessage}
            </div>
          )}
          {OnlineGameSession?.gameCards && (
            <OnlineBoard
              cards={OnlineGameSession?.gameCards}
              userIdentification={userIdentification}
              roomId={roomId}
            />
          )}
        </ContentWrapper>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && OnlineGameSession?.winner && (
        <WinnerModal
          winner={OnlineGameSession.winner}
          players={OnlineGameSession.players}
          roomId={roomId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </BackgroundWrapper>
  );
}

export default OnlineGameBoard;