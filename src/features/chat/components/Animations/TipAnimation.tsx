// src/features/chat/components/Animations/TipAnimation.tsx
// ✅ Animación de propina con efecto de dinero

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface TipAnimationProps {
  amount: number;
  senderName: string;
  onComplete?: () => void;
}

export const TipAnimation = ({ amount, senderName, onComplete }: TipAnimationProps) => {
  const [show, setShow] = useState(true);
  const [coins, setCoins] = useState<Array<{ id: number; delay: number; x: number }>>([]);

  useEffect(() => {
    // Crear monedas
    const coinCount = 20;
    const newCoins = Array.from({ length: coinCount }, (_, i) => ({
      id: i,
      delay: i * 0.08,
      x: Math.random() * 100,
    }));
    setCoins(newCoins);

    // Ocultar después de 3 segundos
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Monedas cayendo */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: -100, x: `${coin.x}%`, rotate: 0, opacity: 0, scale: 0 }}
              animate={{
                y: window.innerHeight + 100,
                rotate: [0, 360, 720],
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: coin.delay,
                ease: 'easeIn',
              }}
              className="absolute text-3xl"
              style={{ left: `${coin.x}%` }}
            >
              💰
            </motion.div>
          ))}

          {/* Card central */}
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl p-8 max-w-sm mx-4"
          >
            {/* Icono de propina */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ delay: 0.3, duration: 0.5, repeat: 2 }}
              className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <DollarSign className="w-12 h-12 text-white" />
            </motion.div>

            {/* Texto */}
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              ¡Propina Recibida!
            </h3>

            {/* Monto */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 mb-4">
              <p className="text-5xl font-black text-white text-center">
                ${amount}
              </p>
            </div>

            {/* Sender */}
            <p className="text-white/90 text-center">
              De <span className="font-semibold">{senderName}</span>
            </p>

            {/* Mensaje motivacional */}
            <p className="text-white/70 text-center text-sm mt-2">
              ¡Sigue así! 💪
            </p>

            {/* Decoración */}
            <div className="absolute -top-3 -right-3 text-3xl">💸</div>
            <div className="absolute -bottom-3 -left-3 text-3xl">💵</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
