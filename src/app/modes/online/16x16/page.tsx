"use client";
import React, { useEffect } from "react";
import OnlineGameType from "@/library/screens/OnlineGameType";

function page() {
  const type = "online-MultiPlayer-16x16";
  const path = "16x16";
  return <OnlineGameType path={path} type={type} />;
}

export default page;
