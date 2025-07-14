import React from 'react';
import { Button, ButtonsContainer } from './styles';
import { SongNames } from './types/index';
interface IMusicButtonsProps {
  track: SongNames;
  setTrack: (track: SongNames) => void;
}

export const MusicButtons = React.memo(
  ({ track, setTrack }: IMusicButtonsProps) => (
    <>
      <h3>Варианты музыки</h3>

      <ButtonsContainer>
        <Button
          className={track === 'baraban_default.mp3' ? 'isSelected' : undefined}
          onClick={() => setTrack('baraban_default.mp3')}
          size="sm"
        >
          Классика
        </Button>
        <Button
          size="sm"
          className={track === 'napas.mp3' ? 'isSelected' : undefined}
          onClick={() => setTrack('napas.mp3')}
        >
          "Культурная"
        </Button>
        <Button
          size="sm"
          className={track === 'baraban_1995.mp3' ? 'isSelected' : undefined}
          onClick={() => setTrack('baraban_1995.mp3')}
        >
          Вариант 1995
        </Button>
        <Button
          size="sm"
          className={track === 'volchok.mp3' ? 'isSelected' : undefined}
          onClick={() => setTrack('volchok.mp3')}
        >
          Что?Где?Когда?
        </Button>
      </ButtonsContainer>
    </>
  ),
);
