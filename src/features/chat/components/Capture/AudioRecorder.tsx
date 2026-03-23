// src/features/chat/components/Capture/AudioRecorder.tsx
// ✅ CORREGIDO: createPortal + z-[9999] + estilo igual a CameraModal

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Square, Play, RotateCw, Circle } from 'lucide-react';

interface AudioRecorderProps {
  onRecord: (file: File) => void;
  onClose: () => void;
}

export const AudioRecorder = ({ onRecord, onClose }: AudioRecorderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startMicrophone();
    return () => stopMicrophone();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setAudioLevel(Math.random() * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startMicrophone = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      setStream(mediaStream);
    } catch (err) {
      setError('No se pudo acceder al micrófono');
      console.error('Microphone error:', err);
    }
  };

  const stopMicrophone = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = () => {
    if (stream) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        stopMicrophone();
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
      setAudioLevel(0);
    }
  };

  const retake = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    startMicrophone();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const sendAudio = () => {
    if (recordedAudio) {
      fetch(recordedAudio)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
          onRecord(file);
        });
    }
  };

  const handleClose = () => {
    stopMicrophone();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-slate-700 border-b border-slate-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Grabar Audio</h3>
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

        {/* Contenido */}
        <div className="p-6 bg-slate-800">
          {error ? (
            <div className="h-48 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-white font-semibold mb-2">Error de micrófono</p>
                <p className="text-slate-400 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700 rounded-xl p-8 border border-slate-600">
              {/* Visualizer */}
              <div className="flex items-center justify-center gap-1 h-32 mb-4">
                {isRecording ? (
                  Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-pink-600 to-red-600 rounded-full transition-all duration-100"
                      style={{
                        height: `${Math.random() * audioLevel}%`,
                        minHeight: '4px'
                      }}
                    />
                  ))
                ) : recordedAudio ? (
                  <div className="flex items-center justify-center w-full">
                    <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center">
                      <Play className="w-10 h-10 text-slate-300" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center">
                      <Mic className="w-10 h-10 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Timer */}
              {(isRecording || recordedAudio) && (
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">
                    {formatTime(Math.floor(recordingTime / 10))}
                  </span>
                </div>
              )}

              {/* Status */}
              <div className="text-center mt-4">
                {isRecording ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">Grabando...</span>
                  </div>
                ) : recordedAudio ? (
                  <button
                    onClick={playAudio}
                    className="text-white text-sm font-medium hover:text-pink-400 transition"
                  >
                    Reproducir audio
                  </button>
                ) : (
                  <span className="text-slate-400 text-sm">Presiona el botón para grabar</span>
                )}
              </div>
            </div>
          )}

          {/* Hidden audio element */}
          {recordedAudio && (
            <audio
              ref={audioRef}
              src={recordedAudio}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {recordedAudio ? (
              <>
                <button
                  onClick={retake}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition text-sm flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Grabar Otro
                </button>
                <button
                  onClick={sendAudio}
                  className="px-8 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  Enviar Audio
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
                    <Circle className="w-3 h-3 bg-white rounded-full" />
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
