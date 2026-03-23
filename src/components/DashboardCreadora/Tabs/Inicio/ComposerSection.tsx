import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image, Video as VideoIcon, Globe, X, Lightbulb, Check, Tag, Star, DollarSign, ZoomIn, Vote, ChevronLeft, ChevronRight, ImagePlus, Gem, TrendingUp, Search } from 'lucide-react';
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
  const [ideaTemporal, setIdeaTemporal] = useState<RetoSugerido | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [busquedaIdeas, setBusquedaIdeas] = useState('');

  const { showToast, toastMessage, toastType, toast, closeToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const ideasActivas = retosSugeridos
    .filter(r => r.estado === 'activo')
    .filter(r => 
      busquedaIdeas.trim() === '' || 
      r.descripcion.toLowerCase().includes(busquedaIdeas.toLowerCase()) ||
      r.creador?.nombre.toLowerCase().includes(busquedaIdeas.toLowerCase())
    )
    .sort((a, b) => b.votos - a.votos);

  useEffect(() => {
    if (audiencia === 'publico') {
      setContenidoSugeridoActivado(false);
      setPremiumActivado(false);
      setPrecioPremium('');
      setIdeaSeleccionada(null);
    }
  }, [audiencia]);

  useEffect(() => {
    if (showSugeridoModal) {
      setIdeaTemporal(ideaSeleccionada);
      setBusquedaIdeas('');
    }
  }, [showSugeridoModal]);

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
    setIdeaTemporal(idea);
  };

  const handleAceptarIdea = () => {
    if (ideaTemporal) {
      setIdeaSeleccionada(ideaTemporal);
      setShowSugeridoModal(false);
      setIdeaTemporal(null);
      setBusquedaIdeas('');
    }
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
      <div className={`bg-gradient-to-br from-white via-rose-50/20 to-pink-50/20 rounded-xl shadow-md border border-rose-100/60 overflow-hidden ${className}`}>
        {ideaSeleccionada && contenidoSugeridoActivado && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-rose-50 via-pink-50/80 to-rose-50 border-b border-rose-200/40">
            <Lightbulb className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="text-[9px] font-semibold text-rose-600 flex-1 truncate">📣 Pedido por la comunidad: {ideaSeleccionada.descripcion}</span>
            <button
              onClick={() => {
                setContenidoSugeridoActivado(false);
                setIdeaSeleccionada(null);
                setNuevoPost('');
              }}
              className="w-5 h-5 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <X className="w-3 h-3 text-rose-500" />
            </button>
          </div>
        )}

        <div className="p-4 pb-3">
          <div className="flex gap-3">
            <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" className="w-9 h-9 rounded-full flex-shrink-0 object-cover mt-0.5 border-2 border-rose-100" />
            <div className="flex-1">
              <textarea
                value={nuevoPost}
                onChange={(e) => setNuevoPost(e.target.value)}
                placeholder={archivosSeleccionados.length > 0 ? placeholders[audiencia] : placeholders.publico}
                style={{ outline: 'none', boxShadow: 'none' }}
                className="w-full px-3.5 py-2.5 rounded-xl text-[11px] text-gray-700 border border-rose-100 bg-white resize-none placeholder:text-gray-300 focus:border-rose-300 focus:bg-white transition-colors shadow-sm"
                rows={2}
                maxLength={200}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[8px] text-gray-400">{nuevoPost.length}/200</span>
              </div>

              {archivosSeleccionados.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {archivosSeleccionados.map((file, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group border-2 border-rose-100 cursor-pointer shadow-sm" onClick={() => openLightbox(i)}>
                      {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"><VideoIcon className="w-5 h-5 text-rose-300" /></div>}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"><ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                      <button onClick={(e) => { e.stopPropagation(); removeArchivo(i); }} className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity shadow-md">✕</button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setArchivosSeleccionados([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="h-16 px-4 rounded-xl border-2 border-gray-300 bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 text-gray-600 hover:text-gray-700 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-[9px] font-bold">Borrar todo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {archivosSeleccionados.length > 0 && (
          <div className="px-4 pb-4">
            <p className="text-[10px] font-bold text-gray-700 mb-2.5">¿QUIÉN PUEDE VER ESTO?</p>

            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setAudiencia('publico')}
                className="flex items-center gap-2 group"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${audiencia === 'publico' ? 'border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-500' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                  {audiencia === 'publico' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${audiencia === 'publico' ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>Público</span>
              </button>

              <button
                onClick={() => setAudiencia('suscriptores')}
                className="flex items-center gap-2 group"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${audiencia === 'suscriptores' ? 'border-rose-400 bg-gradient-to-br from-rose-400 to-pink-500' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                  {audiencia === 'suscriptores' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${audiencia === 'suscriptores' ? 'text-rose-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>Solo suscriptores</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {audiencia === 'publico' && (
                <p className="text-[10px] text-emerald-500 font-medium">✨ Comparte algo increíble con toda tu audiencia</p>
              )}

              {audiencia === 'suscriptores' && (
                <>
                  <button
                    onClick={() => retosActivos && setContenidoSugeridoActivado(!contenidoSugeridoActivado)}
                    disabled={!retosActivos}
                    className={'flex items-center gap-1.5 group ' + (!retosActivos ? 'opacity-50 cursor-not-allowed' : '')}
                  >
                    <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${contenidoSugeridoActivado ? 'bg-gradient-to-br from-rose-400 to-pink-500 border-rose-400' : 'border-rose-300 group-hover:border-rose-400'
                      }`}>
                      {contenidoSugeridoActivado && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700">Contenido sugerido</span>
                    {contenidoSugeridoActivado && <Lightbulb className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                  {contenidoSugeridoActivado && ideasActivas.length > 0 && (
                    <button
                      onClick={() => setShowSugeridoModal(true)}
                      className="text-[9px] text-rose-500 hover:text-rose-600 font-semibold underline"
                    >
                      [Ver ideas]
                    </button>
                  )}

                  <button
                    onClick={() => setPremiumActivado(!premiumActivado)}
                    className="flex items-center gap-1.5 group"
                  >
                    <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${premiumActivado ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500' : 'border-emerald-300 group-hover:border-emerald-400'
                      }`}>
                      {premiumActivado && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700">Contenido Premium</span>
                  </button>

                  {premiumActivado && (
                    <>
                      <span className="text-[9px] font-medium text-gray-400">S/.</span>
                      <input
                        type="number"
                        value={precioPremium}
                        onChange={(e) => setPrecioPremium(e.target.value)}
                        min="10"
                        step="1"
                        placeholder=""
                        style={{ outline: 'none', boxShadow: 'none' }}
                        className="w-16 px-2 py-1 rounded-lg border border-emerald-200 bg-white text-[10px] text-gray-400 font-medium focus:border-emerald-300 transition-colors"
                      />
                      <Gem className="w-3.5 h-3.5 text-emerald-500" />
                    </>
                  )}
                </>
              )}

              <div className="flex-1" />

              <label className="cursor-pointer flex-shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700 transition-all shadow-sm group">
                  <ImagePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
              </label>

              <div className="flex items-center gap-1.5 text-[9px] font-semibold flex-shrink-0 px-2 py-1 rounded-lg bg-white border border-rose-100">
                {audiencia === 'publico' && <><Globe className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">Público</span></>}
                {audiencia === 'suscriptores' && !premiumActivado && <><Star className="w-3 h-3 text-rose-500" /><span className="text-rose-600">Suscriptores</span></>}
                {audiencia === 'suscriptores' && premiumActivado && <><Gem className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">Premium</span></>}
              </div>

              <button
                onClick={handlePublicar}
                disabled={!canPublish}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex-shrink-0 shadow-md ${!canPublish
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : audiencia === 'publico'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                    : premiumActivado
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                  }`}
              >
                {premiumActivado ? 'Publicar ✨' : 'Publicar'}
              </button>
            </div>
          </div>
        )}

        {archivosSeleccionados.length === 0 && (
          <div className="px-4 pb-4 flex items-center gap-2">
            <div className="flex-1" />

            <label className="cursor-pointer flex-shrink-0">
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700 transition-all shadow-sm group">
                <ImagePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
            </label>

            <div className="flex items-center gap-1.5 text-[9px] font-semibold flex-shrink-0 px-2 py-1 rounded-lg bg-white border border-rose-100">
              <Globe className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">Público</span>
            </div>

            <button
              onClick={handlePublicar}
              disabled={!nuevoPost.trim()}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all flex-shrink-0 shadow-md ${!nuevoPost.trim()
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
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

      {/* ✅ MODAL VIP PREMIUM CON BUSCADOR */}
      {showSugeridoModal && createPortal(
        <div className="fixed inset-0 z-[100000] bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 flex items-center justify-center p-4" onClick={() => setShowSugeridoModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[75vh] flex flex-col overflow-hidden border border-rose-100" onClick={e => e.stopPropagation()}>
            
            {/* ✅ Header VIP Premium CON BUSCADOR */}
            <div className="px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-violet-50 border-b border-rose-100 rounded-t-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Contenido Sugerido</h3>
                    <p className="text-[10px] text-gray-500">{ideasActivas.length} ideas de tu comunidad</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSugeridoModal(false)} 
                  className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Buscador */}
              <div className="relative">
                <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={busquedaIdeas} 
                  onChange={(e) => setBusquedaIdeas(e.target.value)} 
                  placeholder="Buscar ideas..." 
                  className="w-full pl-8 pr-3 py-2 text-[10px] bg-white rounded-lg outline-none border border-rose-200 focus:border-rose-300"
                />
              </div>
            </div>

            {/* Lista de ideas */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/30">
              {ideasActivas.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-[11px] text-gray-400">
                    {busquedaIdeas ? 'No hay resultados' : 'No hay sugerencias activas'}
                  </p>
                </div>
              ) : (
                ideasActivas.map((idea, index) => (
                  <button 
                    key={idea.id} 
                    onClick={() => handleSeleccionarIdea(idea)} 
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      ideaTemporal?.id === idea.id 
                        ? 'bg-white border-rose-300 shadow-md ring-2 ring-rose-200' 
                        : 'bg-white border-gray-200 hover:border-rose-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Checkbox */}
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
                        ideaTemporal?.id === idea.id 
                          ? 'border-rose-500 bg-rose-500' 
                          : 'border-gray-300'
                      }`}>
                        {ideaTemporal?.id === idea.id && (
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-1.5 mb-1">
                          {index === 0 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[8px] font-bold">
                              <TrendingUp className="w-2 h-2" />
                              TOP
                            </span>
                          )}
                          {idea.creadoPor === 'suscriptor' && idea.creador && (
                            <span className="text-[8px] text-gray-500">por {idea.creador.nombre}</span>
                          )}
                        </div>

                        {/* Descripción */}
                        <p className="text-[10px] text-gray-700 font-medium leading-relaxed">
                          {idea.descripcion}
                        </p>
                      </div>

                      {/* Votos */}
                      <div className="flex items-center gap-1 text-rose-600 flex-shrink-0 mt-0.5 px-2 py-1 bg-rose-50 rounded-lg border border-rose-200">
                        <Vote className="w-3 h-3" />
                        <span className="text-[9px] font-bold">{idea.votos}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* ✅ Footer VIP Premium */}
            <div className="px-4 py-3 border-t border-rose-100 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-violet-50/30 flex items-center justify-between">
              <p className="text-[9px] text-gray-500 flex items-center gap-1">
                <Lightbulb className="w-2.5 h-2.5" />
                Se usará en tu post
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setShowSugeridoModal(false);
                    setIdeaTemporal(null);
                    setBusquedaIdeas('');
                  }} 
                  className="px-4 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-gray-700 text-[10px] font-bold rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAceptarIdea}
                  disabled={!ideaTemporal}
                  className={`px-4 py-2 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm ${
                    ideaTemporal
                      ? 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600'
                      : 'bg-rose-300 cursor-not-allowed'
                  }`}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLightbox && archivosSeleccionados.length > 0 && createPortal(
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50 z-[99999] flex items-center justify-center p-6" onClick={() => setShowLightbox(false)}>
          <button onClick={() => setShowLightbox(false)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"><X className="w-6 h-6" /></button>
          <div className="max-w-3xl max-h-[80vh] relative" onClick={e => e.stopPropagation()}>
            {archivosSeleccionados[lightboxIndex]?.type.startsWith('image/') ? <img src={URL.createObjectURL(archivosSeleccionados[lightboxIndex])} alt="" className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20" /> : <div className="w-[480px] h-[320px] bg-gradient-to-br from-rose-900 to-pink-900 rounded-2xl flex items-center justify-center shadow-2xl"><VideoIcon className="w-12 h-12 text-white/40" /><span className="text-white/60 text-sm ml-3">Video: {archivosSeleccionados[lightboxIndex]?.name}</span></div>}
            {archivosSeleccionados.length > 1 && <div className="flex items-center justify-center gap-4 mt-5"><button onClick={() => setLightboxIndex(prev => Math.max(0, prev - 1))} disabled={lightboxIndex === 0} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-all backdrop-blur-sm"><ChevronLeft className="w-5 h-5" /></button><span className="text-white/80 text-[11px] font-semibold px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">{lightboxIndex + 1} / {archivosSeleccionados.length}</span><button onClick={() => setLightboxIndex(prev => Math.min(archivosSeleccionados.length - 1, prev + 1))} disabled={lightboxIndex === archivosSeleccionados.length - 1} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-all backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></button></div>}
            <button onClick={(e) => { e.stopPropagation(); removeArchivo(lightboxIndex); if (lightboxIndex >= archivosSeleccionados.length - 1) setLightboxIndex(Math.max(0, lightboxIndex - 1)); if (archivosSeleccionados.length <= 1) setShowLightbox(false); }} className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg">Eliminar</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};