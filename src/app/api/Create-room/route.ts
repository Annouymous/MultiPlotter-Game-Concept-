import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
import { collection, doc, setDoc } from "firebase/firestore";

import { RoomObj } from "@/library/data/GenerateRoom";
import { GenerateAssets } from "@/library/data/GenerateAssets";
import { DB } from "@/Firebase/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body;
    if (
      !["online-MultiPlayer-16x16", "online-MultiPlayer-32x32"].includes(type)
    ) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }
    const gameCards = GenerateAssets(type);
    let createGameTypeIdentifier = type.split("-")[type.split("-").length - 1];
    let identifier = uuid4() + "_" + createGameTypeIdentifier;
    const roomId = Math.floor(1000000 + Math.random() * 9000000).toString();
    let Room = {
      ...RoomObj,
      currentPlayerId: identifier,
      gameCards,
      gameMode: type,
      roomId,
      Host: { ...RoomObj.Host, VerificationId: identifier },
    };
    Room.players[0].VerificationId = identifier;
    // * await AdminDB.collection("rooms").doc(roomId).set(roomOBj); //Not Working Right now ...
    const roomRef = doc(collection(DB, "rooms"), roomId);
    await setDoc(roomRef, Room);
    const response = NextResponse.json(
      {
        message: "ok",
        room: Room,
        redirectId: roomId,
        token: identifier,
      },
      { status: 200 }
    );
    response.cookies.set(`identifier-${roomId}`, identifier, {
      maxAge: 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { message: "Error creating room!" },
      { status: 500 }
    );
  }
}
