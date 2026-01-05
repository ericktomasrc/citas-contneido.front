// src/hooks/useTransmisionChat.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ChatMessage {
  id: string;
  user: string;
  mensaje: string;
  isVIP: boolean;
  avatar?: string;
  timestamp: Date;
}

interface ChatConfig {
  publicoPuedeChatear: boolean;
  suscriptoresPuedeChatear: boolean;
  soloEmoticonos: boolean;
  soloMensajes: boolean;
  palabrasRestringidas: string[];
}

export const useTransmisionChat = (channelName: string, enVivo: boolean) => {
  const socketRef = useRef<Socket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatConfig, setChatConfig] = useState<ChatConfig>({
    publicoPuedeChatear: true,
    suscriptoresPuedeChatear: true,
    soloEmoticonos: true,
    soloMensajes: true,
    palabrasRestringidas: []
  });

  useEffect(() => {
    if (enVivo && channelName) {
      socketRef.current = io(BACKEND_URL);

      socketRef.current.on('connect', () => {
        console.log('✅ Socket conectado');
        socketRef.current?.emit('join-channel', channelName);
        
        // Enviar config inicial
        socketRef.current?.emit('update-chat-config', {
          channelName,
          config: chatConfig
        });
      });

      socketRef.current.on('new-message', (message: ChatMessage) => {
        setChatMessages(prev => [...prev, message]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [enVivo, channelName]);

  // Actualizar config cuando cambia
  useEffect(() => {
    if (socketRef.current && enVivo && channelName) {
      socketRef.current.emit('update-chat-config', {
        channelName,
        config: chatConfig
      });
    }
  }, [chatConfig, enVivo, channelName]);

  const enviarMensaje = (mensaje: string) => {
    if (!socketRef.current || !mensaje.trim()) return;
    
    socketRef.current.emit('chat-message', {
      channelName,
      user: 'María (Creadora)',
      mensaje,
      isVIP: true,
      avatar: '👑'
    });
  };

  return {
    chatMessages,
    chatConfig,
    setChatConfig,
    enviarMensaje
  };
};