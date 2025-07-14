import React, { useState } from 'react';
import styled from 'styled-components';
import { Section, Button, Input } from './styles';
import { useParticipants } from './hooks/useParticipants';
import { capitalize } from './utils';
import { useErrorContext } from './hooks/useErrorContext';

const ListItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin: 5px;
  background-color: #f9f9f9;
  border-radius: 10px;
  list-style: none;
  color: #282c34;
  font-weight: bold;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  padding-left: 32px;
  & > button {
    margin-left: 10px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;

export const Participants: React.FC = () => {
  const {
    participants,
    addParticipant,
    removeParticipant,
    shuffleParticipants,
    sortParticipants,
    resetParticipants,
    isMaxParticipantsReached,
    hasParticipants,
  } = useParticipants();

  const [inputValue, setInputValue] = useState('');
  const { addError, addSuccess } = useErrorContext();

  const handleAddParticipant = () => {
    const result = addParticipant(inputValue);
    if (result.isValid) {
      setInputValue('');
      addSuccess('Участник успешно добавлен!');
    } else {
      addError(result.error?.message || 'Произошла ошибка');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    }
  };

  const handleRemoveParticipant = (id: string) => {
    removeParticipant(id);
  };

  return (
    <Section>
      <h2>Добавить жертву</h2>
      <Input
        disabled={isMaxParticipantsReached}
        type="text"
        placeholder="Введите имя"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {isMaxParticipantsReached && <ErrorMessage>Чет много</ErrorMessage>}
      <Button
        disabled={isMaxParticipantsReached}
        onClick={handleAddParticipant}
      >
        +
      </Button>
      <h2>Участники</h2>
      <ButtonGroup>
        <Button onClick={shuffleParticipants} disabled={!hasParticipants}>
          Перетасовать
        </Button>
        <Button onClick={sortParticipants} disabled={!hasParticipants}>
          Отсортировать
        </Button>
        <Button
          onClick={resetParticipants}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          Сброс
        </Button>
      </ButtonGroup>
      <ul>
        {participants.map((participant) => (
          <ListItemContainer key={participant.id}>
            <ListItem>{capitalize(participant.name)}</ListItem>
            <Button onClick={() => handleRemoveParticipant(participant.id)}>
              —
            </Button>
          </ListItemContainer>
        ))}
      </ul>
    </Section>
  );
};
