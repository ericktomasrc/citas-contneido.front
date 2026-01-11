// src/features/chat/components/Emoji/EmojiPicker.tsx
// ✅ Emoji picker gratis - Emojis nativos

import { X } from 'lucide-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  const emojis = {
    'Recientes': ['😂', '❤️', '😍', '🤣', '😊', '🙏', '💕', '😭'],
    'Emociones': [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊',
      '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏',
      '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
      '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
    ],
    'Gestos': [
      '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
      '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜',
      '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦵', '🦶',
    ],
    'Corazones': [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹',
      '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟',
    ],
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-800">Emojis</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Emojis */}
      <div className="max-h-80 overflow-y-auto p-4">
        {Object.entries(emojis).map(([category, emojiList]) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojiList.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => onSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 rounded transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
