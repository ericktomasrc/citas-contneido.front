// src/features/chat/components/Animations/GiftAnimation.tsx
// ✅ Animación de regalo con billetes cayendo

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 

interface GiftAnimationProps {
  giftEmoji: string;
  giftName: string;
  amount: number;
  senderName: string;
  onComplete?: () => void;
}

export const GiftAnimation = ({
  giftEmoji,
  giftName,
  amount,
  senderName,
  onComplete,
}: GiftAnimationProps) => {
  const [show, setShow] = useState(true);
  const [bills, setBills] = useState<Array<{ id: number; delay: number; x: number }>>([]);

  useEffect(() => {
    // Crear billetes
    const billCount = 15;
    const newBills = Array.from({ length: billCount }, (_, i) => ({
      id: i,
      delay: i * 0.1,
      x: Math.random() * 100,
    }));
    setBills(newBills);

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
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Billetes cayendo */}
          {bills.map((bill) => (
            <motion.div
              key={bill.id}
              initial={{ y: -100, x: `${bill.x}%`, rotate: 0, opacity: 0 }}
              animate={{
                y: window.innerHeight + 100,
                rotate: [0, 180, 360, 540],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: bill.delay,
                ease: 'easeIn',
              }}
              className="absolute text-4xl"
              style={{ left: `${bill.x}%` }}
            >
              💵
            </motion.div>
          ))}

          {/* Card central con info del regalo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 rounded-3xl shadow-2xl p-8 max-w-sm mx-4"
          >
            {/* Icono del regalo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-7xl mb-4 text-center"
            >
              {giftEmoji}
            </motion.div>

            {/* Nombre del regalo */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              {giftName}
            </h3>

            {/* Monto */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 mb-4">
              <p className="text-4xl font-black text-white text-center">
                ${amount}
              </p>
            </div>

            {/* Sender */}
            <p className="text-white/90 text-center text-sm">
              Regalo de <span className="font-semibold">{senderName}</span>
            </p>

            {/* Sparkles decorativos */}
            <div className="absolute -top-4 -right-4 text-4xl animate-pulse">✨</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse delay-150">✨</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
