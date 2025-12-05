import { useRef, useEffect, MutableRefObject } from "react";

export const useSoundManager = () => {
  // Define the union type for sound keys
  type Place =
    | "CardFlip"
    | "CardFlip-2"
    | "CardFlip-3"
    | "Click"
    | "Click-2"
    | "Notification"
    | "Sheet-open"
    | "Sheet-close"
    | "Sheet-open-modern"
    | "SWOOSH"
    | "woosh";

  // Define the references for each sound, typed with MutableRefObject<HTMLAudioElement | null>
  const soundRefs: Record<Place, MutableRefObject<HTMLAudioElement | null>> = {
    CardFlip: useRef<HTMLAudioElement | null>(null),
    "CardFlip-2": useRef<HTMLAudioElement | null>(null),
    "CardFlip-3": useRef<HTMLAudioElement | null>(null),
    Click: useRef<HTMLAudioElement | null>(null),
    "Click-2": useRef<HTMLAudioElement | null>(null),
    Notification: useRef<HTMLAudioElement | null>(null),
    "Sheet-open": useRef<HTMLAudioElement | null>(null),
    "Sheet-close": useRef<HTMLAudioElement | null>(null),
    "Sheet-open-modern": useRef<HTMLAudioElement | null>(null),
    SWOOSH: useRef<HTMLAudioElement | null>(null),
    woosh: useRef<HTMLAudioElement | null>(null),
  };

  // Map for the sound sources with typing
  const soundMap: Record<Place, string> = {
    CardFlip: "/audios/CardFlip.mp3",
    "CardFlip-2": "/audios/CardFlip-2.mp3",
    "CardFlip-3": "/audios/CardFlip-3.mp3",
    Click: "/audios/Click.mp3",
    "Click-2": "/audios/sfx_3.mp3",
    Notification: "/audios/Notification.mp3",
    "Sheet-open": "/audios/Sheet-open.mp3",
    "Sheet-close": "/audios/Sheet-close.mp3",
    "Sheet-open-modern": "/audios/Sheet-open-modern.mp3",
    SWOOSH: "/audios/SWOOSH.mp3",
    woosh: "/audios/woosh.mp3",
  };

  // Load sound if not already loaded
  const loadSound = (place: Place): HTMLAudioElement => {
    if (!soundRefs[place].current) {
      const audio = new Audio(soundMap[place]);
      audio.volume = 0.5;
      soundRefs[place].current = audio;
    }
    return soundRefs[place].current as HTMLAudioElement;
  };

  const playSound = (place: Place) => {
    if (soundRefs[place].current) {
      soundRefs[place].current.currentTime = 0;
      soundRefs[place].current.play();
    } else {
      const audio = loadSound(place);
      audio.play();
    }
  };

  // Unload sounds
  const unloadSounds = () => {
    for (const place in soundRefs) {
      const audio = soundRefs[place as Place].current;
      if (audio) {
        audio.pause();
        soundRefs[place as Place].current = null;
      }
    }
  };

  // Clean up sounds on component unmount
  useEffect(() => {
    return () => unloadSounds();
  }, []);

  return { playSound, unloadSounds };
};
