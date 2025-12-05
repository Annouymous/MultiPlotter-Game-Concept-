import { Create, JOIN, LAST_GAME, VERIFY } from "../data/API";
import { Post_Headers } from "../data/Request";

export async function LastGameS() {
  const res = await fetch(LAST_GAME, { cache: "no-store" });
  return res.json();
}

export async function VerifyRoomApi(roomId: string, type: string) {
  const res = await fetch(VERIFY, {
    ...Post_Headers,
    body: JSON.stringify({
      roomId: roomId,
      type: type,
    }),
  });
  return res;
}
