import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import React from "react";

function CreateButton({
  label,
  src,
  HandleCreateRoom,
}: {
  label: string;
  src: string | StaticImageData;
  HandleCreateRoom: () => void;
}) {
  return (
    <div className="relative z-10 flex h-auto w-52 transform cursor-pointer items-center justify-center overflow-hidden rounded-2xl object-contain transition-transform duration-500 ease-in-out">
      <Image alt="mystery box" src={src} />
      <Button
        onClick={HandleCreateRoom}
        className="absolute bottom-10 h-auto w-28 animate-bounce bg-purple-500 font-semibold text-gray-200 shadow-lg shadow-purple-500/50 transition-all duration-1000 ease-in-out hover:skew-y-0 hover:scale-90 hover:animate-none hover:bg-purple-800"
      >
        {label}
      </Button>
    </div>
  );
}

export default CreateButton;
