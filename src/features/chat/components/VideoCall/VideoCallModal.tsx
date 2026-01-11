// src/features/chat/components/VideoCall/VideoCallModal.tsx
// ✅ CORREGIDO: Imagen del usuario mejor posicionada (centro-derecha)

import { useState, useRef, useEffect } from 'react';
import { X, Phone, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoCallModalProps {
  onClose: () => void;
}

export const VideoCallModal = ({ onClose }: VideoCallModalProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCall();
    return () => stopCall();
  }, []);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
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

  const endCall = () => {
    stopCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Remote video (placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <p className="text-white text-lg font-semibold">Esperando respuesta...</p>
          <p className="text-slate-400 text-sm mt-1">La otra persona aún no ha respondido</p>
        </div>
      </div>

      {/* ✅ Local video - MEJOR POSICIONADO (centro-derecha, más abajo) */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 w-64 h-48 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <p className="text-white text-xs text-center px-2">{error}</p>
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-3 left-3 right-3 flex justify-center">
          <span className="text-sm text-white bg-black/60 px-3 py-1 rounded-full font-medium">
            Tú
          </span>
        </div>
      </div>

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
