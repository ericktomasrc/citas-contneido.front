// src/features/chat/components/Settings/QuickSettingsPanel.tsx
// ✅ CORREGIDO: Usa React Portal para overlay en toda la pantalla

import { useState } from 'react';
import { createPortal } from 'react-dom';
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('💾 Configuración guardada:', settings);
    setIsSaving(false);
    onClose();
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-3"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Configuración de Chat</h2>
              <p className="text-[10px] text-slate-400">Controla cómo interactúan contigo</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Permisos de Media */}
          <section>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Image className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
              <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Permisos de Envío</h3>
            </div>
            
            <div className="space-y-2 ml-5">
              <ToggleSwitch
                label="Permitir que envíen fotos"
                description="Los suscriptores podrán enviarte imágenes"
                enabled={settings.subscriberCanSendImages}
                onChange={() => handleToggle('subscriberCanSendImages')}
                icon={<Image className="w-3.5 h-3.5" />}
              />
              
              <ToggleSwitch
                label="Permitir que envíen videos"
                description="Los suscriptores podrán enviarte videos"
                enabled={settings.subscriberCanSendVideos}
                onChange={() => handleToggle('subscriberCanSendVideos')}
                icon={<Video className="w-3.5 h-3.5" />}
              />
              
              <ToggleSwitch
                label="Permitir que envíen audios"
                description="Los suscriptores podrán enviarte notas de voz"
                enabled={settings.subscriberCanSendAudio}
                onChange={() => handleToggle('subscriberCanSendAudio')}
                icon={<Mic className="w-3.5 h-3.5" />}
              />
            </div>
          </section>

          {/* Palabras Bloqueadas */}
          <section>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
              <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Palabras Bloqueadas</h3>
            </div>
            
            <div className="ml-5">
              {settings.blockedWords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {settings.blockedWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium"
                    >
                      {word}
                      <button
                        onClick={() => handleRemoveWord(word)}
                        className="hover:bg-red-100 rounded-full p-0.5 transition"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                  placeholder="Agregar palabra..."
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={handleAddWord}
                  disabled={!newWord.trim()}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg text-xs font-medium transition"
                >
                  Agregar
                </button>
              </div>
              
              <ToggleSwitch
                label="Bloqueo automático"
                description="Los mensajes con palabras bloqueadas se eliminarán"
                enabled={settings.autoBlockEnabled}
                onChange={() => handleToggle('autoBlockEnabled')}
                className="mt-2"
              />
            </div>
          </section>

          {/* Videollamadas */}
          <section>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
              <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Videollamadas</h3>
            </div>
            
            <div className="ml-5 space-y-2">
              <ToggleSwitch
                label="Habilitar videollamadas"
                description="Permite que los suscriptores soliciten videollamadas"
                enabled={settings.videocallsEnabled}
                onChange={() => handleToggle('videocallsEnabled')}
                icon={<Phone className="w-3.5 h-3.5" />}
              />
              
              {settings.videocallsEnabled && (
                <div className="space-y-2 ml-5 pt-1">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500 mb-1 block">
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
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
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
                    <label className="text-[10px] font-medium text-slate-500 mb-1 block">
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
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Propinas */}
          <section>
            <div className="flex items-center gap-1.5 mb-2.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
              <h3 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Propinas</h3>
            </div>
            
            <div className="ml-5 space-y-2">
              <ToggleSwitch
                label="Permitir propinas anónimas"
                description="Los suscriptores pueden enviar propinas sin mostrar su nombre"
                enabled={settings.allowAnonymousTips}
                onChange={() => handleToggle('allowAnonymousTips')}
              />
              
              <div>
                <label className="text-[10px] font-medium text-slate-500 mb-1 block">
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
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 border-t border-slate-100 flex gap-2 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-medium text-xs transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-lg font-medium text-xs transition shadow-sm"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Componente Toggle Switch Compacto
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
    <div className={`flex items-start gap-2 ${className}`}>
      {icon && (
        <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex-1 min-w-0 mr-2">
            <span className={`font-medium text-slate-700 block ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
              {label}
            </span>
            {description && (
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{description}</p>
            )}
          </div>
          
          <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex items-center rounded-full transition flex-shrink-0 ${
              size === 'sm' ? 'h-4 w-7' : 'h-5 w-9'
            } ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <span
              className={`inline-block transform rounded-full bg-white shadow transition ${
                size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
              } ${enabled ? (size === 'sm' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0.5'}`}
            />
          </button>
        </label>
      </div>
    </div>
  );
};
