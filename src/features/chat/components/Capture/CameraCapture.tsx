// src/features/chat/components/Capture/CameraCapture.tsx
// ✅ CORREGIDO: createPortal + z-[9999] + estilo igual a CameraModal

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, RotateCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const sendPhoto = () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const modalContent = (
    // ✅ z-[9999] garantiza estar sobre TODO
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-700 border-b border-slate-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Tomar Foto</h3>
              <p className="text-xs text-slate-400">Captura tu contenido</p>
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
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Botón de cambiar cámara */}
              {!capturedImage && (
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

        {/* Canvas oculto para captura de foto */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer - Botones de Acción */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex-shrink-0">
          <div className="flex gap-3 justify-center">
            {capturedImage ? (
              <>
                <button
                  onClick={retake}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Repetir
                </button>
                <button
                  onClick={sendPhoto}
                  className="px-8 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Enviar Foto
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
                <button
                  onClick={capturePhoto}
                  disabled={!stream || error !== null}
                  className={`px-8 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    !stream || error !== null
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Capturar Foto
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
