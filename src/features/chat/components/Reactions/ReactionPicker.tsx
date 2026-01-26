// src/features/chat/components/Reactions/ReactionPicker.tsx
// ✅ Selector de reacciones tipo WhatsApp/Instagram

import { motion } from 'framer-motion';

interface ReactionPickerProps {
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

const REACTIONS = ['❤️', '😍', '🔥', '😂', '👍', '💎', '🎉', '😮'];

export const ReactionPicker = ({ 
  onSelectReaction, 
  onClose,
  position = 'top' 
}: ReactionPickerProps) => {
  const handleSelect = (emoji: string) => {
    onSelectReaction(emoji);
    onClose();
  };

  return (
    <>
      {/* Backdrop invisible para cerrar al hacer click fuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Picker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 z-50`}
      >
        <div className="bg-white rounded-full shadow-2xl border border-slate-200 px-3 py-2 flex items-center gap-1">
          {REACTIONS.map((emoji, index) => (
            <motion.button
              key={emoji}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(emoji)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-2xl"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        
        {/* Flecha */}
        <div className={`absolute left-1/2 -translate-x-1/2 ${position === 'top' ? 'top-full' : 'bottom-full'}`}>
          <div className={`w-3 h-3 bg-white border-slate-200 ${position === 'top' ? 'border-b border-r' : 'border-t border-l'} transform rotate-45`} />
        </div>
      </motion.div>
    </>
  );
};
