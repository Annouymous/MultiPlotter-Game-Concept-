"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { useSoundManager } from "@/hooks/useSoundManger";

function JoinButton({
  label,
  src,
  HandleJoinRoom,
  onchange,
}: {
  label: string;
  src: string | StaticImageData;
  HandleJoinRoom: () => void;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { playSound } = useSoundManager();
  return (
    <div className="flex h-auto w-52 transform justify-center overflow-hidden rounded-2xl object-contain transition-transform duration-500 ease-in-out hover:scale-100">
      <Image alt="mystery box" src={src} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={() => playSound("Click-2")}
            className="absolute bottom-10 h-auto w-28 animate-bounce bg-sky-500 font-semibold text-gray-200 shadow-lg shadow-sky-500/50 transition-all duration-1000 ease-in-out hover:skew-y-0 hover:scale-90 hover:animate-none hover:bg-sky-800"
          >
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className="border border-white/25 bg-white/10 text-white backdrop-blur-lg sm:max-w-[425px]">
          <DialogHeader className="font-bold">
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <Input onChange={onchange} type="text" placeholder="Enter room ID" />
          <DialogFooter>
            <Button
              onClick={HandleJoinRoom}
              variant={"secondary"}
              type="submit"
            >
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JoinButton;
