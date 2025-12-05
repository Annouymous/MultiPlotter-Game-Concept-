import React from "react";
import { LastGameS } from "../functions/Room-Functions";

function LastGame() {
  const [lastGameId, setLastGameId] = React.useState<string>("");

  React.useEffect(() => {
    LastGameS()
      .then((data) => {
        setLastGameId(data.session.roomId);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    lastGameId && (
      <section className="space-y-2 rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-3xl">
        <strong className="text-center text-lg font-bold uppercase text-gray-300">
          Last Game ID: {lastGameId}
        </strong>
        <p className="text-center text-sm uppercase text-gray-500">
          join Where you leave the room and the game will continue.
        </p>
      </section>
    )
  );
}

export default LastGame;
