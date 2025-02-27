import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import styled from 'styled-components';

import { capitalize } from './utils';
import { SpinButtons } from './SpinButtons';
import { SongNames, SpinDirection } from './types';
import { MusicButtons } from './MusicButtons';

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

interface Props {
  participants: string[];
}

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

export const Wheel: React.FC<Props> = ({ participants }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [track, setTrack] = useState<SongNames>('baraban_default.mp3');
  const [spinDirection, setSpinDirection] =
    useState<SpinDirection>('по часовой');
  const [showPopup, setShowPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState<string | null>(null);

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
      ctx.fillText(capitalize(participants[i]) || '', radius * 0.5, 0);
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

  const startSpin = useCallback(() => {
    if (spinning) return;
    const audio = new Audio(`/${track}`);
    audio.volume = 0.5;
    audio.play();
    setSpinning(true);

    // Set the number of full rotations and calculate final rotation
    const numFullRotations = Math.random() * 5 + 5; // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === 'по часовой' ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;
    const easing = (t: number) => {
      // Ease-out cubic
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / spinDuration, 1);
      const easeT = easing(t);
      const currentRotation =
        rotation +
        (spinDirection === 'по часовой' ? -totalRotation : totalRotation) *
          easeT;

      setRotation(currentRotation);

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  }, [spinning, track, rotation, spinDirection, participants]);

  const determineWinner = useCallback(
    (finalRotation: number) => {
      const sliceAngle = 360 / numSectors;
      const normalizedRotation = ((finalRotation % 360) + 360) % 360;
      const winningSector = Math.floor(normalizedRotation / sliceAngle);

      setPopupWinner(participants[winningSector]);
      setShowPopup(true);
    },
    [participants, numSectors],
  );

  const changeSpinDirection = useCallback(() => {
    setSpinDirection(
      spinDirection === 'по часовой' ? 'против часовой' : 'по часовой',
    );
  }, [spinDirection]);

  const handleChangeTrack = useCallback(
    (track: SongNames) => {
      setTrack(track);
    },
    [setTrack],
  );

  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

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
      <MusicButtons track={track} setTrack={handleChangeTrack} />
      {showPopup && popupWinner && (
        <Popup>
          <h2>Поздравляю!</h2>
          <h3>{capitalize(popupWinner)}</h3>
        </Popup>
      )}
    </div>
  );
};
