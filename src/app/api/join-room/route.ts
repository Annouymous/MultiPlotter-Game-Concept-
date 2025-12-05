import { NextResponse, NextRequest } from "next/server";
import { v4 as uuid4 } from "uuid"; // Adjust if using a different database
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { Host } from "@/library/data/GenerateHost";
import { DB } from "@/Firebase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, type } = body;
    const cookies = req.cookies;
    const identifier = cookies.get(`identifier-${roomId}`)?.value;
    // * const roomDoc = await AdminDB.collection("rooms").doc(roomId).get(); //Not Working Right now ...
    const roomRef = doc(collection(DB, "rooms"), roomId);
    const roomDoc = await getDoc(roomRef);
    if (!roomDoc.exists) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }
    const roomData = roomDoc.data();
    if (!roomData) {
      return NextResponse.json(
        { message: "Room data unavailable" },
        { status: 500 }
      );
    }
    if (roomData.isGameFinished) {
      return NextResponse.json({ message: "Game has ended" }, { status: 400 });
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
    const newIdentifier = identifier || `${uuid4()}-${type.split("-").pop()}`;
    const newPlayer = { ...Host, VerificationId: newIdentifier };
    const updatedPlayers = [...players, newPlayer];
    // ! await AdminDB.collection("rooms").doc(roomId).update({ players: updatedPlayers }); //Not Working Right now ...
    await updateDoc(roomRef, { players: updatedPlayers }); // Working with Firestore
    const response = NextResponse.json(
      { message: "ok", roomId: roomId, identifier: newPlayer.VerificationId },
      { status: 200 }
    );
    response.cookies.set(`identifier-${roomId}`, newPlayer.VerificationId, {
      maxAge: 24 * 60 * 60, // 1 day
    });
    return response;
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
