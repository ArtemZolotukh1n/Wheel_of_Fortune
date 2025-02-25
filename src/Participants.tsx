import styled from 'styled-components';
import { Section, Button, Input } from './styles';
import { FC, useState } from 'react';

import { MAX_PARTICIPANTS } from './App';
import { capitalize } from './utils';

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

interface ParticipantsProps {
  handleAddName: (name: string) => void;
  handleRemoveName: (index: number) => void;
  shuffleNames: () => void;
  sortNames: () => void;
  names: string[];
}

export const Participants: FC<ParticipantsProps> = ({
  handleAddName,
  handleRemoveName,
  shuffleNames,
  sortNames,
  names,
}) => {
  const [participant, setParticipant] = useState('');
  const [error, setError] = useState('');

  const isMaxParticipantsReached = names.length >= MAX_PARTICIPANTS;
  const hasParticipants = names.length > 0;

  const validateInput = (name: string) => {
    const specialCharPattern = /[^а-яА-Я-a-zA-Z0-9 ]/;
    if (!name.trim()) {
      return 'Имя не может быть пустым.';
    }
    if (specialCharPattern.test(name)) {
      return 'Имя не может содержать специальные символы.';
    }
    return '';
  };

  const handleAddParticipant = () => {
    const validationError = validateInput(participant);
    if (validationError) {
      setError(validationError);
    } else {
      handleAddName(participant);
      setParticipant('');
      setError('');
    }
  };

  return (
    <Section>
      <h2>Добавить жертву</h2>
      <Input
        disabled={isMaxParticipantsReached}
        type="text"
        placeholder="Введите имя"
        value={participant}
        onChange={(e) => setParticipant(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleAddParticipant();
          }
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isMaxParticipantsReached && <ErrorMessage>Чет много</ErrorMessage>}
      <Button
        disabled={isMaxParticipantsReached}
        onClick={handleAddParticipant}
      >
        +
      </Button>
      <h2>Участники</h2>
      <ButtonGroup>
        <Button onClick={shuffleNames} disabled={!hasParticipants}>
          Перетасовать
        </Button>
        <Button onClick={sortNames} disabled={!hasParticipants}>
          Отсортировать
        </Button>
      </ButtonGroup>
      <ul>
        {names.map((name, index) => (
          <ListItemContainer key={index}>
            <ListItem>{capitalize(name)}</ListItem>
            <Button onClick={() => handleRemoveName(index)}>—</Button>
          </ListItemContainer>
        ))}
      </ul>
    </Section>
  );
};
