// src/contexts/TransmisionContext.tsx - ARCHIVO MODIFICADO
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface TransmisionContextType {
  enTransmision: boolean;
  channelName: string | null;
  tipoTransmision: 'gratis' | 'suscriptores' | 'ppv' | null;
  precioPPV: number;
  descripcionPPV: string;
  iniciarTransmisionExterna: (tipo: 'gratis' | 'suscriptores' | 'ppv', precio?: number, descripcion?: string) => void;
  detenerTransmisionExterna: () => Promise<void>;
}

const TransmisionContext = createContext<TransmisionContextType | undefined>(undefined);

export const TransmisionProvider = ({ children }: { children: ReactNode }) => {
  const [enTransmision, setEnTransmision] = useState(false);
  const [channelName, setChannelName] = useState<string | null>(null);
  const [tipoTransmision, setTipoTransmision] = useState<'gratis' | 'suscriptores' | 'ppv' | null>(null);
  const [precioPPV, setPrecioPPV] = useState(0);
  const [descripcionPPV, setDescripcionPPV] = useState('');
  
  const ventanaRef = useRef<Window | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Inicializar BroadcastChannel
  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel('transmision-sync');
    
    const handleMessage = (event: MessageEvent) => {
      const { type, channelName: cn, tipoTransmision: tipo, precioPPV: precio, descripcionPPV: desc } = event.data;
      
      if (type === 'transmision-started') {
        setEnTransmision(true);
        setChannelName(cn);
        setTipoTransmision(tipo);
        setPrecioPPV(precio || 0);
        setDescripcionPPV(desc || '');
        
        // Guardar en localStorage
        localStorage.setItem('transmision-activa', JSON.stringify({
          activa: true,
          channelName: cn,
          tipo,
          precio,
          descripcion: desc,
          timestamp: Date.now()
        }));
      } else if (type === 'transmision-stopped') {
        setEnTransmision(false);
        setChannelName(null);
        setTipoTransmision(null);
        setPrecioPPV(0);
        setDescripcionPPV('');
        localStorage.removeItem('transmision-activa');
        ventanaRef.current = null;
      } else if (type === 'heartbeat') {
        // Actualizar timestamp
        const data = localStorage.getItem('transmision-activa');
        if (data) {
          const parsed = JSON.parse(data);
          parsed.timestamp = Date.now();
          localStorage.setItem('transmision-activa', JSON.stringify(parsed));
        }
      }
    };

    broadcastChannelRef.current.addEventListener('message', handleMessage);

    // Verificar si hay transmisión activa al cargar
    const transmisionGuardada = localStorage.getItem('transmision-activa');
    if (transmisionGuardada) {
      try {
        const data = JSON.parse(transmisionGuardada);
        const tiempoTranscurrido = Date.now() - data.timestamp;
        
        // Si pasaron menos de 30 segundos, considerar que la transmisión está activa
        if (tiempoTranscurrido < 30000) {
          setEnTransmision(true);
          setChannelName(data.channelName);
          setTipoTransmision(data.tipo);
          setPrecioPPV(data.precio || 0);
          setDescripcionPPV(data.descripcion || '');
        } else {
          // Limpiar si pasó mucho tiempo
          localStorage.removeItem('transmision-activa');
        }
      } catch (error) {
        console.error('Error al parsear transmision guardada:', error);
        localStorage.removeItem('transmision-activa');
      }
    }

    return () => {
      broadcastChannelRef.current?.removeEventListener('message', handleMessage);
      broadcastChannelRef.current?.close();
    };
  }, []);

  const iniciarTransmisionExterna = (
    tipo: 'gratis' | 'suscriptores' | 'ppv',
    precio: number = 0,
    descripcion: string = ''
  ) => {
    // Construir URL con parámetros
    const params = new URLSearchParams({
      tipo,
      precio: precio.toString(),
      descripcion
    });

    // Configuración de la ventana
    const width = 1200;
    const height = 750;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`;

    // Abrir ventana
    const nuevaVentana = window.open(
      `/transmision-live?${params.toString()}`,
      'transmision_live',
      features
    );

    if (!nuevaVentana) {
      alert('⚠️ Por favor, permite las ventanas emergentes para iniciar la transmisión.');
      return;
    }

    ventanaRef.current = nuevaVentana;

    // Marcar como en transmisión inmediatamente
    setEnTransmision(true);
    setTipoTransmision(tipo);
    setPrecioPPV(precio);
    setDescripcionPPV(descripcion);

    // Verificar periódicamente si la ventana se cerró
    const checkInterval = setInterval(() => {
      if (ventanaRef.current?.closed) {
        clearInterval(checkInterval);
        setEnTransmision(false);
        setChannelName(null);
        setTipoTransmision(null);
        setPrecioPPV(0);
        setDescripcionPPV('');
        localStorage.removeItem('transmision-activa');
        ventanaRef.current = null;
      }
    }, 1000);
  };

  const detenerTransmisionExterna = async () => {
    // Enviar señal a la ventana para que se cierre
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'stop-transmision' });
    }

    // Cerrar ventana si está abierta
    if (ventanaRef.current && !ventanaRef.current.closed) {
      ventanaRef.current.close();
    }

    // Limpiar estado
    setEnTransmision(false);
    setChannelName(null);
    setTipoTransmision(null);
    setPrecioPPV(0);
    setDescripcionPPV('');
    localStorage.removeItem('transmision-activa');
    ventanaRef.current = null;
  };

  return (
    <TransmisionContext.Provider
      value={{
        enTransmision,
        channelName,
        tipoTransmision,
        precioPPV,
        descripcionPPV,
        iniciarTransmisionExterna,
        detenerTransmisionExterna
      }}
    >
      {children}
    </TransmisionContext.Provider>
  );
};

export const useTransmision = () => {
  const context = useContext(TransmisionContext);
  if (context === undefined) {
    throw new Error('useTransmision must be used within a TransmisionProvider');
  }
  return context;
};
