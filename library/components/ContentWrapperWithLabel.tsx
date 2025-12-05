import React from "react";

function ContentWrapperWithLabel({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex-wrap flex flex-col w-full justify-center items-center space-y-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-3xl">
      <div className="flex flex-col px-20 items-center justify-center rounded-b-[30px] border border-white/20 bg-white/10 backdrop-blur-3xl">
        <strong className="text-lg font-bold uppercase text-gray-300">
          Multiplayer Memory Game
        </strong>
      </div>
      <div className="flex w-full flex-wrap gap-4 flex-row items-center justify-center space-x-4">
        {children}
      </div>
    </section>
  );
}

export default ContentWrapperWithLabel;
