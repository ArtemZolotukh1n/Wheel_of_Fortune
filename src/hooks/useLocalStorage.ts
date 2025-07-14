import { useState } from 'react';
import { Participant } from '../types/index';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// todo
export function useAppSettings() {
  const [settings, setSettings] = useLocalStorage('wheelOfFortuneSettings', {
    audioVolume: 30,
    audioTrack: 'baraban_default.mp3' as
      | 'baraban_default.mp3'
      | 'baraban_1995.mp3'
      | 'napas.mp3'
      | 'volchok.mp3',
    spinDirection: 'по часовой' as 'по часовой' | 'против часовой',
    theme: 'dark' as const,
    language: 'ru' as const,
    showAnimations: true,
    autoHideWinner: true,
    winnerDisplayTime: 5000,
  });

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    resetSettings: () =>
      setSettings({
        audioVolume: 30,
        audioTrack: 'baraban_default.mp3' as const,
        spinDirection: 'по часовой' as const,
        theme: 'dark' as const,
        language: 'ru' as const,
        showAnimations: true,
        autoHideWinner: true,
        winnerDisplayTime: 5000,
      }),
  };
}

// Hook for managing participants in localStorage
export function useStoredParticipants() {
  const [storedParticipants, setStoredParticipants] = useLocalStorage(
    'wheelOfFortuneParticipants',
    [
      { id: '1', name: 'Илья М', addedAt: new Date().toISOString() },
      { id: '2', name: 'Илья П', addedAt: new Date().toISOString() },
      { id: '3', name: 'Темочка', addedAt: new Date().toISOString() },
      { id: '4', name: 'Павел', addedAt: new Date().toISOString() },
      { id: '5', name: 'Дмитрий', addedAt: new Date().toISOString() },
      { id: '6', name: 'Константин', addedAt: new Date().toISOString() },
    ],
  );

  // Преобразуем строки в Date объекты при чтении
  const participants = storedParticipants.map((p) => ({
    ...p,
    addedAt: new Date(p.addedAt),
  }));

  // Преобразуем Date в строки при сохранении
  const setParticipants = (
    participants: Participant[] | ((prev: Participant[]) => Participant[]),
  ) => {
    if (typeof participants === 'function') {
      setStoredParticipants(
        (prev: { id: string; name: string; addedAt: string }[]) => {
          const prevWithDates = prev.map((p) => ({
            ...p,
            addedAt: new Date(p.addedAt),
          }));
          const updated = participants(prevWithDates);
          return updated.map((p) => ({
            ...p,
            addedAt: p.addedAt.toISOString(),
          }));
        },
      );
    } else {
      const serialized = participants.map((p) => ({
        ...p,
        addedAt: p.addedAt.toISOString(),
      }));
      setStoredParticipants(serialized);
    }
  };

  return [participants, setParticipants] as const;
}
