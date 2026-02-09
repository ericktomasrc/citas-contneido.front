import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image, Video as VideoIcon, Globe, X, Lightbulb, Check, Tag, Star, DollarSign, ZoomIn, Vote, ChevronLeft, ChevronRight, ImagePlus, Gem } from 'lucide-react';
import { Toast } from '../../Modal/Toast';
import { useToast } from '../../hooks/useToast';

interface RetoSugerido {
  id: string;
  descripcion: string;
  votos: number;
  estado: 'activo' | 'completado';
  creadoPor: 'creadora' | 'suscriptor';
  creador?: { id: string; nombre: string; username: string; avatar: string };
}

interface ComposerSectionProps {
  className?: string;
  onPublicar?: (publicacion: any) => void;
  retosSugeridos?: RetoSugerido[];
  retosActivos?: boolean;
}

export const ComposerSection = ({ className = '', onPublicar, retosSugeridos = [], retosActivos = false }: ComposerSectionProps) => {
  const [nuevoPost, setNuevoPost] = useState('');
  const [audiencia, setAudiencia] = useState<'publico' | 'suscriptores'>('publico');
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [contenidoSugeridoActivado, setContenidoSugeridoActivado] = useState(false);
  const [premiumActivado, setPremiumActivado] = useState(false);
  const [precioPremium, setPrecioPremium] = useState('');
  const [showSugeridoModal, setShowSugeridoModal] = useState(false);
  const [ideaSeleccionada, setIdeaSeleccionada] = useState<RetoSugerido | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { showToast, toastMessage, toastType, toast, closeToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ideasActivas = retosSugeridos.filter(r => r.estado === 'activo').sort((a, b) => b.votos - a.votos);

  useEffect(() => {
    if (audiencia === 'publico') {
      setContenidoSugeridoActivado(false);
      setPremiumActivado(false);
      setPrecioPremium('');
      setIdeaSeleccionada(null);
    }
  }, [audiencia]);

  const handlePublicar = () => {
    if (nuevoPost.trim() && archivosSeleccionados.length === 0) {
      onPublicar?.({
        id: Date.now().toString(),
        tipo: 'texto',
        visibilidad: 'publico',
        contenido: nuevoPost,
        fechaPublicacion: new Date(),
        meGusta: [], noMeGusta: [], vistas: [], comentarios: [],
      });

      setNuevoPost('');
      return;
    }

    if (archivosSeleccionados.length === 0) return;

    if (audiencia === 'suscriptores') {
      if (contenidoSugeridoActivado && !ideaSeleccionada) {
        toast('No se Seleccionado una idea en contenido sugerido', 'error');
        return;
      }
      if (premiumActivado && (!precioPremium || parseFloat(precioPremium) <= 0)) {
        toast('Ingresa un precio válido para contenido premium', 'warning');
        return;
      }
    }

    let contenidoFinal = nuevoPost;

    if (contenidoSugeridoActivado && ideaSeleccionada) {
      const textoPedido = `📣 Pedido por mi comunidad: ${ideaSeleccionada.descripcion}`;
      contenidoFinal = nuevoPost.trim()
        ? `${textoPedido}\n\n${nuevoPost}`
        : textoPedido;
    }

    onPublicar?.({
      id: Date.now().toString(),
      tipo: archivosSeleccionados.some(f => f.type.startsWith('video/')) ? 'video' : 'foto',
      visibilidad: audiencia,
      contenido: contenidoFinal,
      archivos: archivosSeleccionados,
      fechaPublicacion: new Date(),
      meGusta: [], noMeGusta: [], vistas: [], comentarios: [],
      esPPV: premiumActivado,
      precioPPV: premiumActivado ? parseFloat(precioPremium) : undefined,
      ideaSugerida: ideaSeleccionada ? ideaSeleccionada.id : undefined,
      ideaSugeridaDescripcion: ideaSeleccionada ? ideaSeleccionada.descripcion : undefined,
    });

    setNuevoPost('');
    setArchivosSeleccionados([]);
    setAudiencia('publico');
    setPrecioPremium('');
    setIdeaSeleccionada(null);
    setContenidoSugeridoActivado(false);
    setPremiumActivado(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setArchivosSeleccionados(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeArchivo = (index: number) => setArchivosSeleccionados(prev => prev.filter((_, i) => i !== index));
  const openLightbox = (index: number) => { setLightboxIndex(index); setShowLightbox(true); };

  const handleSeleccionarIdea = (idea: RetoSugerido) => {
    setIdeaSeleccionada(idea);
    setShowSugeridoModal(false);
  };

  const handleDesvincularIdea = () => {
    setIdeaSeleccionada(null);
    setNuevoPost('');
  };

  const placeholders: Record<string, string> = {
    publico: '¿Qué quieres compartir con todos?',
    suscriptores: 'Contenido exclusivo para tus suscriptores...',
  };

  const canPublish = archivosSeleccionados.length > 0
    ? true
    : nuevoPost.trim() !== '';

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden ${className}`}>
        {ideaSeleccionada && contenidoSugeridoActivado && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-rose-50/60 border-b border-rose-100/60">
            <Lightbulb className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="text-[9px] font-medium text-rose-500 flex-1 truncate">📣 Pedido por la comunidad: {ideaSeleccionada.descripcion}</span>
            <button
              onClick={() => {
                setContenidoSugeridoActivado(false);
                setIdeaSeleccionada(null);
                setNuevoPost('');
              }}
              className="w-4 h-4 rounded-full bg-rose-100/80 hover:bg-rose-200/80 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <X className="w-2.5 h-2.5 text-rose-400" />
            </button>
          </div>
        )}

        <div className="p-3.5 pb-2.5">
          <div className="flex gap-3">
            <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-8 h-8 rounded-full flex-shrink-0 object-cover mt-0.5" />
            <div className="flex-1">
              <textarea
                value={nuevoPost}
                onChange={(e) => setNuevoPost(e.target.value)}
                placeholder={archivosSeleccionados.length > 0 ? placeholders[audiencia] : placeholders.publico}
                style={{ outline: 'none', boxShadow: 'none' }}
                className="w-full px-3 py-2 rounded-lg text-[11px] text-slate-600 border border-slate-200/60 bg-slate-50/25 resize-none placeholder:text-slate-300 focus:border-rose-200/60 focus:bg-white transition-colors"
                rows={2}
                maxLength={200}
              />
              <div className="flex justify-end mt-0.5">
                <span className="text-[8px] text-slate-300">{nuevoPost.length}/200</span>
              </div>

              {archivosSeleccionados.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {archivosSeleccionados.map((file, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden group border border-slate-100 cursor-pointer" onClick={() => openLightbox(i)}>
                      {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><VideoIcon className="w-4 h-4 text-slate-300" /></div>}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"><ZoomIn className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                      <button onClick={(e) => { e.stopPropagation(); removeArchivo(i); }} className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-400/80 text-white rounded-full flex items-center justify-center text-[7px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setArchivosSeleccionados([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="h-14 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-semibold">Borrar todo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {archivosSeleccionados.length > 0 && (
          <div className="px-3.5 pb-3">
            <p className="text-[10px] font-bold text-slate-600 mb-2">¿QUIÉN PUEDE VER ESTO?</p>

            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setAudiencia('publico')}
                className="flex items-center gap-1.5 group"
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${audiencia === 'publico' ? 'border-emerald-500' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                  {audiencia === 'publico' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${audiencia === 'publico' ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-600'
                  }`}>Público</span>
              </button>

              <button
                onClick={() => setAudiencia('suscriptores')}
                className="flex items-center gap-1.5 group"
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${audiencia === 'suscriptores' ? 'border-rose-500' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                  {audiencia === 'suscriptores' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${audiencia === 'suscriptores' ? 'text-rose-600' : 'text-slate-500 group-hover:text-slate-600'
                  }`}>Solo suscriptores</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {audiencia === 'publico' && (
                <p className="text-[10px] text-slate-400 italic">✨ Comparte algo increíble con toda tu audiencia</p>
              )}

              {audiencia === 'suscriptores' && (
                <>
                  <button
                    onClick={() => retosActivos && setContenidoSugeridoActivado(!contenidoSugeridoActivado)}
                    disabled={!retosActivos}
                    className={'flex items-center gap-1 group ' + (!retosActivos ? 'opacity-50 cursor-not-allowed' : '')}
                  >
                    <div className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${contenidoSugeridoActivado ? 'bg-rose-400 border-rose-400' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                      {contenidoSugeridoActivado && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">Contenido sugerido</span>
                    <Lightbulb className="w-3 h-3 text-rose-400" />
                  </button>
                  {contenidoSugeridoActivado && ideasActivas.length > 0 && (
                    <button
                      onClick={() => setShowSugeridoModal(true)}
                      className="text-[9px] text-rose-500 hover:text-rose-600 font-medium underline"
                    >
                      [Ver ideas]
                    </button>
                  )}

                  <button
                    onClick={() => setPremiumActivado(!premiumActivado)}
                    className="flex items-center gap-1 group"
                  >
                    <div className={`w-3 h-3 rounded border flex items-center justify-center transition-all ${premiumActivado ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                      {premiumActivado && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">Contenido Premium</span>
                  </button>

                  {premiumActivado && (
                    <>
                      <span className="text-[10px] font-medium text-slate-600">S/.</span>
                      <input
                        type="number"
                        value={precioPremium}
                        onChange={(e) => setPrecioPremium(e.target.value)}
                        min="10"
                        step="1"
                        style={{ outline: 'none', boxShadow: 'none' }}
                        className="w-14 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-700 focus:border-slate-300 focus:bg-white"
                      />
                      <Gem className="w-3 h-3 text-emerald-600" />
                    </>
                  )}
                </>
              )}

              <div className="flex-1" />

              <label className="cursor-pointer flex-shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-700 transition-all shadow-sm">
                  <ImagePlus className="w-4 h-4" />
                </div>
              </label>

              <div className="flex items-center gap-1 text-[8px] text-slate-400 flex-shrink-0">
                {audiencia === 'publico' && <><Globe className="w-2.5 h-2.5" />Público</>}
                {audiencia === 'suscriptores' && !premiumActivado && <><Star className="w-2.5 h-2.5" />Suscriptores</>}
                {audiencia === 'suscriptores' && premiumActivado && <><Gem className="w-2.5 h-2.5" />Premium</>}
              </div>

              <button
                onClick={handlePublicar}
                disabled={!canPublish}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex-shrink-0 shadow-sm ${!canPublish
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : audiencia === 'publico'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                    : premiumActivado
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                  }`}
              >
                {premiumActivado ? 'Publicar Premium' : 'Publicar'}
              </button>
            </div>
          </div>
        )}

        {archivosSeleccionados.length === 0 && (
          <div className="px-3.5 pb-3 flex items-center gap-2">
            <div className="flex-1" />

            <label className="cursor-pointer flex-shrink-0">
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-700 transition-all shadow-sm">
                <ImagePlus className="w-4 h-4" />
              </div>
            </label>

            <div className="flex items-center gap-1 text-[8px] text-slate-400 flex-shrink-0">
              <Globe className="w-2.5 h-2.5" />Público
            </div>

            <button
              onClick={handlePublicar}
              disabled={!nuevoPost.trim()}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex-shrink-0 shadow-sm ${!nuevoPost.trim()
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white'
                }`}
            >
              Publicar
            </button>
          </div>
        )}
      </div>

      <Toast 
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={closeToast}
        position="top"
        duration={3000}
      />

      {showSugeridoModal && createPortal(
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4" style={{ zIndex: 99999 }} onClick={() => setShowSugeridoModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[70vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3.5 bg-gradient-to-r from-rose-50/80 to-pink-50/80 border-b border-rose-100/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-rose-100/80 rounded-lg flex items-center justify-center"><Lightbulb className="w-4 h-4 text-rose-400" /></div>
                <div><h3 className="text-[12px] font-bold text-slate-600">Contenido Sugerido</h3><p className="text-[9px] text-slate-400">{ideasActivas.length} ideas de tu comunidad</p></div>
              </div>
              <button onClick={() => setShowSugeridoModal(false)} className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-500 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {ideasActivas.length === 0 ? <p className="text-[10px] text-slate-400 text-center py-8">No hay sugerencias activas</p> : ideasActivas.map((idea, index) => (
                <button key={idea.id} onClick={() => handleSeleccionarIdea(idea)} className={`w-full p-3 rounded-xl text-left transition-all border ${ideaSeleccionada?.id === idea.id ? 'bg-rose-50/50 border-rose-200/70' : 'bg-white border-slate-100 hover:border-rose-100 hover:bg-rose-50/20'}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-[1.5px] transition-all ${ideaSeleccionada?.id === idea.id ? 'border-rose-400 bg-rose-400 text-white' : 'border-slate-200'}`}>{ideaSeleccionada?.id === idea.id && <Check className="w-2.5 h-2.5" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">{index === 0 && <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-rose-100/80 text-rose-500 font-bold">🔥 TOP</span>}{idea.creadoPor === 'suscriptor' && idea.creador && <span className="text-[8px] text-slate-400">por {idea.creador.nombre}</span>}</div>
                      <p className="text-[11px] text-slate-600 leading-snug">{idea.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-rose-400 flex-shrink-0 mt-0.5"><Vote className="w-3 h-3" /><span className="text-[9px] font-bold">{idea.votos}</span></div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-100/40 bg-slate-50/20 flex items-center justify-between">
              <p className="text-[8px] text-slate-400">💡 La descripción se usará en tu post</p>
              <button onClick={() => setShowSugeridoModal(false)} className="px-3 py-1.5 bg-rose-50/80 text-rose-500 text-[10px] font-semibold rounded-lg hover:bg-rose-100/80 transition-all">Cerrar</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLightbox && archivosSeleccionados.length > 0 && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-6" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"><X className="w-5 h-5" /></button>
          <div className="max-w-3xl max-h-[80vh] relative" onClick={e => e.stopPropagation()}>
            {archivosSeleccionados[lightboxIndex]?.type.startsWith('image/') ? <img src={URL.createObjectURL(archivosSeleccionados[lightboxIndex])} alt="" className="max-w-full max-h-[80vh] object-contain rounded-xl" /> : <div className="w-[480px] h-[320px] bg-slate-900 rounded-xl flex items-center justify-center"><VideoIcon className="w-12 h-12 text-white/40" /><span className="text-white/60 text-sm ml-3">Video: {archivosSeleccionados[lightboxIndex]?.name}</span></div>}
            {archivosSeleccionados.length > 1 && <div className="flex items-center justify-center gap-3 mt-4"><button onClick={() => setLightboxIndex(prev => Math.max(0, prev - 1))} disabled={lightboxIndex === 0} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button><span className="text-white/60 text-[11px]">{lightboxIndex + 1} / {archivosSeleccionados.length}</span><button onClick={() => setLightboxIndex(prev => Math.min(archivosSeleccionados.length - 1, prev + 1))} disabled={lightboxIndex === archivosSeleccionados.length - 1} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button></div>}
            <button onClick={(e) => { e.stopPropagation(); removeArchivo(lightboxIndex); if (lightboxIndex >= archivosSeleccionados.length - 1) setLightboxIndex(Math.max(0, lightboxIndex - 1)); if (archivosSeleccionados.length <= 1) setShowLightbox(false); }} className="absolute top-3 left-3 px-3 py-1.5 bg-red-400/80 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all">Eliminar</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};