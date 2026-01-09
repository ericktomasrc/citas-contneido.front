// src/features/chat/components/Settings/IndividualSettingsPanel.tsx
// ✅ CONFIGURACIÓN INDIVIDUAL POR ESPECTADOR (SOLO CREADORA)

import { useState } from 'react';
import { X, Image, Video, Mic, Phone, Gift, DollarSign, Shield } from 'lucide-react';
import { ChatConfig } from '../../types/chat.types';
import { User } from '../../types/user.types';

interface IndividualSettingsPanelProps {
  user: User;
  currentConfig: ChatConfig;
  onSave: (config: ChatConfig) => void;
  onClose: () => void;
}

export const IndividualSettingsPanel = ({
  user,
  currentConfig,
  onSave,
  onClose,
}: IndividualSettingsPanelProps) => {
  const [config, setConfig] = useState<ChatConfig>(currentConfig);

  const handleTogglePermission = (key: keyof ChatConfig['permissions']) => {
    setConfig(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-300">
              <img src={user.avatar} alt={user.nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Configuración de Chat</h3>
              <p className="text-xs text-slate-600">{user.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-violet-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Permisos de Envío */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-600" />
              Permisos de Envío
            </h4>

            <div className="space-y-2">
              {/* Fotos */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Image className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir fotos</p>
                    <p className="text-xs text-slate-500">Puede enviar imágenes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canSendPhotos}
                  onChange={() => handleTogglePermission('canSendPhotos')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>

              {/* Videos */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir videos</p>
                    <p className="text-xs text-slate-500">Puede enviar videos</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canSendVideos}
                  onChange={() => handleTogglePermission('canSendVideos')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>

              {/* Audios */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir audios</p>
                    <p className="text-xs text-slate-500">Puede enviar notas de voz</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canSendAudios}
                  onChange={() => handleTogglePermission('canSendAudios')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>

              {/* Regalos */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir regalos</p>
                    <p className="text-xs text-slate-500">Puede enviar regalos virtuales</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canSendGifts}
                  onChange={() => handleTogglePermission('canSendGifts')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>

              {/* Propinas */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir propinas</p>
                    <p className="text-xs text-slate-500">Puede enviar dinero</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canSendTips}
                  onChange={() => handleTogglePermission('canSendTips')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>

              {/* Videollamadas */}
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Permitir videollamadas</p>
                    <p className="text-xs text-slate-500">Puede solicitar videollamadas</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.permissions.canRequestVideocall}
                  onChange={() => handleTogglePermission('canRequestVideocall')}
                  className="w-5 h-5 text-violet-600 rounded focus:ring-2 focus:ring-violet-400"
                />
              </label>
            </div>
          </div>

          {/* Palabras Bloqueadas */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Palabras Bloqueadas</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Agregar palabra..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition">
                Agregar
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Los mensajes con estas palabras serán bloqueados automáticamente
            </p>
          </div>

          {/* Monto mínimo de propina */}
          {config.permissions.canSendTips && (
            <div>
              <label className="text-sm font-bold text-slate-900 block mb-2">
                Monto mínimo de propina (S/.)
              </label>
              <input
                type="number"
                value={config.minimumTipAmount}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  minimumTipAmount: parseInt(e.target.value) || 5,
                }))}
                min="1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition text-sm shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
