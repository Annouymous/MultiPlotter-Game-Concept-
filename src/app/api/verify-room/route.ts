import { NextResponse, NextRequest } from "next/server";
import { collection, doc, getDoc } from "firebase/firestore";
import { DB } from "@/Firebase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, type } = body;
    const cookies = req.cookies;
    const identifier = cookies.get(`identifier-${roomId}`)?.value;
    //* const roomDoc = await AdminDB.collection("rooms").doc(roomId).get(); //Not Working Right now ...
    const roomRef = doc(collection(DB, "rooms"), roomId);
    const roomDoc = await getDoc(roomRef);
    const roomData = roomDoc.data();
    if (!roomData) {
      return NextResponse.json(
        { message: "Room data unavailable" },
        { status: 500 }
      );
    }
    const players = roomData.players || [];
    if (players.length >= (roomData.maxPlayers || Infinity)) {
      const player = players.find(
        (player: any) => player.VerificationId === identifier
      );
      if (player) {
        return NextResponse.json(
          { message: "ok", roomId: roomId, identifier: player.VerificationId },
          { status: 200 }
        );
      }
      return NextResponse.json({ message: "Room full" }, { status: 400 });
    }
    if (identifier) {
      const player = players.find(
        (player: any) => player.VerificationId === identifier
      );
      if (player) {
        return NextResponse.json(
          { message: "ok", roomId: roomId, identifier: player.VerificationId },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { message: "your are not authorized to join this room " },
      { status: 500 }
    );
  }
}
