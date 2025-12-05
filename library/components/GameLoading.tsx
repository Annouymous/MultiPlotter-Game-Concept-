import React from "react";
import Lottie from "lottie-react";
import Loading from "@/public/lottie/Loading.json";

function GameLoading() {
  return (
    <div className="absolute h-screen flex w-full items-center justify-center bg-gradient-to-b from-gray-950/35 to-gray-950 backdrop-blur-md">
      <Lottie className="size-96" animationData={Loading} />
    </div>
  );
}

export default GameLoading;
