import React from 'react';

// This component uses CSS to create a falling confetti effect.
// No new libraries are needed.

export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;

  const confettiCount = 150;
  const confetti = Array.from({ length: confettiCount }).map((_, index) => {
    const style = {
      '--speed': Math.random() * 2 + 1,
      '--delay': Math.random(),
      '--color': `hsl(${Math.random() * 360}, 100%, 50%)`,
      '--left': `${Math.random() * 100}%`,
      '--horizontal': `${(Math.random() - 0.5) * 200}px`,
      '--rotate': `${(Math.random() - 0.5) * 720}deg`,
    } as React.CSSProperties;
    return <i key={index} style={style} />;
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      <style>
        {`
          @keyframes fall {
            0% {
              opacity: 1;
              transform: translateY(-10vh) translateX(0) rotate(0);
            }
            100% {
              opacity: 0.5;
              transform: translateY(110vh) translateX(var(--horizontal)) rotate(var(--rotate));
            }
          }
          .fixed > i {
            position: absolute;
            top: 0;
            left: var(--left);
            width: 10px;
            height: 10px;
            background: var(--color);
            animation: fall calc(var(--speed) * 1s) linear calc(var(--delay) * 1s) infinite;
            opacity: 0;
          }
        `}
      </style>
      {confetti}
    </div>
  );
};