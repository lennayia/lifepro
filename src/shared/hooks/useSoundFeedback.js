import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * useSoundFeedback - Hook pro jemný zvukový feedback v aplikaci
 *
 * Poskytuje přehrávání subtilních zvuků pro UI interakce.
 * Zvuky jsou generované programově (Web Audio API) - žádné soubory.
 *
 * @param {Object} options
 * @param {number} options.volume - Hlasitost 0-1 (default: 0.3)
 * @param {boolean} options.enabled - Povolit zvuky (default: true)
 *
 * @returns {Object} {
 *   playClick: () => void,
 *   playFlip: () => void,
 *   playSuccess: () => void,
 *   playError: () => void,
 *   playHover: () => void,
 *   playWhoosh: () => void,
 *   setVolume: (volume) => void,
 *   setEnabled: (enabled) => void,
 *   enabled: boolean,
 *   volume: number,
 * }
 *
 * @example
 * const { playClick, playSuccess } = useSoundFeedback({ volume: 0.5 });
 *
 * <Button onClick={() => {
 *   playClick();
 *   handleAction();
 * }}>
 *   Click me
 * </Button>
 *
 * @created 12.11.2025
 */
const useSoundFeedback = ({ volume: initialVolume = 0.3, enabled: initialEnabled = true } = {}) => {
  const audioContextRef = useRef(null);
  const [volume, setVolume] = useState(initialVolume);
  const [enabled, setEnabled] = useState(initialEnabled);

  // Initialize Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generic sound player
  const playSound = useCallback(
    (frequency, duration, type = 'sine', fadeOut = true) => {
      if (!enabled || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gainNode.gain.value = volume;

      if (fadeOut) {
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      }

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [enabled, volume]
  );

  // Play multiple frequencies (chord)
  const playChord = useCallback(
    (frequencies, duration, type = 'sine') => {
      if (!enabled || !audioContextRef.current) return;

      frequencies.forEach((freq) => {
        playSound(freq, duration, type, true);
      });
    },
    [enabled, playSound]
  );

  // Specific sound effects
  const playClick = useCallback(() => {
    playSound(800, 0.05, 'sine');
  }, [playSound]);

  const playFlip = useCallback(() => {
    // Sweep sound for flip
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);

    gainNode.gain.value = volume;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [enabled, volume]);

  const playSuccess = useCallback(() => {
    // Pleasant chord for success
    playChord([523.25, 659.25, 783.99], 0.4, 'sine'); // C major chord
  }, [playChord]);

  const playError = useCallback(() => {
    // Dissonant for error
    playChord([300, 320], 0.2, 'square');
  }, [playChord]);

  const playHover = useCallback(() => {
    // Very subtle hover sound
    playSound(600, 0.03, 'sine');
  }, [playSound]);

  const playWhoosh = useCallback(() => {
    // Whoosh sweep for transitions
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    gainNode.gain.value = volume * 0.5; // Quieter whoosh
    gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [enabled, volume]);

  return {
    playClick,
    playFlip,
    playSuccess,
    playError,
    playHover,
    playWhoosh,
    setVolume,
    setEnabled,
    enabled,
    volume,
  };
};

export default useSoundFeedback;
