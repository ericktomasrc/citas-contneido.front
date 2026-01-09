// src/stores/chat.store.ts

import { create } from 'zustand';
import { Message, Chat } from '@/features/chat/types/message.types';

interface ChatState {
  // Chats activos
  activeChats: Chat[];
  
  // Mensajes por chat
  messagesByChat: Record<string, Message[]>;
  
  // Chat actual abierto en modal
  activeChatId: string | null;
  isModalOpen: boolean;
  
  // Estado de escritura
  typingUsers: Record<string, boolean>;
  
  // Actions
  setActiveChat: (chatId: string | null) => void;
  openChat: (chat: Chat) => void;
  closeChat: () => void;
  addMessage: (chatId: string, message: Message) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeChats: [],
  messagesByChat: {},
  activeChatId: null,
  isModalOpen: false,
  typingUsers: {},

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  openChat: (chat) => {
    set({ 
      activeChatId: chat.id,
      isModalOpen: true,
    });
    
    // Agregar a chats activos si no existe
    const { activeChats } = get();
    if (!activeChats.find(c => c.id === chat.id)) {
      set({ activeChats: [...activeChats, chat] });
    }
  },

  closeChat: () => set({ 
    activeChatId: null,
    isModalOpen: false,
  }),

  addMessage: (chatId, message) => {
    const { messagesByChat } = get();
    const chatMessages = messagesByChat[chatId] || [];
    
    set({
      messagesByChat: {
        ...messagesByChat,
        [chatId]: [...chatMessages, message],
      },
    });
  },

  markAsRead: (chatId) => {
    const { activeChats } = get();
    const updatedChats = activeChats.map(chat =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    );
    set({ activeChats: updatedChats });
  },

  setTyping: (chatId, isTyping) => {
    set(state => ({
      typingUsers: {
        ...state.typingUsers,
        [chatId]: isTyping,
      },
    }));
  },

  updateChat: (chatId, updates) => {
    const { activeChats } = get();
    const updatedChats = activeChats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    );
    set({ activeChats: updatedChats });
  },
}));
