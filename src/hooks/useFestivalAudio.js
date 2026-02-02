import { useCallback, useRef, useState } from "react";

const createAudioContext = () => {
  const Context = window.AudioContext || window.webkitAudioContext;
  return Context ? new Context() : null;
};

export const useFestivalAudio = () => {
  const contextRef = useRef(null);
  const masterRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  const ensureContext = useCallback(() => {
    if (!contextRef.current) {
      const ctx = createAudioContext();
      if (!ctx) return null;
      const master = ctx.createGain();
      master.gain.value = 0.25;
      master.connect(ctx.destination);
      contextRef.current = ctx;
      masterRef.current = master;
    }
    if (contextRef.current.state === "suspended") {
      contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  const setMaster = useCallback((value) => {
    if (masterRef.current) {
      masterRef.current.gain.value = value;
    }
  }, []);

  const playTick = useCallback(
    (frequency = 880, duration = 0.04, gain = 0.4) => {
      const ctx = ensureContext();
      if (!ctx || !masterRef.current) return;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = frequency;
      env.gain.value = gain;
      osc.connect(env);
      env.connect(masterRef.current);
      const now = ctx.currentTime;
      env.gain.setValueAtTime(gain, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    },
    [ensureContext]
  );

  const toggleAudio = useCallback(() => {
    if (!enabled) {
      const ctx = ensureContext();
      if (!ctx) return;
      setEnabled(true);
      return;
    }
    setEnabled(false);
  }, [enabled, ensureContext]);

  return {
    enabled,
    toggleAudio,
    playTick,
    setMaster
  };
};
