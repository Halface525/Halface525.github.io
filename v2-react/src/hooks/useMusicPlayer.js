import { useState, useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { musicPlaylist } from "../data/musicPlaylist";

const MODES = ["list", "single", "random"];

export function useMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("music-volume");
    return saved ? parseFloat(saved) : 0.5;
  });
  const [modeIndex, setModeIndex] = useState(() => {
    const saved = localStorage.getItem("music-mode");
    return saved ? parseInt(saved, 10) : 0;
  });

  const soundRef = useRef(null);
  const progressRef = useRef(null);

  const playMode = MODES[modeIndex];

  const cleanup = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
  }, []);

  const playAt = useCallback(
    (index) => {
      cleanup();
      const track = musicPlaylist[index];
      if (!track) return;

      const sound = new Howl({
        src: [track.src],
        volume: volume,
        html5: true,
        onload: () => {
          setDuration(sound.duration());
        },
        onend: () => {
          if (playMode === "single") {
            sound.play();
          } else if (playMode === "random") {
            const next = Math.floor(Math.random() * musicPlaylist.length);
            playAt(next);
          } else {
            const next = (index + 1) % musicPlaylist.length;
            playAt(next);
          }
        },
        onloaderror: () => {
          console.error("Failed to load audio", track.src);
        },
      });

      soundRef.current = sound;
      sound.play();
      setCurrentIndex(index);
      setIsPlaying(true);

      progressRef.current = setInterval(() => {
        setProgress(sound.seek() || 0);
      }, 250);
    },
    [cleanup, volume, playMode]
  );

  const toggle = useCallback(() => {
    if (!soundRef.current) {
      playAt(currentIndex);
      return;
    }
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [currentIndex, isPlaying, playAt]);

  const prev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? musicPlaylist.length - 1 : currentIndex - 1;
    playAt(newIndex);
  }, [currentIndex, playAt]);

  const next = useCallback(() => {
    const newIndex =
      currentIndex === musicPlaylist.length - 1 ? 0 : currentIndex + 1;
    playAt(newIndex);
  }, [currentIndex, playAt]);

  const toggleMode = useCallback(() => {
    setModeIndex((prev) => {
      const next = (prev + 1) % MODES.length;
      localStorage.setItem("music-mode", next);
      return next;
    });
  }, []);

  const seek = useCallback(
    (percent) => {
      if (!soundRef.current || !duration) return;
      const pos = percent * duration;
      soundRef.current.seek(pos);
      setProgress(pos);
    },
    [duration]
  );

  const changeVolume = useCallback((val) => {
    setVolume(val);
    localStorage.setItem("music-volume", val);
    if (soundRef.current) {
      soundRef.current.volume(val);
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    isOpen,
    setIsOpen,
    playlist: musicPlaylist,
    currentIndex,
    isPlaying,
    progress,
    duration,
    volume,
    playMode,
    toggle,
    prev,
    next,
    playAt,
    toggleMode,
    seek,
    changeVolume,
  };
}
