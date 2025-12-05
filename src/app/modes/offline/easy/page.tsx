"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import mystery_box from "@/public/assets/mystery-box.png";
import { useGame } from "@/context/GameContext";
import BackgroundWrapper from "@/library/components/BackgroundWrapper";
import Board from "@/library/components/Board";
import ContentWrapper from "@/library/components/ContentWrapper";
import LocalGameHeader from "@/library/components/LocalGameHeader";
import toast, { Toaster } from "react-hot-toast";

function page() {
  const {
    initializeGame,
    setTimeLeft,
    TimeLeft,
    ChancesLeft,
    cards,
    handleReveal,
  } = useGame();
  useEffect(() => {
    initializeGame("easy");
  }, []);

  useEffect(() => {
    if (ChancesLeft < 0) {
      toast.error(
        "There are no chances left. You must win the game it's easy mode"
      );
      initializeGame("easy");
    }
  }, [ChancesLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (TimeLeft > 0) {
        setTimeLeft(TimeLeft - 1);
      } else {
        toast.error("Time is up. You must win the game it's easy mode");
        initializeGame("easy");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [TimeLeft]);

  return (
    <BackgroundWrapper background="dark">
      <Toaster />
      <LocalGameHeader />
      <ContentWrapper>
        <Board cards={cards} handleReveal={handleReveal} />
      </ContentWrapper>
    </BackgroundWrapper>
  );
}

export default page;
