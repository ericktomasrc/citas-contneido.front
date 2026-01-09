// src/features/chat/components/FloatingChat/ChatInput.tsx
// ✅ CORREGIDO: Sin panel interno, solo botones que activan el panel del padre

import { useState, useRef } from 'react';
import { Send, Gift, DollarSign, Paperclip, Image, Video, Mic } from 'lucide-react';
import { UserRole } from '../../types/user.types';
import { ChatPermissions } from '../../types/chat.types';

interface ChatInputProps {
  userRole: UserRole;
  permissions: ChatPermissions;
  onSendMessage: (content: string) => void;
  onSendGift?: (giftId: string, giftName: string, giftEmoji: string, amount: number) => void;
  onSendTip?: (amount: number) => void;
  onSendImage?: (file: File) => void;
  onSendVideo?: (file: File) => void;
  onSendAudio?: (file: File) => void;
  isSending?: boolean;
  showGiftPanel?: boolean;
  onToggleGiftPanel?: () => void;
}

export const ChatInput = ({
  userRole,
  permissions,
  onSendMessage,
  onSendGift,
  onSendTip,
  onSendImage,
  onSendVideo,
  onSendAudio,
  isSending = false,
  showGiftPanel = false,
  onToggleGiftPanel,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendImage?.(file);
    }
    setShowUploadMenu(false);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendVideo?.(file);
    }
    setShowUploadMenu(false);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendAudio?.(file);
    }
    setShowUploadMenu(false);
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      {/* INPUT PRINCIPAL */}
      <div className="p-4">
        {/* Botones de acción */}
        <div className="flex items-center gap-2 mb-3">
          {/* Regalo (solo espectador) */}
          {userRole === 'espectador' && permissions.canSendGifts && (
            <button
              onClick={onToggleGiftPanel}
              className={`p-2 rounded-lg transition-colors ${
                showGiftPanel
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-600'
              }`}
              title="Enviar regalo"
            >
              <Gift className="w-5 h-5" />
            </button>
          )}

          {/* Propina (solo espectador) */}
          {userRole === 'espectador' && permissions.canSendTips && (
            <button
              onClick={onToggleGiftPanel}
              className={`p-2 rounded-lg transition-colors ${
                showGiftPanel
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
              }`}
              title="Enviar propina"
            >
              <DollarSign className="w-5 h-5" />
            </button>
          )}

          {/* Adjuntar */}
          {(permissions.canSendPhotos || permissions.canSendVideos || permissions.canSendAudios) && (
            <div className="relative">
              <button
                onClick={() => setShowUploadMenu(!showUploadMenu)}
                className={`p-2 rounded-lg transition-colors ${
                  showUploadMenu
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
                title="Adjuntar archivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Menú de upload ENCIMA */}
              {showUploadMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[180px] z-10">
                  {/* Imagen */}
                  {permissions.canSendPhotos && (
                    <>
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-lg transition text-left"
                      >
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Image className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Foto</span>
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </>
                  )}

                  {/* Video */}
                  {permissions.canSendVideos && (
                    <>
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-violet-50 rounded-lg transition text-left"
                      >
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                          <Video className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Video</span>
                      </button>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </>
                  )}

                  {/* Audio */}
                  {permissions.canSendAudios && (
                    <>
                      <button
                        onClick={() => audioInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 rounded-lg transition text-left"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Mic className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Audio</span>
                      </button>
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input de mensaje */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className={`p-2.5 rounded-xl transition-all ${
              message.trim() && !isSending
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className={`w-5 h-5 ${isSending ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
