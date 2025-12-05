"use client";
import { useSoundManager } from "@/hooks/useSoundManger";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import BackgroundWrapper from "../components/BackgroundWrapper";
import CreateButton from "../components/Create-Button";
import JoinButton from "../components/Join-Button";
import ContentWrapperWithLabel from "../components/ContentWrapperWithLabel";
import Mode_1 from "@/public/assets/32X32.jpg";
import Mode_2 from "@/public/assets/8X8.jpg";
import LastGame from "../components/Last-Game";
import GameLoading from "../components/GameLoading";
import { Create, JOIN } from "../data/API";
import { Post_Headers } from "../data/Request";
import toast, { Toaster } from "react-hot-toast";

function OnlineGameType({ type }: { type: string }) {
  const Router = useRouter();
  const { playSound } = useSoundManager();
  const [loading, setLoading] = React.useState(false);
  const [roomId, setRoomId] = React.useState<string>("");

  const HandleJoinRoom = async () => {
    try {
      const res = await fetch(JOIN, {
        ...Post_Headers,
        body: JSON.stringify({
          roomId,
          type,
        }),
      });
      if (!res.ok) {
        throw new Error(`Internal server error`);
      }
      const result = await res.json();
      toast.success(`Redirecting...`);
      Router.push(
        `${type.split("-")[type.split("-").length - 1]}/${result.roomId}`
      );
      setLoading(false);
    } catch (error) {
      toast.error(`Internal server error`);
      setLoading(false);
      console.log(error);
    }
  };

  const HandleCreateRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch(Create, {
        ...Post_Headers,
        body: JSON.stringify({ type: type }),
      });
      if (!res.ok) {
        throw new Error(`Internal server error`);
      }
      const result = await res.json();
      toast.success(`Room created successfully`);
      Router.push(
        `${type.split("-")[type.split("-").length - 1]}/${result.redirectId}`
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`Internal server error`);
      console.log(error);
    }
  };

  return (
    <BackgroundWrapper background="Colorful">
      <ContentWrapperWithLabel>
        <CreateButton
          HandleCreateRoom={HandleCreateRoom}
          label="Create Room"
          src={Mode_2}
        />
        <JoinButton
          HandleJoinRoom={HandleJoinRoom}
          onchange={(e) => setRoomId(e.target.value)}
          label="Join Room"
          src={Mode_1}
        />
      </ContentWrapperWithLabel>
      <LastGame />
      {loading && <GameLoading />}
      <Toaster />
    </BackgroundWrapper>
  );
}

export default OnlineGameType;
