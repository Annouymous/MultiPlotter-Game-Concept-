import { useRef, useEffect, MutableRefObject, useState } from "react";

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
    | "woosh"
    | "match-success"
    | "match-fail"
    | "turn-change"
    | "winner-celebration"
    | "background-music";

  // State for mute and volume control
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.7);

  // Define the references for each sound
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
    "match-success": useRef<HTMLAudioElement | null>(null),
    "match-fail": useRef<HTMLAudioElement | null>(null),
    "turn-change": useRef<HTMLAudioElement | null>(null),
    "winner-celebration": useRef<HTMLAudioElement | null>(null),
    "background-music": useRef<HTMLAudioElement | null>(null),
  };

  // Map for the sound sources
  const soundMap: Record<Place, string> = {
    CardFlip: "/audios/CardFlip.mp3",
    "CardFlip-2": "/audios/CardFlip-2.mp3",
    "CardFlip-3": "/audios/CardFlip-3.mp3",
    Click: "/audios/Click.mp3",
    "Click-2": "/audios/sfx_3.mp3",
    Notification: "/audios/Notification.mp3",
    "Sheet-open": "/audios/Sheet-open.mp3",
    "Sheet-close": "/audios/Sheet-Close.mp3",
    "Sheet-open-modern": "/audios/Sheet-Open-Modern.mp3",
    SWOOSH: "/audios/SWOOSH.mp3",
    woosh: "/audios/woosh.mp3",
    "match-success": "/audios/Notification.mp3", // Placeholder
    "match-fail": "/audios/woosh.mp3", // Placeholder
    "turn-change": "/audios/SWOOSH.mp3", // Placeholder
    "winner-celebration": "/audios/Notification.mp3", // Placeholder
    "background-music": "/audios/Sheet-Open-Modern.mp3", // Placeholder - looping ambient sound
  };

  // Load sound if not already loaded
  const loadSound = (place: Place, isMusic: boolean = false): HTMLAudioElement => {
    if (!soundRefs[place].current) {
      const audio = new Audio(soundMap[place]);
      audio.volume = isMusic ? musicVolume : sfxVolume;
      if (isMusic) {
        audio.loop = true;
      }
      soundRefs[place].current = audio;
    }
    return soundRefs[place].current as HTMLAudioElement;
  };

  const playSound = (place: Place) => {
    if (isMuted) return;
    
    const isMusic = place === "background-music";
    
    if (soundRefs[place].current) {
      soundRefs[place].current.currentTime = 0;
      soundRefs[place].current.volume = isMusic ? musicVolume : sfxVolume;
      soundRefs[place].current.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    } else {
      const audio = loadSound(place, isMusic);
      audio.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
  };

  const stopSound = (place: Place) => {
    if (soundRefs[place].current) {
      soundRefs[place].current.pause();
      soundRefs[place].current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      // Muting - stop background music
      stopSound("background-music");
    }
  };

  const updateMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    if (soundRefs["background-music"].current) {
      soundRefs["background-music"].current.volume = volume;
    }
  };

  const updateSfxVolume = (volume: number) => {
    setSfxVolume(volume);
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

  return {
    playSound,
    stopSound,
    unloadSounds,
    isMuted,
    toggleMute,
    musicVolume,
    sfxVolume,
    setMusicVolume: updateMusicVolume,
    setSfxVolume: updateSfxVolume,
  };
};