// src/features/chat/components/Emoji/EmojiPicker.tsx
// ✅ MEJORADO: Diseño más parecido a WhatsApp

import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ onSelect, onClose }: EmojiPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const emojis = {
    'Recientes': ['😂', '❤️', '😍', '🤣', '😊', '🙏', '💕', '😭'],
    'Emociones': [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
      '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
      '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠',
      '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️',
      '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
      '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
    ],
    'Gestos y Manos': [
      '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️',
      '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇',
      '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏',
      '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾',
    ],
    'Corazones': [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗',
      '💖', '💘', '💝', '💟', '❣️',
    ],
    'Animales': [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
      '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
    ],
  };

  const allEmojis = Object.values(emojis).flat();
  const filteredEmojis = searchTerm
    ? allEmojis.filter(() => true) // En producción, filtrar por nombre
    : null;

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header estilo WhatsApp */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <h3 className="text-sm font-semibold text-slate-800">Emojis</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar emoji"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </div>

      {/* Emojis */}
      <div className="max-h-80 overflow-y-auto p-3">
        {filteredEmojis ? (
          <div className="grid grid-cols-8 gap-0.5">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => onSelect(emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-slate-100 rounded-lg transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          Object.entries(emojis).map(([category, emojiList]) => (
            <div key={category} className="mb-4 last:mb-0">
              <h4 className="text-xs font-semibold text-slate-500 mb-2 px-1">{category}</h4>
              <div className="grid grid-cols-8 gap-0.5">
                {emojiList.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    onClick={() => onSelect(emoji)}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-slate-100 rounded-lg transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
