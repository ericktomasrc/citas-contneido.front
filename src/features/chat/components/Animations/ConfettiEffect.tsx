// src/features/chat/components/Animations/ConfettiEffect.tsx
// ✅ Efecto confetti usando canvas-confetti

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  type?: 'gift' | 'tip';
}

export const ConfettiEffect = ({ trigger, type = 'gift' }: ConfettiEffectProps) => {
  useEffect(() => {
    if (!trigger) return;

    const colors = type === 'gift' 
      ? ['#ec4899', '#f472b6', '#fbcfe8', '#fce7f3'] // Rosa (regalos)
      : ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']; // Verde (propinas)

    // Explosión desde abajo
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [trigger, type]);

  return null;
};
