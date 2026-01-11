// src/features/chat/components/Capture/AudioRecorder.tsx
// ✅ Grabar audio EN VIVO

import { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onRecord: (file: File) => void;
  onClose: () => void;
}

export const AudioRecorder = ({ onRecord, onClose }: AudioRecorderProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
    } catch (err) {
      setError('No se pudo acceder al micrófono');
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const sendAudio = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
      onRecord(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Grabar Audio</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Visualizer */}
              <div className="flex items-center justify-center mb-6">
                {isRecording ? (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-600 rounded-full animate-pulse"
                        style={{
                          height: `${20 + Math.random() * 40}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : recordedBlob ? (
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Mic className="w-10 h-10 text-violet-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <Mic className="w-10 h-10 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="text-center mb-6">
                <p className="text-3xl font-mono font-bold text-slate-800">
                  {formatTime(recordingTime)}
                </p>
              </div>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Controls */}
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
                      Detener
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Grabar
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={togglePlayPause}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Reproducir
                      </>
                    )}
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRecordedBlob(null);
                        setRecordingTime(0);
                      }}
                      className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-sm transition"
                    >
                      Grabar Otro
                    </button>
                    <button
                      onClick={sendAudio}
                      className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition shadow-md"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
