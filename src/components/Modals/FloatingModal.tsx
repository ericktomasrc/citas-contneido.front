import { Rnd } from 'react-rnd';
import { ReactNode } from 'react';

interface FloatingModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const FloatingModal = ({
  open,
  onClose,
  children,
  minWidth = 500,
  minHeight = 400,
  maxWidth = 1200,
  maxHeight = 900,
}: FloatingModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Rnd
        default={{ x: window.innerWidth / 2 - 600 / 2, y: 80, width: 900, height: 600 }}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        bounds="window"
        dragHandleClassName="floating-modal-header"
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
      >
        <div className="floating-modal-header flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 cursor-move select-none">
          <span className="text-white font-bold text-lg">Estudio en Vivo</span>
          <button
            className="bg-black/60 hover:bg-black/90 text-white rounded-full p-2 ml-2"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </Rnd>
    </div>
  );
};
