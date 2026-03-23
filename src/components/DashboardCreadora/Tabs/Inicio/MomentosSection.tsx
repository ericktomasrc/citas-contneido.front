import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Camera, X, Upload, Video as VideoIcon, Globe, Crown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface MomentosSectionProps {
  className?: string;
  compact?: boolean;
}

export const MomentosSection = ({ className = '', compact = false }: MomentosSectionProps) => {
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [momentoFile, setMomentoFile] = useState<File | null>(null);
  const [momentoVisibilidad, setMomentoVisibilidad] = useState<'publico' | 'suscriptores'>('publico');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMomentoFile(files[0]);
      setShowConfigModal(true);
      setShowCrearModal(false);
    }
  };

  const handlePublicar = () => {
    if (!momentoFile) return;
    alert('✨ Momento creado!');
    setShowConfigModal(false);
    setMomentoFile(null);
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
      <div className={`bg-white rounded-xl shadow-sm border border-rose-100 ${compact ? 'p-3' : 'p-3'} h-full ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm`}>
              <Sparkles className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`} />
            </div>
            <h3 className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-semibold text-gray-800`}>Momentos</h3>
          </div>
          <span className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-gray-400`}>24h</span>
        </div>

        <div className="relative group">
          <button
            onClick={() => {
              const container = document.getElementById('momentos-scroll');
              if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 border border-rose-200"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            id="momentos-scroll"
            className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>

            <button onClick={() => setShowCrearModal(true)} className="flex-shrink-0">
              <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-dashed border-rose-200 flex items-center justify-center hover:border-rose-300 hover:from-rose-100 hover:to-pink-100 transition-all shadow-sm`}>
                <Camera className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-rose-400`} />
              </div>
              <p className={`${compact ? 'text-[7px]' : 'text-[8px]'} text-center mt-1 text-gray-500 font-medium`}>Crear</p>
            </button>

            {[41, 43, 45, 47, 49, 51].map((img, i) => (
              <button key={`p-${i}`} className="flex-shrink-0">
                <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl border-2 border-emerald-300 p-[1px] bg-white shadow-sm hover:shadow-md transition-all`}>
                  <div className="w-full h-full rounded-[9px] overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?img=${img}`} className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="flex justify-center -mt-1.5">
                  <span className={`px-1.5 py-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 ${compact ? 'text-[6px]' : 'text-[7px]'} text-white font-bold rounded-full shadow-sm`}>{22 - i * 3}h</span>
                </div>
              </button>
            ))}

            {[42, 44, 46, 48, 50].map((img, i) => (
              <button key={`s-${i}`} className="flex-shrink-0">
                <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-rose-300 via-pink-300 to-violet-300 p-[2px] shadow-sm hover:shadow-md transition-all`}>
                  <div className="w-full h-full rounded-[10px] overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?img=${img}`} className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
                <div className="flex justify-center -mt-1.5">
                  <span className={`px-1.5 py-0.5 bg-gradient-to-r from-rose-400 to-pink-500 ${compact ? 'text-[6px]' : 'text-[7px]'} text-white font-bold rounded-full shadow-sm`}>{21 - i * 3}h</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const container = document.getElementById('momentos-scroll');
              if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 border border-rose-200"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Crear - Fondo ORIGINAL, solo header/body VIP */}
      {showCrearModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => setShowCrearModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Crear Momento</h3>
                  <p className="text-[10px] text-gray-500">Durará 24 horas</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCrearModal(false)} 
                className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3.5 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 hover:border-rose-300 text-left flex items-center gap-3 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                  <Upload className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800">Subir desde Galería</p>
                  <p className="text-[9px] text-rose-600">Foto o video (24h)</p>
                </div>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Configurar - Fondo ORIGINAL, solo header/body/footer VIP */}
      {showConfigModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => { setShowConfigModal(false); setMomentoFile(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Configurar Momento</h3>
                  <p className="text-[10px] text-gray-500">Elige la audiencia</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowConfigModal(false); setMomentoFile(null); }} 
                className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {momentoFile && (
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-rose-50 border border-rose-200 shadow-sm">
                  {momentoFile.type.startsWith('video/') ?
                    <video src={URL.createObjectURL(momentoFile)} className="w-full h-full object-cover" controls /> :
                    <img src={URL.createObjectURL(momentoFile)} alt="" className="w-full h-full object-cover" />
                  }
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => setMomentoVisibilidad('publico')}
                  className={'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all border-2 ' +
                    (momentoVisibilidad === 'publico'
                      ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30')}
                >
                  <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' +
                    (momentoVisibilidad === 'publico' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300')}>
                    {momentoVisibilidad === 'publico' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' +
                    (momentoVisibilidad === 'publico' ? 'bg-emerald-100' : 'bg-gray-50')}>
                    <Globe className={'w-4.5 h-4.5 ' + (momentoVisibilidad === 'publico' ? 'text-emerald-600' : 'text-gray-400')} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-gray-800">Público</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">Todos pueden verlo</p>
                  </div>
                </button>

                <button
                  onClick={() => setMomentoVisibilidad('suscriptores')}
                  className={'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all border-2 ' +
                    (momentoVisibilidad === 'suscriptores'
                      ? 'bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 border-rose-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-rose-200 hover:bg-rose-50/30')}
                >
                  <div className={'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ' +
                    (momentoVisibilidad === 'suscriptores' ? 'border-rose-500 bg-rose-500' : 'border-gray-300')}>
                    {momentoVisibilidad === 'suscriptores' && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' +
                    (momentoVisibilidad === 'suscriptores' ? 'bg-gradient-to-br from-rose-100 to-pink-100' : 'bg-gray-50')}>
                    <Crown className={'w-4.5 h-4.5 ' + (momentoVisibilidad === 'suscriptores' ? 'text-rose-600' : 'text-gray-400')} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-gray-800">Solo Suscriptores</p>
                    <p className="text-[9px] text-rose-600 mt-0.5">Contenido exclusivo VIP</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="px-4 py-3.5 border-t border-rose-100 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-violet-50/30 flex gap-2.5">
              <button
                onClick={() => { setShowConfigModal(false); setMomentoFile(null); }}
                className="flex-1 px-4 py-2 bg-white border border-rose-200 text-gray-700 text-[10px] font-bold rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublicar}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Publicar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};