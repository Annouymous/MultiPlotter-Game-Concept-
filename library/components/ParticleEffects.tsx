"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface ParticleEffectsProps {
  trigger: boolean;
  color?: string;
  count?: number;
}

function ParticleEffects({ trigger, color = "#10b981", count = 20 }: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: 0,
          y: 0,
          color: color,
          size: Math.random() * 8 + 4,
          velocity: {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200 - 50,
          },
        });
      }
      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => setParticles([]), 1000);
    }
  }, [trigger, color, count]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: particle.velocity.x,
            y: particle.velocity.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}

export default ParticleEffects;