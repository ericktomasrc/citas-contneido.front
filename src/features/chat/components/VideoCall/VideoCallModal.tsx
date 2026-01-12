// src/features/chat/components/VideoCall/VideoCallModal.tsx
// ✅ CORREGIDO: Stream persiste al cambiar de modo (fullscreen/minimized/swap)

import { useState, useRef, useEffect } from 'react';
import { X, Phone, Mic, MicOff, Video, VideoOff, Minimize2, Maximize2 } from 'lucide-react';

interface VideoCallModalProps {
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const VideoCallModal = ({ 
  onClose, 
  isMinimized = false,
  onToggleMinimize 
}: VideoCallModalProps) => {
  // ✅ Refs para diferentes videos
  const localVideoRefMini = useRef<HTMLVideoElement>(null);
  const localVideoRefLarge = useRef<HTMLVideoElement>(null);
  const localVideoRefSmall = useRef<HTMLVideoElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isLocalLarge, setIsLocalLarge] = useState(false);
  
  const [position, setPosition] = useState({ 
    x: window.innerWidth - 320, 
    y: window.innerHeight - 240 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ✅ Iniciar stream una sola vez
  useEffect(() => {
    startCall();
    return () => stopCall();
  }, []);

  // ✅ CRÍTICO: Re-asignar stream a los videos cuando cambia el modo o el swap
  useEffect(() => {
    if (stream) {
      // Modo minimizado
      if (isMinimized && localVideoRefMini.current) {
        localVideoRefMini.current.srcObject = stream;
        localVideoRefMini.current.play().catch(err => console.log('Play error:', err));
      }
      
      // Modo fullscreen - video grande
      if (!isMinimized && isLocalLarge && localVideoRefLarge.current) {
        localVideoRefLarge.current.srcObject = stream;
        localVideoRefLarge.current.play().catch(err => console.log('Play error:', err));
      }
      
      // Modo fullscreen - video pequeño
      if (!isMinimized && !isLocalLarge && localVideoRefSmall.current) {
        localVideoRefSmall.current.srcObject = stream;
        localVideoRefSmall.current.play().catch(err => console.log('Play error:', err));
      }
    }
  }, [stream, isMinimized, isLocalLarge]);

  useEffect(() => {
    if (isMinimized) {
      setPosition({
        x: window.innerWidth - 320,
        y: window.innerHeight - 240,
      });
    }
  }, [isMinimized]);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError('No se pudo acceder a la cámara o micrófono');
      console.error('Call error:', err);
    }
  };

  const stopCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleSwap = () => {
    setIsLocalLarge(!isLocalLarge);
  };

  const endCall = () => {
    stopCall();
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isMinimized) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 220;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(20, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // ✅ MODO MINIMIZADO (PiP)
  if (isMinimized) {
    return (
      <div
        onMouseDown={handleMouseDown}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`fixed w-80 h-56 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-50 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Video */}
        {error ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-xs text-center px-2">{error}</p>
          </div>
        ) : (
          <video
            ref={localVideoRefMini}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex flex-col justify-between p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white bg-black/40 px-2 py-1 rounded-full font-medium">
              En llamada
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMinimize?.();
                }}
                className="w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  endCall();
                }}
                className="w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleMute}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                isMuted ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                isVideoOff ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-4 h-4 text-white" />
              ) : (
                <Video className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MODO FULLSCREEN
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Video grande */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        {isLocalLarge ? (
          error ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={localVideoRefLarge}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <p className="text-white text-lg font-semibold">Esperando respuesta...</p>
              <p className="text-slate-400 text-sm mt-1">La otra persona aún no ha respondido</p>
            </div>
          </div>
        )}
      </div>

      {/* Video pequeño */}
      {!isLocalLarge && (
        <div className="absolute top-20 right-6 w-72 h-52 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          {error ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <p className="text-white text-xs text-center px-2">{error}</p>
            </div>
          ) : (
            <video
              ref={localVideoRefSmall}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-sm text-white bg-black/60 px-3 py-1 rounded-full font-medium">
              Tú
            </span>
            <button
              onClick={toggleSwap}
              className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Video pequeño cuando local es grande */}
      {isLocalLarge && (
        <div className="absolute top-20 right-6 w-72 h-52 bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-white text-sm">Esperando...</p>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-sm text-white bg-black/60 px-3 py-1 rounded-full font-medium">
              Remoto
            </span>
            <button
              onClick={toggleSwap}
              className="w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
            >
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          {isMuted ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition shadow-lg"
        >
          <Phone className="w-6 h-6 text-white rotate-[135deg]" />
        </button>

        <button
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg ${
            isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          {isVideoOff ? (
            <VideoOff className="w-6 h-6 text-white" />
          ) : (
            <Video className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Botón minimizar */}
      <button
        onClick={onToggleMinimize}
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition"
      >
        <Minimize2 className="w-5 h-5 text-white" />
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
