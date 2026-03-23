// src/pages/TransmisionExterna/hooks/useTransmisionSocket.ts

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GiftMessage, TipMessage, SuperChatMessage, ScreenNotification } from '../types/transmision.types';
import { PremioRuleta } from '@/shared/types/ruleta.types';
import { getGiftTierConfig } from '../utils/giftTiers';
import { playSound } from '../utils/sounds';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface UseTransmisionSocketProps {
  enVivo: boolean;
  channelName: string;
  metaActiva: boolean;
  metaActual: number;
  descripcionMeta: string;
  progresoMeta: number;
  chatConfig: any;
  windowRef: React.RefObject<HTMLDivElement>;
  onGiftReceived: (gift: GiftMessage) => void;
  onTipReceived: (tip: TipMessage) => void;
  onSuperChatReceived: (superchat: SuperChatMessage) => void;
  onReactionReceived: () => void;
  onRuletaResultado: (data: { usuario: string; premio: PremioRuleta }) => void;
  onMetaProgreso: (nuevoProgreso: number) => void;
  addScreenNotification: (notification: ScreenNotification) => void;
}

export const useTransmisionSocket = ({
  enVivo,
  channelName,
  metaActiva,
  metaActual,
  descripcionMeta,
  progresoMeta,
  chatConfig,
  windowRef,
  onGiftReceived,
  onTipReceived,
  onSuperChatReceived,
  onReactionReceived,
  onRuletaResultado,
  onMetaProgreso,
  addScreenNotification
}: UseTransmisionSocketProps) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (enVivo && channelName) {
      socketRef.current = io(BACKEND_URL);
      
      socketRef.current.on('connect', () => {
        console.log('✅ Socket.io conectado (Creadora)');
        socketRef.current?.emit('join-channel', channelName);
        
        socketRef.current?.emit('update-chat-config', {
          channelName,
          config: chatConfig
        });
        
        if (metaActiva && metaActual > 0) {
          socketRef.current?.emit('update-meta', {
            channelName,
            activa: metaActiva,
            monto: metaActual,
            descripcion: descripcionMeta,
            progreso: progresoMeta
          });
        }
      });

      // Escuchar regalos
      socketRef.current.on('new-gift', (gift: GiftMessage) => {
        console.log('🎁 REGALO RECIBIDO:', gift);
        onGiftReceived(gift);
        
        const tierConfig = getGiftTierConfig(gift.gift.valor);
        const screenNotif: ScreenNotification = {
          id: 'screen-' + gift.id,
          type: 'gift',
          user: gift.user,
          isVIP: gift.isVIP,
          content: gift.gift.emoji,
          title: gift.gift.nombre,
          valor: gift.gift.valor,
          tier: tierConfig.tier,
          timestamp: new Date(gift.timestamp)
        };
        addScreenNotification(screenNotif);
        playSound(tierConfig.sound);
      });

      // Escuchar reacciones
      socketRef.current.on('send-reaction', (reactionData: { reaction: string }) => {
        if (reactionData.reaction === '❤️') {
          onReactionReceived();
        }
      });

      // Escuchar propinas
      socketRef.current.on('new-tip', (tip: TipMessage) => {
        onTipReceived(tip);
        playSound('small');
      });

      // Escuchar super chats
      socketRef.current.on('new-superchat', (superchat: SuperChatMessage) => {
        console.log('🎯 SUPER CHAT RECIBIDO:', superchat);
        onSuperChatReceived(superchat);
        playSound(superchat.tier === 'elite' ? 'large' : superchat.tier === 'premium' ? 'medium' : 'small');
      });

      // Escuchar resultados de ruleta
      socketRef.current.on('ruleta-resultado', (data: { usuario: string; premio: PremioRuleta }) => {
        console.log('🎰 RESULTADO RULETA:', data);
        onRuletaResultado(data);
        
        const tempDiv = document.createElement('div');
        tempDiv.className = 'fixed top-20 right-6 z-50 animate-fade-in-right max-w-sm';
        tempDiv.innerHTML = `
          <div class="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 text-slate-800 px-6 py-4 rounded-xl shadow-2xl">
            <div class="flex items-center gap-3">
              <div class="text-4xl">${data.premio.icono}</div>
              <div>
                <div class="font-bold text-lg text-purple-900">¡Ruleta Girada! 🎉</div>
                <div class="text-sm text-slate-700 mt-1">
                  <span class="font-semibold">${data.usuario}</span> ganó:<br/>
                  <span class="font-bold text-purple-700">${data.premio.nombre}</span>
                </div>
                <div class="text-xs text-slate-600 mt-1">${data.premio.descripcion}</div>
              </div>
            </div>
          </div>
        `;
        
        if (windowRef.current) {
          windowRef.current.appendChild(tempDiv);
        }
        
        playSound('large');
        
        setTimeout(() => {
          tempDiv.remove();
        }, 6000);
      });

      return () => {
        socketRef.current?.disconnect();
        console.log('🔌 Socket.io desconectado');
      };
    }
  }, [enVivo, channelName]);

  // Sincronizar meta periódicamente
  useEffect(() => {
    if (!enVivo || !channelName || !socketRef.current || !metaActiva) return;

    const intervalo = setInterval(() => {
      if (socketRef.current && metaActiva && metaActual > 0) {
        socketRef.current.emit('update-meta', {
          channelName,
          activa: metaActiva,
          monto: metaActual,
          descripcion: descripcionMeta,
          progreso: progresoMeta
        });
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [enVivo, channelName, metaActiva, metaActual, descripcionMeta, progresoMeta]);

  // Emitir config del chat cuando cambie
  useEffect(() => {
    if (socketRef.current && enVivo && channelName) {
      socketRef.current.emit('update-chat-config', {
        channelName,
        config: chatConfig
      });
    }
  }, [chatConfig, enVivo, channelName]);

  return socketRef;
};
