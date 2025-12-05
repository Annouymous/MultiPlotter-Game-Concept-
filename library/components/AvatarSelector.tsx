"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AvatarSelectorProps {
  onSelect: (avatar: string) => void;
  currentAvatar?: string;
}

const AVATARS = [
  { id: "robot", path: "/assets/avatar-robot.png", name: "Robot" },
  { id: "cat", path: "/assets/avatar-cat.png", name: "Cat" },
  { id: "dog", path: "/assets/avatar-dog.png", name: "Dog" },
  { id: "panda", path: "/assets/avatar-panda.png", name: "Panda" },
  { id: "fox", path: "/assets/avatar-fox.png", name: "Fox" },
  { id: "penguin", path: "/assets/avatar-penguin.png", name: "Penguin" },
];

export default function AvatarSelector({ onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || AVATARS[0].path);

  const handleSelect = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    onSelect(avatarPath);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-center text-lg font-bold text-white">Choose Your Avatar</h3>
      <div className="grid grid-cols-3 gap-4">
        {AVATARS.map((avatar) => (
          <motion.div
            key={avatar.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(avatar.path)}
            className={`cursor-pointer rounded-xl border-4 p-2 transition-all ${
              selectedAvatar === avatar.path
                ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/50"
                : "border-white/20 bg-white/5 hover:border-white/40"
            }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={avatar.path}
                alt={avatar.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center text-xs font-semibold text-white">
              {avatar.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}