import { useState, useRef, useEffect } from 'react';
import { Camera, X, CheckCircle } from 'lucide-react';

interface LiveCameraCaptureProps {
  onCapture: (photoBlob: Blob) => void;
  onClose: () => void;
}

type Instruction = 'center' | 'closer' | 'farther' | 'hold' | 'done';

const INSTRUCTIONS = {
  center: 'Céntrate en el círculo',
  closer: 'Acércate un poco más',
  farther: 'Aléjate un poco',
  hold: 'Perfecto, no te muevas',
  done: '¡Listo! Foto capturada'
};

export const LiveCameraCapture = ({ onCapture, onClose }: LiveCameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentInstruction, setCurrentInstruction] = useState<Instruction>('center');
  const [step, setStep] = useState(0);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (stream && step < 4) {
      const timer = setTimeout(() => {
        const instructions: Instruction[] = ['center', 'closer', 'farther', 'hold'];
        setCurrentInstruction(instructions[step]);
        setStep(step + 1);
        
        // Capturar foto en el último paso
        if (step === 3) {
          setTimeout(() => {
            capturePhoto();
          }, 1500);
        }
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [stream, step]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      alert('No se pudo acceder a la cámara. Por favor, permite el acceso.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCurrentInstruction('done');
          setTimeout(() => {
            onCapture(blob);
            stopCamera();
            onClose();
          }, 1000);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-2xl max-h-screen p-4">
        {/* Botón cerrar */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-6 right-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Video */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-[70vh] rounded-lg"
          />
          
          {/* Overlay circular para guiar al usuario */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-4 border-white rounded-full opacity-50"></div>
          </div>

          {/* Instrucción */}
          <div className="mt-6 bg-white px-6 py-4 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              {currentInstruction === 'done' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Camera className="w-6 h-6 text-primary-600 animate-pulse" />
              )}
              <p className="text-lg font-semibold text-gray-900">
                {INSTRUCTIONS[currentInstruction]}
              </p>
            </div>
          </div>
        </div>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};