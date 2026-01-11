// src/features/chat/components/Capture/VideoRecorder.tsx
// ✅ Grabar video EN VIVO

import { useState, useRef, useEffect } from 'react';
import { X, Video, Square, Play } from 'lucide-react';

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
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

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
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
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
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(blob);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
    }
  };

  const sendVideo = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `video_${Date.now()}.webm`, { type: 'video/webm' });
      onRecord(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Grabar Video</h3>
            {isRecording && (
              <p className="text-sm text-red-600 font-mono">{formatTime(recordingTime)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Video */}
        <div className="relative bg-black aspect-video">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={!recordedBlob}
              controls={!!recordedBlob}
              className="w-full h-full object-cover"
            />
          )}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">REC</span>
            </div>
          )}
        </div>

        {/* Controls */}
        {!error && (
          <div className="p-4 bg-slate-50">
            {!recordedBlob ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5" />
                    Detener Grabación
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Iniciar Grabación
                  </>
                )}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setRecordedBlob(null);
                    startCamera();
                  }}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-4 h-4" />
                  Grabar Otro
                </button>
                <button
                  onClick={sendVideo}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
                >
                  Enviar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
