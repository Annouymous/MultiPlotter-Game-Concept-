"use client";
import React from "react";
import OnlineGameBoard from "@/library/screens/OnlineGameBoard";
import { useParams } from "next/navigation";

function Page() {
  const params = useParams();
  const roomId = params.room as string;
  const type = "online-MultiPlayer-32x32";

  if (!roomId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Room ID</h1>
          <p className="text-white/70">Please check your link and try again.</p>
        </div>
      </div>
    );
  }

  return <OnlineGameBoard room={roomId} type={type} />;
}

export default Page;