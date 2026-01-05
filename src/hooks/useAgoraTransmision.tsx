// src/hooks/useAgoraTransmision.ts
import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const useAgoraTransmision = () => {
  const [client] = useState<IAgoraRTCClient>(() => 
    AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
  );
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [channelName, setChannelName] = useState<string>('');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enVivo, setEnVivo] = useState(false);

  useEffect(() => {
    client.setClientRole('host');
  }, [client]);

  // ✅ CAMBIO: Sintaxis correcta de función async
  const iniciarTransmision = async (
    tipoTransmision: string, 
    precioPPV?: number, 
    descripcionPPV?: string
  ) => {
    try {
      setCargando(true);
      setError(null);

      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const userId = Math.floor(Math.random() * 10000).toString();
      const newChannelName = `live_${Date.now()}`;
      
      const response = await fetch(
        `${BACKEND_URL}/api/agora/token?channelName=${newChannelName}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener token del servidor');
      }

      const { token } = await response.json();

      await client.join(APP_ID, newChannelName, token, parseInt(userId));

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128,
          }
        },
        {
          encoderConfig: {
            width: 1920,
            height: 1080,
            frameRate: 30,
            bitrateMin: 1500,
            bitrateMax: 3000,
          }
        }
      );

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      videoTrack.play('local-player', { fit: 'contain' });

      await client.publish([audioTrack, videoTrack]);

      setEnVivo(true);
      setChannelName(newChannelName);
      
      try {
        await fetch(`${BACKEND_URL}/api/canal/iniciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            channelName: newChannelName,
            tipoTransmision,
            precioPPV,
            descripcionPPV
          })
        });
      } catch (err) {
        console.warn('No se pudo notificar al backend:', err);
      }
      
    } catch (error: any) {
      console.error('Error al iniciar transmisión:', error);
      setError(error.message || 'Error desconocido');
      
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      
      try {
        await client.leave();
      } catch (e) {
        console.error('Error al salir del canal:', e);
      }
    } finally {
      setCargando(false);
    }
  };

  const detenerTransmision = async () => {
    try {
      setCargando(true);
      
      if (channelName) {
        try {
          await fetch(`${BACKEND_URL}/api/canal/finalizar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelName })
          });
        } catch (err) {
          console.warn('No se pudo notificar cierre al backend:', err);
        }
      }
      
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();

      await client.leave();

      setEnVivo(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setChannelName('');
      setError(null);
      
    } catch (error) {
      console.error('Error al detener transmisión:', error);
    } finally {
      setCargando(false);
    }
  };

  const toggleMic = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!micMuted);
      setMicMuted(!micMuted);
    }
  };

  const toggleCamera = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!cameraOff);
      setCameraOff(!cameraOff);
    }
  };

  return {
    enVivo,
    cargando,
    error,
    channelName,
    micMuted,
    cameraOff,
    iniciarTransmision,
    detenerTransmision,
    toggleMic,
    toggleCamera
  };
};