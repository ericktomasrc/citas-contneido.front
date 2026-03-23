// src/components/DashboardCreadora/Tabs/Contenido/CameraModal.tsx
// ✅ CORREGIDO: z-[9999] para estar DEFINITIVAMENTE sobre TODO

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, Video, Circle, Square, RotateCw } from 'lucide-react';

interface CameraModalProps {
  tipo: 'foto' | 'video';
  isOpen: boolean;
  onClose: () => void;
  onCapture: (blob: Blob, tipo: 'foto' | 'video') => void;
}

export const CameraModal = ({ tipo, isOpen, onClose, onCapture }: CameraModalProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: tipo === 'video',
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCaptureFoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob, 'foto');
          handleClose();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleStartRecording = () => {
    if (!stream) return;

    setRecordedChunks([]);

    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);
    
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      onCapture(blob, 'video');
      handleClose();
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleClose = () => {
    stopCamera();
    setRecordedChunks([]);
    setIsRecording(false);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    // ✅ CRÍTICO: z-[9999] garantiza estar sobre ABSOLUTAMENTE TODO
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-700 border-b border-slate-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
              {tipo === 'foto' ? <Camera className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {tipo === 'foto' ? 'Tomar Foto' : 'Grabar Video'}
              </h3>
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
                muted
                className="w-full h-full object-contain"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  REC
                </div>
              )}

              {/* Botón de cambiar cámara */}
              <button
                onClick={handleToggleCamera}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                title="Cambiar cámara"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Canvas oculto para captura de foto */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer - Botones de Acción */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex-shrink-0">
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition text-sm"
            >
              Cancelar
            </button>
            
            {tipo === 'foto' ? (
              <button
                onClick={handleCaptureFoto}
                disabled={!stream || error !== null}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                  !stream || error !== null
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700 text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                Capturar Foto
              </button>
            ) : (
              <>
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    disabled={!stream || error !== null}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                      !stream || error !== null
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Circle className="w-4 h-4 fill-current" />
                    Iniciar Grabación
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Detener Grabación
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
