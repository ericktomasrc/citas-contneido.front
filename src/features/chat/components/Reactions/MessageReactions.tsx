// src/features/chat/components/Reactions/MessageReactions.tsx
// ✅ Mostrar reacciones de un mensaje

import { motion, AnimatePresence } from 'framer-motion';
import { Reaction } from '../../services/interfaces/IReactionService';

interface MessageReactionsProps {
  reactions: Reaction[];
  currentUserId: string;
  onReactionClick?: (emoji: string) => void;
}

export const MessageReactions = ({ 
  reactions, 
  currentUserId,
  onReactionClick 
}: MessageReactionsProps) => {
  if (reactions.length === 0) return null;

  // Agrupar reacciones por emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: [],
        hasCurrentUser: false,
      };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.userName);
    if (reaction.userId === currentUserId) {
      acc[reaction.emoji].hasCurrentUser = true;
    }
    return acc;
  }, {} as Record<string, { emoji: string; count: number; users: string[]; hasCurrentUser: boolean }>);

  const reactionGroups = Object.values(groupedReactions);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <AnimatePresence>
        {reactionGroups.map((group) => (
          <motion.button
            key={group.emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReactionClick?.(group.emoji)}
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
              transition-all cursor-pointer
              ${group.hasCurrentUser 
                ? 'bg-violet-100 border border-violet-300' 
                : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
              }
            `}
            title={group.users.join(', ')}
          >
            <span className="text-sm">{group.emoji}</span>
            <span className={`font-medium ${group.hasCurrentUser ? 'text-violet-700' : 'text-slate-600'}`}>
              {group.count}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};
