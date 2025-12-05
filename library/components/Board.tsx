"use client";
import { Card } from "@/constants/GameRoom";
import Image from "next/image";
import React from "react";
import mystery_box from "@/public/assets/mystery-box.png";

function Board({
  cards,
  handleReveal,
}: {
  cards: Card[];
  handleReveal: (card: Card) => void;
}) {
  return (
    <section
      style={{ perspective: "800px" }}
      className={`grid gap-4
      ${cards.length >= 26 && cards.length >= 34 && "grid-cols-12"}
      ${cards.length >= 14 && cards.length >= 20 && "grid-cols-8"}
      ${cards.length >= 6 && cards.length >= 10 && "grid-cols-4"}
      `}
      // className="flex flex-wrap items-center justify-center gap-4"
    >
      {cards.map((card, index) => (
        <div
          onClick={() => handleReveal(card)}
          style={{
            transformStyle: "preserve-3d",
            transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          key={index}
          className="relative size-24 transition-all duration-1000 ease-in-out"
        >
          <Image
            className="pointer-events-none absolute h-full w-full -scale-x-100 rounded-lg"
            src={card.picture as string}
            alt={card.identifier as string}
          />
          <Image
            style={{ backfaceVisibility: "hidden" }}
            className="pointer-events-none absolute h-full w-full rounded-lg bg-black"
            src={mystery_box}
            alt={card.identifier as string}
          />
        </div>
      ))}
    </section>
  );
}

export default Board;
