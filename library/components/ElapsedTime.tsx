"use client";
import React, { useState, useEffect } from "react";

const ElapsedTime = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Increment elapsed time every second
    const timerInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(timeInterval);
      clearInterval(timerInterval);
    };
  }, []);
  //elisaped time
  return (
    <main className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-white/20 bg-white/10 p-3 text-white backdrop-blur-3xl">
      <div className="text-3xl">
        <strong>{elapsedTime}</strong>
      </div>
      <div className="text-xs text-gray-300">Clock: {currentTime}</div>
    </main>
  );
};

export default ElapsedTime;
