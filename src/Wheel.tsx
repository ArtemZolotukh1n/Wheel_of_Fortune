import React, { useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import styled from 'styled-components';
import ReactSlider from 'react-slider';
import { capitalize } from './utils';
import { SpinButtons } from './SpinButtons';
import { MusicButtons } from './MusicButtons';
import { useWheel } from './hooks/useWheel';

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: #006400;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 1000;
  animation: popin 1s ease-out;

  @keyframes popin {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const colors = [
  '#CC4629', // Darker vibrant orange
  '#CC9A29', // Darker bright yellow
  '#29CC99', // Darker turquoise
  '#2985CC', // Darker sky blue
  '#29CC46', // Darker bright teal-green
  '#293FCC', // Darker bright blue
  '#4629CC', // Darker purple
  '#9929CC', // Darker violet
  '#CC2981', // Darker hot pink
  '#CC2929', // Darker red
  '#CC5929', // Darker coral
  '#CC9529', // Darker gold
  '#29CC91', // Darker pale turquoise
  '#298ECC', // Darker deep sky blue
  '#4A29CC', // Darker royal blue
  '#8429CC', // Darker medium purple
  '#CC298F', // Darker fuchsia
  '#CC294F', // Darker hot pink
];

export const Wheel: React.FC = () => {
  const {
    spinning,
    rotation,
    winner,
    showWinnerPopup,
    participants,
    audioVolume,
    audioTrack,
    spinDirection,
    startSpin,
    changeSpinDirection,
    setAudioVolume,
    setAudioTrack,
  } = useWheel();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const numSectors = participants.length;

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel();
    }
  }, [participants, rotation]);

  const darkenColor = (color: string, amount: number): string => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / numSectors;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);
    ctx.rotate(-rotation * (Math.PI / 180));

    // Draw sectors
    for (let i = 0; i < numSectors; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      const color = darkenColor(colors[i % colors.length], 30);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw the name in the sector
      ctx.save();
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.fillText(capitalize(participants[i]?.name) || '', radius * 0.5, 0);
      ctx.restore();
    }

    ctx.rotate(rotation * (Math.PI / 180)); // Reset rotation
    ctx.translate(-radius, -radius);

    // Draw the static indicator
    const indicatorLength = 20;
    const indicatorWidth = 10;
    ctx.save();
    ctx.translate(canvas.width, canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(-indicatorLength, -indicatorWidth / 2);
    ctx.lineTo(0, -indicatorWidth / 2);
    ctx.lineTo(0, indicatorWidth / 2);
    ctx.lineTo(-indicatorLength, indicatorWidth / 2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
  };

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (showWinnerPopup) {
      startConfetti();
    }
  }, [showWinnerPopup]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ borderRadius: '50%', border: '2px solid black' }}
      />
      <SpinButtons
        spinDirection={spinDirection}
        changeSpinDirection={changeSpinDirection}
        startSpin={startSpin}
        spinning={spinning}
        participants={participants}
      />
      <MusicButtons track={audioTrack} setTrack={setAudioTrack} />
      <ReactSlider
        className="customSlider"
        trackClassName="customSlider-track"
        thumbClassName="customSlider-thumb"
        marks={5}
        min={0}
        max={100}
        defaultValue={audioVolume}
        value={audioVolume}
        onChange={(value: number) => setAudioVolume(value)}
        renderMark={(props) => {
          const key = props.key as number;
          if (key < audioVolume) {
            props.className = 'customSlider-mark customSlider-mark-before';
          } else if (key === audioVolume) {
            props.className = 'customSlider-mark customSlider-mark-active';
          }
          return <span {...props} />;
        }}
      />
      {showWinnerPopup && winner && (
        <Popup>
          <h2>Поздравляю!</h2>
          <h3>{capitalize(winner.name)}</h3>
        </Popup>
      )}
    </div>
  );
};
