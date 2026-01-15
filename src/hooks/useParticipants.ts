import { useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Participant, ParticipantValidationResult } from '../types/index';
import { db } from '../db';
import {
  buildDefaultParticipants,
  DEFAULT_START_BALANCE,
} from '../utils/participants';

export const MAX_PARTICIPANTS = 32;

export const useParticipants = () => {
  const participants =
    useLiveQuery(() => db.participants.orderBy('order').toArray(), []) || [];
  const maxOrder = useMemo(
    () =>
      participants.reduce(
        (currentMax, participant) => Math.max(currentMax, participant.order),
        -1,
      ),
    [participants],
  );

  const validateParticipant = useCallback(
    (name: string): ParticipantValidationResult => {
      const trimmedName = name.trim();
      const specialCharPattern = /[^а-яА-Я-a-zA-Z0-9 ]/;

      if (!trimmedName) {
        return {
          isValid: false,
          error: { field: 'name', message: 'Имя не может быть пустым.' },
        };
      }

      if (trimmedName.length < 2) {
        return {
          isValid: false,
          error: {
            field: 'name',
            message: 'Имя должно содержать минимум 2 символа.',
          },
        };
      }

      if (trimmedName.length > 30) {
        return {
          isValid: false,
          error: {
            field: 'name',
            message: 'Имя не может быть длиннее 30 символов.',
          },
        };
      }

      if (specialCharPattern.test(trimmedName)) {
        return {
          isValid: false,
          error: {
            field: 'name',
            message: 'Имя не может содержать специальные символы.',
          },
        };
      }

      if (
        participants.some(
          (existingParticipant) =>
            existingParticipant.name.toLowerCase() ===
            trimmedName.toLowerCase(),
        )
      ) {
        return {
          isValid: false,
          error: {
            field: 'name',
            message: 'Участник с таким именем уже существует.',
          },
        };
      }

      return { isValid: true };
    },
    [participants],
  );

  const addParticipant = useCallback(
    (name: string): ParticipantValidationResult => {
      if (participants.length >= MAX_PARTICIPANTS) {
        return {
          isValid: false,
          error: {
            field: 'limit',
            message: `Максимальное количество участников: ${MAX_PARTICIPANTS}`,
          },
        };
      }

      const validation = validateParticipant(name);
      if (!validation.isValid) {
        return validation;
      }

      const newParticipant: Participant = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
        name: name.trim(),
        addedAt: new Date(),
        balance: DEFAULT_START_BALANCE,
        order: maxOrder + 1,
      };

      void db.participants.add(newParticipant);

      return { isValid: true };
    },
    [participants.length, validateParticipant, maxOrder],
  );

  const removeParticipant = useCallback((id: string) => {
    void db.transaction('rw', db.participants, db.bets, async () => {
      await db.participants.delete(id);
      await db.bets.where('bettorId').equals(id).delete();
      await db.bets.where('targetId').equals(id).delete();
    });
  }, []);

  const shuffleParticipants = useCallback(() => {
    void db.transaction('rw', db.participants, async () => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      await Promise.all(
        shuffled.map((participant, index) =>
          db.participants.put({ ...participant, order: index }),
        ),
      );
    });
  }, [participants]);

  const sortParticipants = useCallback(() => {
    void db.transaction('rw', db.participants, async () => {
      const sorted = [...participants].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      await Promise.all(
        sorted.map((participant, index) =>
          db.participants.put({ ...participant, order: index }),
        ),
      );
    });
  }, [participants]);

  const resetParticipants = useCallback(() => {
    void db.transaction('rw', db.participants, async () => {
      await db.participants.clear();
      await db.participants.bulkAdd(buildDefaultParticipants());
    });
  }, []);

  return {
    participants,
    addParticipant,
    removeParticipant,
    shuffleParticipants,
    sortParticipants,
    resetParticipants,
    validateParticipant,
    isMaxParticipantsReached: participants.length >= MAX_PARTICIPANTS,
    hasParticipants: participants.length > 0,
  };
};
