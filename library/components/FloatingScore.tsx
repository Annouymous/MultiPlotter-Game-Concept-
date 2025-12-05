"use client";
import React, { useEffect, useState } from "react";

interface FloatingScoreProps {
  value: number;
  color: string;
  onComplete: () => void;
}

function FloatingScore({ value, color, onComplete }: FloatingScoreProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-float-up"
      style={{
        color: color,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    >
      <span className="text-4xl font-bold">+{value}</span>
    </div>
  );
}

export default FloatingScore;