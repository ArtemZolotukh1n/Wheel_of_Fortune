import { useCallback } from 'react';
import { Participant, ParticipantValidationResult } from '../types/index';
import { useParticipantsContext } from './useParticipantsContext';

export const MAX_PARTICIPANTS = 32;

export const useParticipants = () => {
  const { state, dispatch } = useParticipantsContext();
  const { participants } = state;

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
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        addedAt: new Date(),
      };

      dispatch({ type: 'ADD_PARTICIPANT', payload: newParticipant });

      // Сохраняем в localStorage
      const updatedParticipants = [...participants, newParticipant];
      const serialized = updatedParticipants.map((p) => ({
        ...p,
        addedAt: p.addedAt.toISOString(),
      }));
      localStorage.setItem(
        'wheelOfFortuneParticipants',
        JSON.stringify(serialized),
      );

      return { isValid: true };
    },
    [participants, validateParticipant, dispatch],
  );

  const removeParticipant = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_PARTICIPANT', payload: id });

      // Сохраняем в localStorage
      const updatedParticipants = participants.filter((p) => p.id !== id);
      const serialized = updatedParticipants.map((p) => ({
        ...p,
        addedAt: p.addedAt.toISOString(),
      }));
      localStorage.setItem(
        'wheelOfFortuneParticipants',
        JSON.stringify(serialized),
      );
    },
    [dispatch, participants],
  );

  const shuffleParticipants = useCallback(() => {
    dispatch({ type: 'SHUFFLE_PARTICIPANTS' });
  }, [dispatch]);

  const sortParticipants = useCallback(() => {
    dispatch({ type: 'SORT_PARTICIPANTS' });
  }, [dispatch]);

  const resetParticipants = useCallback(() => {
    dispatch({ type: 'RESET_PARTICIPANTS' });

    // Сохраняем дефолтных участников в localStorage
    const defaultParticipants = [
      { id: '1', name: 'Илья М', addedAt: new Date().toISOString() },
      { id: '2', name: 'Илья П', addedAt: new Date().toISOString() },
      { id: '3', name: 'Темочка', addedAt: new Date().toISOString() },
      { id: '4', name: 'Павел', addedAt: new Date().toISOString() },
      { id: '5', name: 'Дмитрий', addedAt: new Date().toISOString() },
      { id: '6', name: 'Константин', addedAt: new Date().toISOString() },
    ];
    localStorage.setItem(
      'wheelOfFortuneParticipants',
      JSON.stringify(defaultParticipants),
    );
  }, [dispatch]);

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
