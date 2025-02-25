import styled from 'styled-components';

import { Participants } from './Participants';
import { Wheel } from './Wheel';

import './App.css';
import { useState } from 'react';
import { Header } from './Header';

const Main = styled.main`
  display: flex;
  justify-content: space-around;
  padding: 20px 0px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

export const MAX_PARTICIPANTS = 32;
const DEFAULT_NAMES = [
  'Илья М',
  'Илья П',
  'Темочка',
  'Павел',
  'Дмитрий',
  'Константин',
];
function App() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);

  const handleAddName = (name: string) => {
    if (names.length < MAX_PARTICIPANTS) {
      setNames([...names, name]);
    }
  };

  const handleRemoveName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const shuffleNames = () => {
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffledNames);
  };

  const sortNames = () => {
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    setNames(sortedNames);
  };

  return (
    <>
      <Header />
      <Main>
        <Participants
          handleAddName={handleAddName}
          handleRemoveName={handleRemoveName}
          shuffleNames={shuffleNames}
          sortNames={sortNames}
          names={names}
        />
        <Wheel participants={names} />
      </Main>
    </>
  );
}

export default App;
