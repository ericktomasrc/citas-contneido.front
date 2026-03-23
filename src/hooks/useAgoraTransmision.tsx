// src/hooks/useAgoraTransmision.ts
import { useState, useEffect, useRef } from 'react';
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

  // ✅ NUEVO: Ref para prevenir múltiples inicializaciones
  const iniciandoRef = useRef(false);
  const deteniendoRef = useRef(false);

  useEffect(() => {
    client.setClientRole('host');
  }, [client]);

  const iniciarTransmision = async (
    tipoTransmision: string, 
    precioPPV?: number, 
    descripcionPPV?: string
  ) => {
    // ✅ PROTECCIÓN 1: Si ya está en vivo, no hacer nada
    if (enVivo) {
      console.log('⚠️ Ya hay una transmisión activa');
      return;
    }

    // ✅ PROTECCIÓN 2: Si ya está iniciando, no hacer nada
    if (iniciandoRef.current) {
      console.log('⚠️ Ya se está iniciando la transmisión');
      return;
    }

    // ✅ PROTECCIÓN 3: Si está cargando, no hacer nada
    if (cargando) {
      console.log('⚠️ Operación en progreso');
      return;
    }

    iniciandoRef.current = true;

    try {
      setCargando(true);
      setError(null);

      console.log('🎥 Solicitando permisos de cámara y micrófono...');
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      const userId = Math.floor(Math.random() * 10000).toString();
      const newChannelName = `live_${Date.now()}`;
      
      console.log('🔑 Obteniendo token de Agora...');
      const response = await fetch(
        `${BACKEND_URL}/api/agora/token?channelName=${newChannelName}&userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener token del servidor');
      }

      const { token } = await response.json();

      console.log('🚀 Uniéndose al canal:', newChannelName);
      await client.join(APP_ID, newChannelName, token, parseInt(userId));

      console.log('🎬 Creando tracks de audio y video...');
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

      console.log('📺 Reproduciendo video local...');
      videoTrack.play('local-player', { fit: 'contain' });

      console.log('📡 Publicando tracks...');
      await client.publish([audioTrack, videoTrack]);

      setEnVivo(true);
      setChannelName(newChannelName);
      
      console.log('✅ Transmisión iniciada exitosamente');

      // Notificar al backend (no crítico)
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
        console.warn('⚠️ No se pudo notificar al backend:', err);
      }
      
    } catch (error: any) {
      console.error('❌ Error al iniciar transmisión:', error);
      setError(error.message || 'Error desconocido');
      
      // Cleanup en caso de error
      if (localAudioTrack) {
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }
      if (localVideoTrack) {
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }
      
      try {
        await client.leave();
      } catch (e) {
        console.error('Error al salir del canal:', e);
      }
    } finally {
      setCargando(false);
      iniciandoRef.current = false;
    }
  };

  const detenerTransmision = async () => {
    // ✅ PROTECCIÓN: Si ya está deteniendo, no hacer nada
    if (deteniendoRef.current) {
      console.log('⚠️ Ya se está deteniendo la transmisión');
      return;
    }

    // Si no está en vivo, no hay nada que detener
    if (!enVivo) {
      console.log('⚠️ No hay transmisión activa para detener');
      return;
    }

    deteniendoRef.current = true;

    try {
      setCargando(true);
      
      console.log('🛑 Deteniendo transmisión...');

      // Notificar al backend
      if (channelName) {
        try {
          await fetch(`${BACKEND_URL}/api/canal/finalizar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelName })
          });
        } catch (err) {
          console.warn('⚠️ No se pudo notificar cierre al backend:', err);
        }
      }
      
      // Cerrar tracks locales
      if (localAudioTrack) {
        console.log('🎤 Cerrando audio...');
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        console.log('🎥 Cerrando video...');
        localVideoTrack.close();
      }

      // Salir del canal
      console.log('🚪 Saliendo del canal...');
      await client.leave();

      // Limpiar estados
      setEnVivo(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setChannelName('');
      setError(null);
      setMicMuted(false);
      setCameraOff(false);
      
      console.log('✅ Transmisión detenida exitosamente');
      
    } catch (error: any) {
      console.error('❌ Error al detener transmisión:', error);
      
      // Intentar limpiar de todas formas
      setEnVivo(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setChannelName('');
    } finally {
      setCargando(false);
      deteniendoRef.current = false;
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

  // ✅ NUEVO: Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      console.log('🧹 Limpiando hook al desmontar...');
      if (enVivo) {
        detenerTransmision();
      }
    };
  }, [enVivo]);

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
