import { useCallback, useEffect, useRef, useState } from "react";

const emptyPartial = { cents: 0, level: 0 };
const emptyAnalysis = {
  fundamental: emptyPartial,
  octave: emptyPartial,
  third: emptyPartial,
  score: 0
};

const centsFromRatio = (ratio) => 1200 * Math.log2(ratio);

const findPeak = (data, targetFreq, sampleRate) => {
  const binCount = data.length;
  const binSize = (sampleRate / 2) / binCount;
  const targetBin = Math.max(1, Math.round(targetFreq / binSize));
  const search = 6;
  let max = -Infinity;
  let maxBin = targetBin;

  for (let i = targetBin - search; i <= targetBin + search; i += 1) {
    const index = Math.min(Math.max(i, 1), binCount - 1);
    const value = data[index];
    if (value > max) {
      max = value;
      maxBin = index;
    }
  }

  const peakFreq = maxBin * binSize;
  const cents = centsFromRatio(peakFreq / targetFreq);
  const level = Math.min(1, Math.max(0, (max + 90) / 60));
  return { cents, level };
};

export const useAudioAnalyzer = () => {
  const audioRef = useRef(null);
  const [analysis, setAnalysis] = useState(emptyAnalysis);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;

    const data = new Float32Array(analyser.frequencyBinCount);
    audioRef.current = {
      context,
      analyser,
      data,
      raf: null,
      lastPlay: 0,
      note: null
    };

    return audioRef.current;
  }, []);

  const playNote = useCallback(
    (note) => {
      const audio = ensureAudio();
      const { context, analyser } = audio;
      if (context.state === "suspended") {
        context.resume();
      }

      audio.note = note;
      audio.lastPlay = performance.now();

      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.55, now + 0.03);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      const partials = [
        { ratio: 1, detune: note.detune },
        { ratio: 2, detune: note.octaveDetune },
        { ratio: 3, detune: note.thirdDetune }
      ];

      partials.forEach((partial) => {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
          note.freq * partial.ratio * Math.pow(2, partial.detune / 1200),
          now
        );
        oscillator.connect(master);
        oscillator.start(now);
        oscillator.stop(now + 1.5);
      });

      master.connect(analyser);
      master.connect(context.destination);

      if (!audio.raf) {
        const update = () => {
          if (!audio.note) return;
          analyser.getFloatFrequencyData(audio.data);

          const fundamental = findPeak(
            audio.data,
            audio.note.freq,
            context.sampleRate
          );
          const octave = findPeak(
            audio.data,
            audio.note.freq * 2,
            context.sampleRate
          );
          const third = findPeak(
            audio.data,
            audio.note.freq * 3,
            context.sampleRate
          );

          const detuneAvg =
            (Math.abs(fundamental.cents) +
              Math.abs(octave.cents) +
              Math.abs(third.cents)) /
            3;
          const score = Math.max(0, Math.round(100 - detuneAvg * 1.6));

          setAnalysis({ fundamental, octave, third, score });

          if (performance.now() - audio.lastPlay > 1600) {
            cancelAnimationFrame(audio.raf);
            audio.raf = null;
            return;
          }
          audio.raf = requestAnimationFrame(update);
        };

        audio.raf = requestAnimationFrame(update);
      }
    },
    [ensureAudio]
  );

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio?.raf) {
        cancelAnimationFrame(audio.raf);
      }
      if (audio?.context) {
        audio.context.close();
      }
    };
  }, []);

  return { analysis, playNote };
};
