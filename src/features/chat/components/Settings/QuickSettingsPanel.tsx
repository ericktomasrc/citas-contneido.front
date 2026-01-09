// src/features/chat/components/Settings/QuickSettingsPanel.tsx

import { useState } from 'react';
import { Settings, Shield, Image, Video, Mic, Phone, DollarSign, X } from 'lucide-react';
import { ChatSettings, defaultChatSettings } from '../../types/chat.types';

interface QuickSettingsPanelProps {
  onClose: () => void;
}

export const QuickSettingsPanel = ({ onClose }: QuickSettingsPanelProps) => {
  const [settings, setSettings] = useState<ChatSettings>(defaultChatSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [newWord, setNewWord] = useState('');

  const handleToggle = (key: keyof ChatSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddWord = () => {
    if (newWord.trim()) {
      setSettings(prev => ({
        ...prev,
        blockedWords: [...prev.blockedWords, newWord.trim().toLowerCase()],
      }));
      setNewWord('');
    }
  };

  const handleRemoveWord = (word: string) => {
    setSettings(prev => ({
      ...prev,
      blockedWords: prev.blockedWords.filter(w => w !== word),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Guardar en backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('💾 Configuración guardada:', settings);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-pink-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Configuración de Chat</h2>
              <p className="text-xs text-slate-500">Controla cómo interactúan contigo</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Permisos de Media */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-700 text-sm">Permisos de Envío</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <ToggleSwitch
                label="Permitir que envíen fotos"
                description="Los suscriptores podrán enviarte imágenes"
                enabled={settings.subscriberCanSendImages}
                onChange={() => handleToggle('subscriberCanSendImages')}
                icon={<Image className="w-4 h-4" />}
              />
              
              <ToggleSwitch
                label="Permitir que envíen videos"
                description="Los suscriptores podrán enviarte videos"
                enabled={settings.subscriberCanSendVideos}
                onChange={() => handleToggle('subscriberCanSendVideos')}
                icon={<Video className="w-4 h-4" />}
              />
              
              <ToggleSwitch
                label="Permitir que envíen audios"
                description="Los suscriptores podrán enviarte notas de voz"
                enabled={settings.subscriberCanSendAudio}
                onChange={() => handleToggle('subscriberCanSendAudio')}
                icon={<Mic className="w-4 h-4" />}
              />
            </div>
          </section>

          {/* Palabras Bloqueadas */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-700 text-sm">Palabras Bloqueadas</h3>
            </div>
            
            <div className="pl-6">
              {/* Tags de palabras */}
              {settings.blockedWords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {settings.blockedWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium"
                    >
                      {word}
                      <button
                        onClick={() => handleRemoveWord(word)}
                        className="hover:bg-red-100 rounded-full p-0.5 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Input para agregar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                  placeholder="Agregar palabra..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={handleAddWord}
                  disabled={!newWord.trim()}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition"
                >
                  Agregar
                </button>
              </div>
              
              <ToggleSwitch
                label="Bloqueo automático"
                description="Los mensajes con palabras bloqueadas se eliminarán automáticamente"
                enabled={settings.autoBlockEnabled}
                onChange={() => handleToggle('autoBlockEnabled')}
                className="mt-3"
              />
            </div>
          </section>

          {/* Videollamadas */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-700 text-sm">Videollamadas</h3>
            </div>
            
            <div className="pl-6 space-y-4">
              <ToggleSwitch
                label="Habilitar videollamadas"
                description="Permite que los suscriptores soliciten videollamadas"
                enabled={settings.videocallsEnabled}
                onChange={() => handleToggle('videocallsEnabled')}
                icon={<Phone className="w-4 h-4" />}
              />
              
              {settings.videocallsEnabled && (
                <div className="space-y-4 pl-6">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">
                      Precio por minuto (S/.)
                    </label>
                    <input
                      type="number"
                      value={settings.videocallPrice}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        videocallPrice: Number(e.target.value)
                      }))}
                      min="1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <ToggleSwitch
                      label="Permitir audio"
                      enabled={settings.videocallSettings.audioEnabled}
                      onChange={() => setSettings(prev => ({
                        ...prev,
                        videocallSettings: {
                          ...prev.videocallSettings,
                          audioEnabled: !prev.videocallSettings.audioEnabled
                        }
                      }))}
                      size="sm"
                    />
                    
                    <ToggleSwitch
                      label="Permitir video"
                      enabled={settings.videocallSettings.videoEnabled}
                      onChange={() => setSettings(prev => ({
                        ...prev,
                        videocallSettings: {
                          ...prev.videocallSettings,
                          videoEnabled: !prev.videocallSettings.videoEnabled
                        }
                      }))}
                      size="sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">
                      Duración máxima (minutos)
                    </label>
                    <input
                      type="number"
                      value={settings.videocallSettings.maxDuration}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        videocallSettings: {
                          ...prev.videocallSettings,
                          maxDuration: Number(e.target.value)
                        }
                      }))}
                      min="5"
                      max="60"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Propinas */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-700 text-sm">Propinas</h3>
            </div>
            
            <div className="pl-6 space-y-3">
              <ToggleSwitch
                label="Permitir propinas anónimas"
                description="Los suscriptores pueden enviar propinas sin mostrar su nombre"
                enabled={settings.allowAnonymousTips}
                onChange={() => handleToggle('allowAnonymousTips')}
              />
              
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">
                  Monto mínimo de propina (S/.)
                </label>
                <input
                  type="number"
                  value={settings.minTipAmount}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    minTipAmount: Number(e.target.value)
                  }))}
                  min="1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl font-semibold text-sm transition shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Toggle Switch Reutilizable
interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
  description?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const ToggleSwitch = ({ 
  label, 
  enabled, 
  onChange, 
  icon, 
  description,
  size = 'md',
  className = ''
}: ToggleSwitchProps) => {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {icon && (
        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex-1 min-w-0 mr-3">
            <span className={`font-medium text-slate-700 block ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
              {label}
            </span>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          
          <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex items-center rounded-full transition flex-shrink-0 ${
              size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
            } ${enabled ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block transform rounded-full bg-white transition ${
                size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
              } ${enabled ? (size === 'sm' ? 'translate-x-5' : 'translate-x-6') : 'translate-x-1'}`}
            />
          </button>
        </label>
      </div>
    </div>
  );
};
