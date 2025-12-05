import React from "react";

export type BG = "dark" | "Colorful" | "transparent";

function BackgroundWrapper({
  children,
  background,
}: {
  children: React.ReactNode;
  background: BG;
}) {
  return (
    <div
      className={` relative overflow-hidden bg-fixed bg-no-repeat flex h-screen w-full flex-col items-center justify-center 
        ${
          background === "dark" &&
          "bg-[url('/Backgrounds/52587718473_8cd8c882e7_k.jpg')]"
        }
        ${background === "Colorful" && "bg-[url('/Backgrounds/bg_1.jpg')]"}
         ${background === "transparent" && "bg-[url('/Backgrounds/1876.jpg')]"}
        bg-cover`}
    >
      <div className="absolute inset-0 w-full bg-gradient-to-b from-gray-950/35 to-gray-950" />
      <div className=" z-10 flex min-h-screen max-h-full flex-col items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
}

export default BackgroundWrapper;
