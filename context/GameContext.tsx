"use client";
import React, { createContext, useContext, useState } from "react";
import { useSoundManager } from "@/hooks/useSoundManger";
import { Card, RoomType } from "@/constants/GameRoom";
import { OptionType } from "@/constants/OptionType";
import { GenerateAssets } from "@/library/data/GenerateAssets";
import { handleMatchLogic } from "@/library/functions/OnlineGameManagement";

interface GameContextType {
  cards: Card[];
  OnlineGameSession: RoomType;
  setOnlineGameSession: React.Dispatch<React.SetStateAction<RoomType>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  flippedCards: Card[];
  ChancesLeft: number;
  TimeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isProcessing: boolean;
  initializeGame: (type: OptionType) => void;
  handleReveal: (card: Card) => void;
  HandleOnlineCardSystem: (
    card: Card,
    roomId: string,
    playerId: string
  ) => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Provider component to wrap the game logic
export const GameProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  // Game state
  const [cards, setCards] = useState<Card[]>([]); // All cards
  const [flippedCards, setFlippedCards] = useState<Card[]>([]); // Currently flipped cards
  const [ChancesLeft, setChancesLeft] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent rapid actions
  const [TimeLeft, setTimeLeft] = useState(0);
  const [OnlineGameSession, setOnlineGameSession] = useState<RoomType>(
    undefined as unknown as RoomType
  );
  const { playSound } = useSoundManager();

  const initializeGame = (type: OptionType) => {
    const newCards = GenerateAssets(type); // Helper function to create shuffled cards
    setCards(newCards);
    if (type == "easy") {
      setChancesLeft(10);
      setTimeLeft(100);
    } else if (type == "medium") {
      setChancesLeft(20);
      setTimeLeft(180);
    } else if (type == "hard") {
      setChancesLeft(30);
      setTimeLeft(360);
    }
    setFlippedCards([]);
  };

  const HandleOnlineCardSystem = (
    card: Card,
    roomId: string,
    playerId: string
  ) => {
    // Don't play sound here - let OnlineGameBoard handle it based on match result
    playSound("CardFlip-2");
    handleMatchLogic(card, roomId, playerId, OnlineGameSession);
  };

  // Core game logic for revealing cards
  const handleReveal = (card: Card) => {
    if (isProcessing || card.isFlipped) return; // Ignore clicks during processing or on already flipped cards
    playSound("CardFlip-2");
    setFlippedCards((prevFlipped) => {
      const newFlipped = [...prevFlipped, card];
      if (newFlipped.length === 2) {
        setIsProcessing(true); // Lock further clicks
        const [first, second] = newFlipped;
        if (first.identifier === second.identifier) {
          // Match found
          playSound("match-success");
          setTimeout(() => {
            setFlippedCards([]);
            setIsProcessing(false); // Unlock
          }, 1000);
        } else {
          // No match
          playSound("match-fail");
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((item) =>
                item.id === first.id || item.id === second.id
                  ? { ...item, isFlipped: false }
                  : item
              )
            );
            setFlippedCards([]);
            setIsProcessing(false);
            setChancesLeft(ChancesLeft - 1); // Unlock
          }, 1000);
        }
      }
      return newFlipped;
    });

    // Flip the clicked card
    setCards((prevCards) =>
      prevCards.map((item) =>
        item.id === card.id ? { ...item, isFlipped: true } : item
      )
    );
  };

  // Provide state and functions to children
  return (
    <GameContext.Provider
      value={{
        ChancesLeft,
        TimeLeft,
        setTimeLeft,
        HandleOnlineCardSystem,
        setCards,
        OnlineGameSession,
        setOnlineGameSession,
        cards,
        flippedCards,
        isProcessing,
        initializeGame,
        handleReveal,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to access the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};