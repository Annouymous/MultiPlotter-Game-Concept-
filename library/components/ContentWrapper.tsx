import React from "react";

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="z-30 mx-auto max-w-7xl space-y-6">
      <main className="rounded-lg border border-white/20 bg-white/10 p-7 backdrop-blur-3xl">
        {children}
      </main>
    </div>
  );
}

export default ContentWrapper;
