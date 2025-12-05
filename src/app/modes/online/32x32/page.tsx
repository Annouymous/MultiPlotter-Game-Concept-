"use client";
import React, { useEffect } from "react";
import OnlineGameType from "@/library/screens/OnlineGameType";

function page() {
  const type = "online-MultiPlayer-32x32";
  return <OnlineGameType type={type} />;
}

export default page;
