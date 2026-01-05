// src/components/Transmision/ChatConfigModal.tsx
import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ChatConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
  onUpdateConfig: (config: any) => void;
}

export const ChatConfigModal = ({ isOpen, onClose, config, onUpdateConfig }: ChatConfigModalProps) => {
  const [nuevaPalabra, setNuevaPalabra] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Configuración del Chat</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-200 transition flex items-center justify-center">
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
          {/* Quién puede chatear */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Quién puede chatear</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-violet-300 transition">
                <span className="text-sm text-slate-700">Público</span>
                <input
                  type="checkbox"
                  checked={config.publicoPuedeChatear}
                  onChange={(e) => onUpdateConfig({ ...config, publicoPuedeChatear: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-violet-300 transition">
                <span className="text-sm text-slate-700">Suscriptores</span>
                <input
                  type="checkbox"
                  checked={config.suscriptoresPuedeChatear}
                  onChange={(e) => onUpdateConfig({ ...config, suscriptoresPuedeChatear: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                />
              </label>
            </div>
          </div>

          {/* Tipo de mensajes */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Tipo de mensajes</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-violet-300 transition">
                <span className="text-sm text-slate-700">Solo emoticones</span>
                <input
                  type="checkbox"
                  checked={config.soloEmoticonos}
                  onChange={(e) => onUpdateConfig({ ...config, soloEmoticonos: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-violet-300 transition">
                <span className="text-sm text-slate-700">Solo mensajes</span>
                <input
                  type="checkbox"
                  checked={config.soloMensajes}
                  onChange={(e) => onUpdateConfig({ ...config, soloMensajes: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-2 focus:ring-violet-500"
                />
              </label>
            </div>
          </div>

          {/* Palabras restringidas */}
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Palabras restringidas1</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={nuevaPalabra}
                onChange={(e) => setNuevaPalabra(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && nuevaPalabra.trim()) {
                    onUpdateConfig({
                      ...config,
                      palabrasRestringidas: [...config.palabrasRestringidas, nuevaPalabra]
                    });
                    setNuevaPalabra('');
                  }
                }}
                placeholder="Agregar palabra..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={() => {
                  if (nuevaPalabra.trim()) {
                    onUpdateConfig({
                      ...config,
                      palabrasRestringidas: [...config.palabrasRestringidas, nuevaPalabra]
                    });
                    setNuevaPalabra('');
                  }
                }}
                className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {config.palabrasRestringidas.length > 0 ? (
              <div className="space-y-1.5">
                {config.palabrasRestringidas.map((palabra: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-sm text-slate-700">{palabra}</span>
                    <button
                      onClick={() => onUpdateConfig({
                        ...config,
                        palabrasRestringidas: config.palabrasRestringidas.filter((_: any, i: number) => i !== index)
                      })}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No hay palabras restringidas
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};