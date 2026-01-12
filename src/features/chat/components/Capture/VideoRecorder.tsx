// src/features/chat/components/Capture/VideoRecorder.tsx
// ✅ CORREGIDO: createPortal + z-[9999] + estilo igual a CameraModal

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Video, Circle, Square, RotateCw } from 'lucide-react';

interface VideoRecorderProps {
  onRecord: (file: File) => void;
  onClose: () => void;
}

export const VideoRecorder = ({ onRecord, onClose }: VideoRecorderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = () => {
    if (stream) {
      chunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp9' };
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        stopCamera();
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const retake = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    startCamera();
  };

  const sendVideo = () => {
    if (recordedVideo) {
      fetch(recordedVideo)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
          onRecord(file);
        });
    }
  };

  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-700 border-b border-slate-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Grabar Video</h3>
              <p className="text-xs text-slate-400">
                {isRecording ? 'Grabando...' : 'Captura tu contenido'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="text-slate-300 hover:text-white hover:bg-slate-600 transition-colors p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido - Video Preview */}
        <div className="flex-1 overflow-hidden bg-black flex items-center justify-center relative">
          {error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-white font-semibold mb-2">Error de cámara</p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!recordedVideo}
                src={recordedVideo || undefined}
                controls={!!recordedVideo}
                className="w-full h-full object-contain"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  REC {formatTime(recordingTime)}
                </div>
              )}

              {/* Botón de cambiar cámara */}
              {!recordedVideo && !isRecording && (
                <button
                  onClick={handleToggleCamera}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                  title="Cambiar cámara"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer - Botones de Acción */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex-shrink-0">
          <div className="flex gap-3 justify-center">
            {recordedVideo ? (
              <>
                <button
                  onClick={retake}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Grabar Otro
                </button>
                <button
                  onClick={sendVideo}
                  className="px-8 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Enviar Video
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition text-sm"
                >
                  Cancelar
                </button>
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Detener Grabación
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    disabled={!stream || error !== null}
                    className={`px-8 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                      !stream || error !== null
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Circle className="w-4 h-4 fill-current" />
                    Iniciar Grabación
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
