"use client";
import OnlineGameBoard from "@/library/screens/OnlineGameBoard";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { room } = useParams();
  const type = "online-MultiPlayer-16x16";

  return <OnlineGameBoard room={room as string} type={type} />;
}