// src/features/chat/components/FloatingChat/ChatInput.tsx
// ✅ MEJORADO: Compacto, botones más pequeños

import { useState, useRef } from 'react';
import { Send, Paperclip, Gift, DollarSign, Smile, Camera, Video, Mic, Phone } from 'lucide-react';
import { EmojiPicker } from '../Emoji/EmojiPicker';
import { CameraCapture } from '../Capture/CameraCapture';
import { VideoRecorder } from '../Capture/VideoRecorder';
import { AudioRecorder } from '../Capture/AudioRecorder';
import { UserRole } from '../../types/user.types';
import { ChatPermissions } from '../../types/chat.types';
import { useUserRole } from '../../hooks/useUserRole';
import { useChatServices } from '@/hooks/useChatService';

interface ChatInputProps {
  userRole: UserRole;
  permissions: ChatPermissions;
  onSendMessage: (message: string) => void;
  onSendGift: (giftId: string, giftName: string, giftEmoji: string, amount: number) => void;
  onSendTip: (amount: number) => void;
  onSendImage: (file: File) => void;
  onSendVideo: (file: File) => void;
  onSendAudio: (file: File) => void;
  isSending: boolean;
  showGiftPanel: boolean;
  onToggleGiftPanel: () => void;
  showTipPanel?: boolean;
  onToggleTipPanel?: () => void;
  onVideoCallStart?: () => void;
  conversationId?: string;
  recipientId?: string;
  enableMockSync?: boolean;
}

export const ChatInput = ({
  userRole,
  permissions,
  onSendMessage,
  onSendImage,
  onSendVideo,
  onSendAudio,
  isSending,
  showGiftPanel,
  onToggleGiftPanel,
  showTipPanel,
  onToggleTipPanel,
  onVideoCallStart,
  conversationId,
  enableMockSync = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { chat: chatService } = useChatServices();
  const { user } = useUserRole();

  const handleSend = async () => {
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
      
      if (enableMockSync && conversationId && user) {
        try {
          await chatService.sendMessage({
            conversationId,
            senderId: user.id,
            senderName: user.username,
            senderAvatar: user.avatar,
            type: 'text',
            content: message.trim(),
          });
        } catch (error) {
          console.error('Error enviando a servicio mock:', error);
        }
      }
      
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSendImage(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSendVideo(file);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSendAudio(file);
  };

  const handleCameraCapture = (file: File) => {
    onSendImage(file);
    setShowCameraCapture(false);
  };

  const handleVideoRecord = (file: File) => {
    onSendVideo(file);
    setShowVideoRecorder(false);
  };

  const handleAudioRecord = (file: File) => {
    onSendAudio(file);
    setShowAudioRecorder(false);
  };

  const handleVideoCall = () => {
    if (onVideoCallStart) {
      onVideoCallStart();
    }
  };

  // Botón compacto reutilizable
  const ActionButton = ({ 
    onClick, 
    active = false, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    title: string; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded flex items-center justify-center transition ${
        active 
          ? 'bg-slate-200 text-slate-700' 
          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="p-2.5 bg-white border-t border-slate-200">
        <div className="flex items-end gap-2">
          {/* Botones izquierda */}
          <div className="flex items-center gap-0.5">
            {/* CREADORA */}
            {userRole === 'creadora' && (
              <>
                <ActionButton onClick={() => fileInputRef.current?.click()} title="Subir imagen">
                  <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                <ActionButton onClick={() => setShowCameraCapture(true)} title="Tomar foto">
                  <Camera className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>

                <ActionButton onClick={() => setShowVideoRecorder(true)} title="Grabar video">
                  <Video className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>

                <ActionButton onClick={() => setShowAudioRecorder(true)} title="Grabar audio">
                  <Mic className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>

                <ActionButton onClick={handleVideoCall} title="Videollamada">
                  <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>
              </>
            )}

            {/* ESPECTADOR */}
            {userRole === 'espectador' && (
              <>
                {permissions.canSendImages && (
                  <>
                    <ActionButton onClick={() => fileInputRef.current?.click()} title="Subir imagen">
                      <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <ActionButton onClick={() => setShowCameraCapture(true)} title="Tomar foto">
                      <Camera className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                  </>
                )}

                {permissions.canSendVideos && (
                  <>
                    <ActionButton onClick={() => videoInputRef.current?.click()} title="Subir video">
                      <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                    <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    <ActionButton onClick={() => setShowVideoRecorder(true)} title="Grabar video">
                      <Video className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                  </>
                )}

                {permissions.canSendAudio && (
                  <>
                    <ActionButton onClick={() => audioInputRef.current?.click()} title="Subir audio">
                      <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                    <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    <ActionButton onClick={() => setShowAudioRecorder(true)} title="Grabar audio">
                      <Mic className="w-3.5 h-3.5" strokeWidth={2} />
                    </ActionButton>
                  </>
                )}

                {permissions.canRequestVideocall && (
                  <ActionButton onClick={handleVideoCall} title="Videollamada">
                    <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                  </ActionButton>
                )}

                <ActionButton onClick={onToggleGiftPanel} active={showGiftPanel} title="Enviar regalo">
                  <Gift className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>

                <ActionButton onClick={onToggleTipPanel!} active={showTipPanel} title="Enviar propina">
                  <DollarSign className="w-3.5 h-3.5" strokeWidth={2} />
                </ActionButton>
              </>
            )}

            {/* Emoji picker */}
            <ActionButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} active={showEmojiPicker} title="Emojis">
              <Smile className="w-3.5 h-3.5" strokeWidth={2} />
            </ActionButton>
          </div>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              rows={1}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
              style={{ minHeight: '32px', maxHeight: '80px' }}
            />
          </div>

          {/* Botón enviar */}
          <button 
            onClick={handleSend} 
            disabled={!message.trim() || isSending} 
            className="w-8 h-8 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition shadow-sm disabled:shadow-none"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 z-10">
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
        </div>
      )}

      {/* Modales de captura */}
      {showCameraCapture && <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCameraCapture(false)} />}
      {showVideoRecorder && <VideoRecorder onRecord={handleVideoRecord} onClose={() => setShowVideoRecorder(false)} />}
      {showAudioRecorder && <AudioRecorder onRecord={handleAudioRecord} onClose={() => setShowAudioRecorder(false)} />}
    </>
  );
};
