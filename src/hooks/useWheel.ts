import { useCallback, useRef, useEffect } from 'react';
import { Participant } from '../types/index';
import { updateSettings } from '../db';
import { useWheelContext } from '../context/WheelContext';
import { useBets } from './useBets';

export const useWheel = () => {
  const { state: wheelState, dispatch: wheelDispatch } = useWheelContext();
  const { participants, gameState, settleRound } = useBets();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const determineWinner = useCallback(
    (finalRotation: number): Participant | null => {
      if (participants.length === 0) return null;

      const sliceAngle = 360 / participants.length;
      // Нормализуем поворот к диапазону 0-360
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;

      // Индикатор находится справа (угол 0°)
      // Колесо вращается против часовой стрелки (отрицательный поворот в canvas)
      // Поэтому нужно найти сектор, который находится под индикатором
      const winningSectorIndex =
        Math.floor(normalizedRotation / sliceAngle) %
        participants.length;

      return participants[winningSectorIndex] || null;
    },
    [participants],
  );

  const startSpin = useCallback(() => {
    if (
      wheelState.wheel.spinning ||
      participants.length === 0 ||
      gameState.isComplete
    )
      return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(`/${wheelState.audio.track}`);
    audioRef.current.volume = wheelState.audio.volume / 100;

    audioRef.current.onerror = () => {
      console.warn(`Не удалось загрузить аудио: ${wheelState.audio.track}`);
    };

    audioRef.current.play().catch((error) => {
      console.warn('Ошибка воспроизведения аудио:', error);
    });

    wheelDispatch({ type: 'SET_SPINNING', payload: true });

    // Устанавливаем количество полных оборотов и вычисляем финальный поворот
    const numFullRotations =
      Math.random() *
        (wheelState.spin.maxRotations - wheelState.spin.minRotations) +
      wheelState.spin.minRotations;
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      wheelState.wheel.rotation +
      (wheelState.spin.direction === 'по часовой'
        ? -totalRotation
        : totalRotation);

    const easing = (t: number) => {
      // Кубическое замедление
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / wheelState.spin.duration, 1);
      const easeT = easing(t);
      const currentRotation =
        wheelState.wheel.rotation +
        (wheelState.spin.direction === 'по часовой'
          ? -totalRotation
          : totalRotation) *
          easeT;

      wheelDispatch({ type: 'SET_ROTATION', payload: currentRotation });

      if (elapsed < wheelState.spin.duration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        wheelDispatch({ type: 'SET_SPINNING', payload: false });
        const winner = determineWinner(finalRotation);
        if (winner) {
          wheelDispatch({ type: 'SET_WINNER', payload: winner });
          wheelDispatch({ type: 'SET_WINNER_POPUP', payload: true });
          void settleRound(winner);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [
    wheelState.wheel.spinning,
    wheelState.wheel.rotation,
    wheelState.audio.track,
    wheelState.audio.volume,
    wheelState.spin.direction,
    wheelState.spin.duration,
    wheelState.spin.minRotations,
    wheelState.spin.maxRotations,
    participants,
    gameState.isComplete,
    wheelDispatch,
    determineWinner,
    settleRound,
  ]);

  const changeSpinDirection = useCallback(() => {
    const newDirection =
      wheelState.spin.direction === 'по часовой'
        ? 'против часовой'
        : 'по часовой';
    wheelDispatch({ type: 'SET_SPIN_DIRECTION', payload: newDirection });

    void updateSettings({ spinDirection: newDirection });
  }, [wheelState.spin.direction, wheelDispatch]);

  const setAudioVolume = useCallback(
    (volume: number) => {
      wheelDispatch({ type: 'SET_AUDIO_VOLUME', payload: volume });

      void updateSettings({ audioVolume: volume });
    },
    [wheelDispatch],
  );

  const setAudioTrack = useCallback(
    (track: typeof wheelState.audio.track) => {
      wheelDispatch({ type: 'SET_AUDIO_TRACK', payload: track });

      void updateSettings({ audioTrack: track });
    },
    [wheelDispatch],
  );

  const hideWinnerPopup = useCallback(() => {
    wheelDispatch({ type: 'SET_WINNER_POPUP', payload: false });
  }, [wheelDispatch]);

  const resetWheel = useCallback(() => {
    wheelDispatch({ type: 'RESET_WHEEL' });
  }, [wheelDispatch]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Cleanup animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Auto-hide winner popup after 5 seconds
  useEffect(() => {
    if (wheelState.wheel.showWinnerPopup) {
      const timer = setTimeout(() => {
        hideWinnerPopup();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [wheelState.wheel.showWinnerPopup, hideWinnerPopup]);

  return {
    // State
    spinning: wheelState.wheel.spinning,
    rotation: wheelState.wheel.rotation,
    winner: wheelState.wheel.winner,
    showWinnerPopup: wheelState.wheel.showWinnerPopup,
    participants,
    audioVolume: wheelState.audio.volume,
    audioTrack: wheelState.audio.track,
    spinDirection: wheelState.spin.direction,
    isGameComplete: gameState.isComplete,

    // Actions
    startSpin,
    changeSpinDirection,
    setAudioVolume,
    setAudioTrack,
    hideWinnerPopup,
    resetWheel,
  };
};
