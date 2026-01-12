// src/features/chat/components/FloatingChat/ChatInput.tsx
// ✅ MEJORADO: Usa callback en lugar de modal local

import { useState, useRef } from 'react';
import { Send, Paperclip, Gift, DollarSign, Smile, Camera, Video, Mic, Phone } from 'lucide-react';
import { EmojiPicker } from '../Emoji/EmojiPicker';
import { CameraCapture } from '../Capture/CameraCapture';
import { VideoRecorder } from '../Capture/VideoRecorder';
import { AudioRecorder } from '../Capture/AudioRecorder';
// ❌ QUITADO: import { VideoCallModal } from '../VideoCall/VideoCallModal';
import { UserRole } from '../../types/user.types';
import { ChatPermissions } from '../../types/chat.types';

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
  onVideoCallStart?: () => void; // ✅ NUEVO
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
  onVideoCallStart, // ✅ NUEVO
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  // ❌ QUITADO: const [showVideoCall, setShowVideoCall] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
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

  // ✅ NUEVO: Inicia videollamada persistente
  const handleVideoCall = () => {
    if (onVideoCallStart) {
      onVideoCallStart();
    }
  };

  return (
    <>
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-end gap-2">
          {/* Botones izquierda */}
          <div className="flex items-center gap-1">
            {/* CREADORA */}
            {userRole === 'creadora' && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600"
                  title="Subir imagen"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                <button onClick={() => setShowCameraCapture(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Tomar foto">
                  <Camera className="w-4 h-4" />
                </button>

                <button onClick={() => setShowVideoRecorder(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Grabar video">
                  <Video className="w-4 h-4" />
                </button>

                <button onClick={() => setShowAudioRecorder(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Grabar audio">
                  <Mic className="w-4 h-4" />
                </button>

                {/* ✅ Videollamada con callback */}
                <button onClick={handleVideoCall} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Videollamada">
                  <Phone className="w-4 h-4" />
                </button>
              </>
            )}

            {/* ESPECTADOR */}
            {userRole === 'espectador' && (
              <>
                {permissions.canSendImages && (
                  <>
                    <button onClick={() => fileInputRef.current?.click()} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Subir imagen">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <button onClick={() => setShowCameraCapture(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Tomar foto">
                      <Camera className="w-4 h-4" />
                    </button>
                  </>
                )}

                {permissions.canSendVideos && (
                  <>
                    <button onClick={() => videoInputRef.current?.click()} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Subir video">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    <button onClick={() => setShowVideoRecorder(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Grabar video">
                      <Video className="w-4 h-4" />
                    </button>
                  </>
                )}

                {permissions.canSendAudio && (
                  <>
                    <button onClick={() => audioInputRef.current?.click()} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Subir audio">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    <button onClick={() => setShowAudioRecorder(true)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Grabar audio">
                      <Mic className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* ✅ Videollamada con callback */}
                {permissions.canRequestVideocall && (
                  <button onClick={handleVideoCall} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition text-slate-600" title="Videollamada">
                    <Phone className="w-4 h-4" />
                  </button>
                )}

                <button onClick={onToggleGiftPanel} className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${showGiftPanel ? 'bg-pink-100 text-pink-600' : 'hover:bg-slate-100 text-slate-600'}`} title="Enviar regalo">
                  <Gift className="w-4 h-4" />
                </button>

                <button onClick={onToggleTipPanel} className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${showTipPanel ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100 text-slate-600'}`} title="Enviar propina">
                  <DollarSign className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Emoji picker */}
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${showEmojiPicker ? 'bg-violet-100 text-violet-600' : 'hover:bg-slate-100 text-slate-600'}`} title="Emojis">
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              rows={1}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {/* Botón enviar */}
          <button onClick={handleSend} disabled={!message.trim() || isSending} className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl flex items-center justify-center transition shadow-md disabled:shadow-none">
            <Send className="w-4 h-4" />
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
      
      {/* ❌ QUITADO: VideoCallModal local */}
    </>
  );
};
