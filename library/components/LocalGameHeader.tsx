import React from "react";
import ContentWrapper from "./ContentWrapper";
import { useGame } from "@/context/GameContext";

function LocalGameHeader() {
  const { ChancesLeft, TimeLeft } = useGame();
  return (
    <div>
      <ContentWrapper>
        <div className="w-96 text-center text-white">
          <h1 className={`text-4xl uppercase`}>multiploter</h1>
          <h3 className={`text-lg uppercase`}>mystery box</h3>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-center text-sky-500">
            Time Left: <strong>{TimeLeft}</strong> seconds
          </p>
          <p className="text-center text-sky-500">
            Chances Left: {ChancesLeft}
          </p>
        </div>
      </ContentWrapper>
    </div>
  );
}

export default LocalGameHeader;
