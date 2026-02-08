import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Camera, X, Upload, Video as VideoIcon, Globe, Crown, ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (files.length > 0) { setMomentoFile(files[0]); setShowConfigModal(true); setShowCrearModal(false); }
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
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${compact ? 'p-3' : 'p-3'} h-full ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm`}>
              <Sparkles className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-white`} />
            </div>
            <h3 className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-semibold text-slate-700`}>Momentos</h3>
          </div>
          <span className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-slate-400`}>24h</span>
        </div>

        {/* Container con scroll y botones de navegación */}
        <div className="relative group">
          {/* Botón scroll izquierda - aparece al costado izquierdo del contenedor */}
          <button 
            onClick={() => {
              const container = document.getElementById('momentos-scroll');
              if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:text-slate-700 border border-slate-200"
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
          
          {/* Botón Crear */}
          <button onClick={() => setShowCrearModal(true)} className="flex-shrink-0">
            <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center hover:border-violet-300 hover:bg-violet-50 transition-all`}>
              <Camera className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400`} />
            </div>
            <p className={`${compact ? 'text-[7px]' : 'text-[8px]'} text-center mt-1 text-slate-400`}>Crear</p>
          </button>
          
          {/* Momentos públicos */}
          {[41, 43, 45, 47, 49, 51].map((img, i) => (
            <button key={`p-${i}`} className="flex-shrink-0">
              <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl border-2 border-emerald-300 p-[1px] bg-white`}>
                <div className="w-full h-full rounded-[9px] overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?img=${img}`} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              <div className="flex justify-center -mt-1.5">
                <span className={`px-1.5 py-0.5 bg-emerald-500 ${compact ? 'text-[6px]' : 'text-[7px]'} text-white font-semibold rounded-full shadow-sm`}>{22 - i * 3}h</span>
              </div>
            </button>
          ))}
          
          {/* Momentos suscriptores */}
          {[42, 44, 46, 48, 50].map((img, i) => (
            <button key={`s-${i}`} className="flex-shrink-0">
              <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-br from-fuchsia-400 to-violet-400 p-[2px]`}>
                <div className="w-full h-full rounded-[10px] overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?img=${img}`} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              <div className="flex justify-center -mt-1.5">
                <span className={`px-1.5 py-0.5 bg-fuchsia-500 ${compact ? 'text-[6px]' : 'text-[7px]'} text-white font-semibold rounded-full shadow-sm`}>{21 - i * 3}h</span>
              </div>
            </button>
          ))}
          </div>

          {/* Botón scroll derecha - aparece al costado derecho del contenedor */}
          <button 
            onClick={() => {
              const container = document.getElementById('momentos-scroll');
              if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 hover:text-slate-700 border border-slate-200"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showCrearModal && createPortal(
        <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4" onClick={() => setShowCrearModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-slate-700">Crear Momento</h3>
              <button onClick={() => setShowCrearModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4">
              <button onClick={() => fileInputRef.current?.click()} className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-left flex items-center gap-3 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center"><Upload className="w-5 h-5 text-slate-500" /></div>
                <div><p className="text-[11px] font-semibold text-slate-700">Subir desde Galería</p><p className="text-[9px] text-slate-400">Foto o video</p></div>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showConfigModal && createPortal(
        <div className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center p-4" onClick={() => { setShowConfigModal(false); setMomentoFile(null); }}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-slate-700">Configurar Momento</h3>
              <button onClick={() => { setShowConfigModal(false); setMomentoFile(null); }} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              {momentoFile && (
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50">
                  {momentoFile.type.startsWith('video/') ? <video src={URL.createObjectURL(momentoFile)} className="w-full h-full object-cover" controls /> : <img src={URL.createObjectURL(momentoFile)} alt="" className="w-full h-full object-cover" />}
                </div>
              )}
              <div className="space-y-2">
                <button onClick={() => setMomentoVisibilidad('publico')} className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${momentoVisibilidad === 'publico' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <Globe className="w-4 h-4 text-slate-500" /><p className="text-[11px] font-semibold text-slate-700">Público</p>
                </button>
                <button onClick={() => setMomentoVisibilidad('suscriptores')} className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${momentoVisibilidad === 'suscriptores' ? 'bg-fuchsia-50 border border-fuchsia-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <Crown className="w-4 h-4 text-slate-500" /><p className="text-[11px] font-semibold text-slate-700">Solo Suscriptores</p>
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <button onClick={() => { setShowConfigModal(false); setMomentoFile(null); }} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-xl hover:bg-slate-200">Cancelar</button>
              <button onClick={handlePublicar} className="flex-1 px-4 py-2 bg-slate-700 text-white text-[10px] font-semibold rounded-xl hover:bg-slate-800">Publicar</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};