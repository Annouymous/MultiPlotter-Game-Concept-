import {
  CUSTOM_MODE_ASSETS,
  EASY_MODE_ASSETS,
  ONLINE_MODE_ASSETS,
} from "@/constants/assets";
import { OnlineElement, Storage_key } from "@/constants/OnlineElement";
import { OptionType } from "@/constants/OptionType";
import { v4 as uuid4 } from "uuid";

export const GenerateAssets = (mode: OptionType) => {
  let type = 0;
  let length = 8;

  switch (mode) {
    case "easy":
      type = 0;
      length = 8;
      break;
    case "medium":
      type = 1;
      length = 16;
      break;
    case "hard":
      type = 1;
      length = 30;
      break;
    case "online-MultiPlayer-16x16":
      type = 301;
      length = 16;
      break;
    case "online-MultiPlayer-32x32":
      type = 302;
      length = 28;
      break;
    default:
      throw new Error("Invalid mode selected");
  }

  const items = Array.from({ length }, (_, index) => {
    let img;
    if (mode === "easy") {
      img = EASY_MODE_ASSETS[index];
    }
    if (mode === "medium" || mode === "hard") {
      img = CUSTOM_MODE_ASSETS[index];
    }
    if (
      mode === "online-MultiPlayer-16x16" ||
      mode === "online-MultiPlayer-32x32"
    ) {
      img =
        Storage_key + [index + 1] + OnlineElement + ONLINE_MODE_ASSETS[index];
    }
    return {
      picture: img,
      isFlipped: false,
      identifier: uuid4(),
    };
  });

  const duplicatedItems = [...items, ...items];
  const itemsWithId = duplicatedItems.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
  return itemsWithId.sort(() => Math.random() - 0.5);
};
