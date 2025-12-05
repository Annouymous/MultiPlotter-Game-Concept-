"use client";
import { useGame } from "@/context/GameContext";
import BackgroundWrapper from "@/library/components/BackgroundWrapper";
import Board from "@/library/components/Board";
import ContentWrapper from "@/library/components/ContentWrapper";

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function page() {
  const { initializeGame, ChancesLeft, cards, handleReveal } = useGame();
  useEffect(() => {
    initializeGame("hard");
  }, []);

  React.useEffect(() => {
    if (ChancesLeft < 0) {
      toast.error(
        "There are no chances left. You must win the game it's easy mode"
      );
      initializeGame("easy");
    }
  }, [ChancesLeft]);

  return (
    <BackgroundWrapper background="dark">
      <Toaster />
      <ContentWrapper>
        <Board cards={cards} handleReveal={handleReveal} />
      </ContentWrapper>
    </BackgroundWrapper>
  );
}

export default page;
