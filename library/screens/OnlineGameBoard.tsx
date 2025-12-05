"use client";
import { Card, RoomType } from "@/constants/GameRoom";
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
import { Button } from "@/components/ui/button";
import LoadingSystem from "../components/Loading";
import GameLoading from "../components/GameLoading";
import { useSoundManager } from "@/hooks/useSoundManger";

function OnlineGameBoard({ room, type }: { room: string; type: string }) {
  const [userIdentification, setUserIdentification] = useState<string>("");
  const [roomId, setRoomId] = useState(room);
  const { OnlineGameSession, setOnlineGameSession } = useGame();
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [GameInitialization, setGameInitialization] = useState(true);
  const { playSound } = useSoundManager();
  useEffect(() => {
    if (userIdentification) {
      const roomRef = doc(DB, "rooms", roomId);
      const unsubscribe = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
          playSound("Notification");
          const roomData = doc.data() as RoomType;
          setOnlineGameSession(roomData as RoomType); // Update the local state with the room data
        }
      });
      return () => unsubscribe();
    }
  }, [userIdentification]);

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

  return (
    <BackgroundWrapper background="Colorful">
      <Toaster />
      <div className="" />
      <div className="z-30 mx-auto max-w-7xl space-y-3">
        {OnlineGameSession?.gameCards && (
          <div className="z-40 flex w-full flex-row items-center justify-between">
            <Header
              img={OnlineGameSession?.players[0].avatar}
              name={"You"}
              score={OnlineGameSession?.players[0].score}
              opponentId={
                OnlineGameSession?.players.length > 1
                  ? OnlineGameSession?.players[1].VerificationId
                  : undefined
              }
              opponentName={
                OnlineGameSession?.players.length > 1
                  ? OnlineGameSession?.players[1].name
                  : undefined
              }
              opponentImg={
                OnlineGameSession?.players.length > 1
                  ? OnlineGameSession?.players[1].avatar
                  : undefined
              }
              opponentScore={
                OnlineGameSession?.players.length > 1
                  ? OnlineGameSession?.players[1].score
                  : undefined
              }
              playerId={userIdentification}
              roomId={roomId}
            />
          </div>
        )}
        <ContentWrapper>
          {GameInitialization && (
            <div className="text-center text-lg font-semibold italic text-gray-400">
              Game initializating...
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
    </BackgroundWrapper>
  );
}

export default OnlineGameBoard;
