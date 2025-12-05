import { GetRandomAvatar } from "./RandomAvatar";
import { v4 as uuid4 } from "uuid";
import { generateGameName } from "./RandomName";

export const Host = {
  id: uuid4(),
  name: generateGameName(),
  avatar: GetRandomAvatar(),
  score: 0,
  isConnected: true,
  isJoined: true,
  VerificationId: "",
};
