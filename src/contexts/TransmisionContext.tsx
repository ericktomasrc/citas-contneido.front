// src/contexts/TransmisionContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface TransmisionContextType {
  isTransmisionActive: boolean;
  windowState: 'normal' | 'minimized' | 'maximized';
  tipoTransmision: 'gratis' | 'suscriptores' | 'ppv';
  precioPPV: number;
  descripcionPPV: string;
  startTransmision: (tipo: 'gratis' | 'suscriptores' | 'ppv', precio?: number, descripcion?: string) => void;
  closeTransmision: () => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  restoreWindow: () => void;
}

const TransmisionContext = createContext<TransmisionContextType | undefined>(undefined);

export const TransmisionProvider = ({ children }: { children: ReactNode }) => {
  const [isTransmisionActive, setIsTransmisionActive] = useState(false);
  const [windowState, setWindowState] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [tipoTransmision, setTipoTransmision] = useState<'gratis' | 'suscriptores' | 'ppv'>('gratis');
  const [precioPPV, setPrecioPPV] = useState(0);
  const [descripcionPPV, setDescripcionPPV] = useState('');

  const startTransmision = (tipo: 'gratis' | 'suscriptores' | 'ppv', precio = 0, descripcion = '') => {
    setTipoTransmision(tipo);
    setPrecioPPV(precio);
    setDescripcionPPV(descripcion);
    setIsTransmisionActive(true);
    setWindowState('normal');
  };

  const closeTransmision = () => {
    setIsTransmisionActive(false);
    setWindowState('normal');
    setTipoTransmision('gratis');
    setPrecioPPV(0);
    setDescripcionPPV('');
  };

  const minimizeWindow = () => {
    setWindowState('minimized');
  };

  const maximizeWindow = () => {
    setWindowState('maximized');
  };

  const restoreWindow = () => {
    setWindowState('normal');
  };

  return (
    <TransmisionContext.Provider
      value={{
        isTransmisionActive,
        windowState,
        tipoTransmision,
        precioPPV,
        descripcionPPV,
        startTransmision,
        closeTransmision,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
      }}
    >
      {children}
    </TransmisionContext.Provider>
  );
};

export const useTransmision = () => {
  const context = useContext(TransmisionContext);
  if (!context) {
    throw new Error('useTransmision debe usarse dentro de TransmisionProvider');
  }
  return context;
};