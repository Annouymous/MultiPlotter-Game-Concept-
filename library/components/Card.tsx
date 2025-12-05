import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import React from "react";

type Colors =
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "yellow"
  | "sky"
  | "orange";
function Card({
  src,
  color,
  onClick,
}: {
  color: Colors;
  onClick: () => void;
  src: string | StaticImageData;
}) {
  return (
    <div className="flex h-auto w-96 transform justify-center overflow-hidden rounded-2xl object-contain transition-transform duration-500 ease-in-out hover:z-20 hover:-translate-y-20 hover:skew-y-0 hover:scale-100">
      <Image alt="mystery box" src={src} />
      <Button
        onClick={onClick}
        className={`absolute bottom-10 h-auto w-20 animate-bounce
        shadow-${color}-500/50
        bg-${color}-500 
         font-semibold text-gray-200 shadow-lg  hover:skew-y-0`}
      >
        Play Now
      </Button>
    </div>
  );
}

export default Card;

{
  /* <div className="relative z-10 flex h-auto w-60 transform cursor-pointer items-center justify-center overflow-hidden rounded-2xl object-contain transition-transform duration-500 ease-in-out hover:-translate-y-20 hover:scale-100">
  <Image alt="mystery box" src={Mode_2} />
  <Button className="absolute bottom-10 h-auto w-28 animate-bounce bg-purple-500 font-semibold text-gray-200 shadow-lg shadow-purple-500/50">
    Play Now
  </Button>
</div>; */
}
