import { cookies } from "next/headers";
import { collection, doc, getDoc } from "firebase/firestore";
import { DB } from "@/Firebase/config";


export async function GET(req: Request) {
  try {
    const k = (await cookies()).getAll();
    const roomId = k[k.length - 1]?.name.split("-")[1];
    const gameType = k[k.length - 1]?.value.split("_")[1];
    if (!roomId || !gameType) {
      return Response.json({ message: "Invalid session" }, { status: 400 });
    } else {
      //* const database = (await AdminDB.collection("rooms").doc(roomId).get()).data(); //Not Working Right now ...
      const databaseRef = doc(collection(DB, "rooms"), roomId);
      const roomDoc = await getDoc(databaseRef);
      const roomData = roomDoc.data();

      if (roomData?.isGameFinished) {
        return Response.json({ message: "Game has ended" }, { status: 400 });
      }
      return Response.json({
        message: "ok",
        session: {
          roomId,
          gameType,
          identifier: k[k.length - 1].value,
        },
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "error" }, { status: 500 });
  }
}
