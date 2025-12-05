"use client";
import React, { useState } from "react";
import Mode_1 from "@/public/0.jpg";
import Mode_2 from "@/public/01.jpg";
import Mode_3 from "@/public/02.jpg";
import BackgroundWrapper from "@/library/components/BackgroundWrapper";
import ContentWrapperWithLabel from "@/library/components/ContentWrapperWithLabel";
import Title from "@/library/components/Title";
import Card from "@/library/components/Card";
import Grid from "@/library/components/Grid";
import { useRouter } from "next/navigation";
import { useSoundManager } from "@/hooks/useSoundManger";

export default function Page() {
  const { playSound } = useSoundManager();
  const Router = useRouter();
  return (
    <BackgroundWrapper background="transparent">
      <div className="items-center w-full flex-col h-full flex justify-between">
        <Title />
        <ContentWrapperWithLabel>
          <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/online/32x32");
            }}
            color="sky"
            src={Mode_1}
          />
          <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/online/32x32");
            }}
            color="sky"
            src={Mode_2}
          />
          <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/online/32x32");
            }}
            color="sky"
            src={Mode_3}
          />
          {/* <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/online/16x16");
            }}
            color="purple"
            src={Mode_2}
          /> */}
          {/* <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/offline/easy");
            }}
            color="red"
            src={Mode_3}
          />
          <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/offline/medium");
            }}
            color="sky"
            src={Mode_1}
          />
          <Card
            onClick={() => {
              playSound("Click");
              Router.push("/modes/offline/hard");
            }}
            color="purple"
            src={Mode_2}
          /> */}
        </ContentWrapperWithLabel>
      </div>
      <Grid />
    </BackgroundWrapper>
  );
}

{
  /* <div className="absolute flex h-screen w-full justify-end px-10">
  <Marquee pauseOnHover vertical className="[--duration:50s]">
    {Data.map((item) => (
      <Image
        className="h-auto w-32 rounded-md shadow-emerald-500"
        alt="s"
        src={item.image}
      />
    ))}
  </Marquee>
  <Marquee reverse pauseOnHover vertical className="[--duration:50s]">
    {Data_2.map((item) => (
      <Image
        className="h-auto w-32 rounded-md shadow-emerald-500"
        alt="s"
        src={item.image}
      />
    ))}
  </Marquee>
  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/80 dark:from-background"></div>
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 dark:from-background"></div>
</div>; */
}