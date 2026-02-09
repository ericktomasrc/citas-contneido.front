import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, X, Clock, ArrowRight, ArrowLeft, Check, ChevronLeft, ChevronRight, AlertCircle, TrendingUp, Search } from 'lucide-react';
import { Toast } from '../../Modal/Toast';
import { useToast } from '../../hooks/useToast';

interface Reto {
    id: string;
    descripcion: string;
    votos: number;
    estado: 'activo' | 'completado';
    creadoPor: 'creadora' | 'suscriptor';
    creador?: { id: string; nombre: string; username: string; avatar: string; };
    fechaCreacion: Date;
}

interface NuevaProgramacion {
    titulo: string;
    fecha: Date | null;
    hora: string;
    tipo: 'gratis' | 'suscriptores' | 'ppv';
    precio: number;
    ideaSeleccionada: string;
}

interface ModalProgramarTransmisionProps {
    isOpen: boolean;
    onClose: () => void;
    onCrear: (prog: NuevaProgramacion) => void;
    ideasLive: Reto[];
    ideasLiveActivo: boolean;
}

export const ModalProgramarTransmision: React.FC<ModalProgramarTransmisionProps> = ({
    isOpen,
    onClose,
    onCrear,
    ideasLive,
    ideasLiveActivo
}) => {
    const [paso, setPaso] = useState(1);
    const [nuevaProg, setNuevaProg] = useState<NuevaProgramacion>({
        titulo: '',
        fecha: null,
        hora: '',
        tipo: 'suscriptores',
        precio: 15,
        ideaSeleccionada: ''
    });
    const [mesActual, setMesActual] = useState(new Date());
    const [busquedaIdea, setBusquedaIdea] = useState('');
    const [filtroOrigen, setFiltroOrigen] = useState<'todos' | 'suscriptor' | 'creadora'>('todos');
    const [ordenamiento, setOrdenamiento] = useState<'votos' | 'reciente'>('votos');

    const { showToast, toastMessage, toastType, toast, closeToast } = useToast();

    const hoy = useMemo(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    }, []);

    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const diasSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    const esHoy = (fecha: Date) =>
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear();

    const esFechaPasada = (fecha: Date) => {
        const f = new Date(fecha);
        f.setHours(0, 0, 0, 0);
        return f < hoy;
    };

    const esMañana = (fecha: Date) => {
        const mañana = new Date(hoy);
        mañana.setDate(mañana.getDate() + 1);
        return fecha.getDate() === mañana.getDate() &&
            fecha.getMonth() === mañana.getMonth() &&
            fecha.getFullYear() === mañana.getFullYear();
    };

    const esFechaSeleccionada = (fecha: Date) =>
        nuevaProg.fecha &&
        fecha.getDate() === nuevaProg.fecha.getDate() &&
        fecha.getMonth() === nuevaProg.fecha.getMonth() &&
        fecha.getFullYear() === nuevaProg.fecha.getFullYear();

    const formatFecha = (fecha: Date) => {
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' ' + nombresMeses[fecha.getMonth()];
    };

    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;

        const parts = text.split(new RegExp(`(${search})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === search.toLowerCase() ? (
                        <span key={i} className="bg-yellow-200 font-bold">{part}</span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    const getDiasDelMes = useMemo(() => {
        const year = mesActual.getFullYear();
        const month = mesActual.getMonth();
        const primerDia = new Date(year, month, 1);
        const ultimoDia = new Date(year, month + 1, 0);
        const dias: (Date | null)[] = [];

        for (let i = 0; i < primerDia.getDay(); i++) dias.push(null);
        for (let i = 1; i <= ultimoDia.getDate(); i++) dias.push(new Date(year, month, i));

        return dias;
    }, [mesActual]);

    const horasComunes = useMemo(() => {
        const horas = ['09:00', '12:00', '15:00', '18:00', '20:00', '21:00', '22:00', '23:00'];

        if (nuevaProg.fecha && esHoy(nuevaProg.fecha)) {
            const horaActual = new Date().getHours();
            return horas.filter(hora => {
                const [h] = hora.split(':').map(Number);
                return h > horaActual;
            });
        }

        return horas;
    }, [nuevaProg.fecha, hoy]);

    const ideasFiltradas = useMemo(() => {
        let ideas = ideasLive.filter(i => i.estado === 'activo');

        if (filtroOrigen !== 'todos') {
            ideas = ideas.filter(i => i.creadoPor === filtroOrigen);
        }

        if (busquedaIdea.trim()) {
            const terminos = busquedaIdea.toLowerCase().split(' ');
            ideas = ideas.filter(i =>
                terminos.every(termino =>
                    i.descripcion.toLowerCase().includes(termino)
                )
            );
        }

        if (ordenamiento === 'votos') {
            ideas.sort((a, b) => b.votos - a.votos);
        } else {
            ideas.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        }

        return ideas;
    }, [ideasLive, busquedaIdea, filtroOrigen, ordenamiento]);

    const mesAnterior = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1));
    const mesSiguiente = () => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1));

    const handleCrear = () => {
        if (!nuevaProg.titulo.trim() || !nuevaProg.fecha || !nuevaProg.hora) return;
        onCrear(nuevaProg);
        resetModal();
    };

    const resetModal = () => {
        setPaso(1);
        setNuevaProg({
            titulo: '',
            fecha: null,
            hora: '',
            tipo: 'suscriptores',
            precio: 15,
            ideaSeleccionada: ''
        });
        setBusquedaIdea('');
        setFiltroOrigen('todos');
        setOrdenamiento('votos');
        onClose();
    };

    const siguientePaso = () => {
        if (paso === 1 && !nuevaProg.titulo.trim()) return;
        if (paso === 2 && !nuevaProg.fecha) return;
        if (paso === 3 && !nuevaProg.hora) return;
        if (paso < 4) setPaso(paso + 1);
    };

    const anteriorPaso = () => {
        if (paso > 1) setPaso(paso - 1);
    };

    const puedeAvanzar = () => {
        if (paso === 1) return nuevaProg.titulo.trim().length > 0;
        if (paso === 2) return nuevaProg.fecha !== null;
        if (paso === 3) return nuevaProg.hora !== '';
        return true;
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={resetModal}
        >
              <Toast 
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={closeToast}
        position="top"
        duration={3000}
    />
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            > 
                <div className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <CalendarIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Nueva Transmisión</h3>
                                <p className="text-[9px] text-white/80">Paso {paso} de 4</p>
                            </div>
                        </div>
                        <button
                            onClick={resetModal}
                            className="w-7 h-7 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center text-white backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((num) => (
                            <div
                                key={num}
                                className={'h-1 rounded-full flex-1 transition-all ' +
                                    (num <= paso ? 'bg-white' : 'bg-white/30')}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-5" style={{ minHeight: '380px' }}>
                    {paso === 1 && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h4 className="text-base font-bold text-slate-800 mb-1">¿De qué trata?</h4>
                                <p className="text-[10px] text-slate-500">Dale un título a tu evento</p>
                            </div>

                            {ideasLiveActivo && ideasLive.filter(i => i.estado === 'activo').length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                                            <p className="text-[10px] font-bold text-slate-700">Ideas más votadas</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400">
                                            {ideasFiltradas.length} de {ideasLive.filter(i => i.estado === 'activo').length}
                                        </span>
                                    </div>

                                    <div className="relative mb-3">
                                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar idea por palabras clave..."
                                            value={busquedaIdea}
                                            onChange={e => setBusquedaIdea(e.target.value)}
                                            className="w-full pl-9 pr-9 py-2 bg-slate-50 rounded-lg text-[10px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-0 transition-all"
                                        />
                                        {busquedaIdea && (
                                            <button
                                                onClick={() => setBusquedaIdea('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                                        <button
                                            onClick={() => setFiltroOrigen('todos')}
                                            className={'px-2.5 py-1 rounded-full text-[9px] font-semibold transition-all whitespace-nowrap ' +
                                                (filtroOrigen === 'todos'
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                                        >
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => setFiltroOrigen('suscriptor')}
                                            className={'px-2.5 py-1 rounded-full text-[9px] font-semibold transition-all whitespace-nowrap ' +
                                                (filtroOrigen === 'suscriptor'
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                                        >
                                            De fans
                                        </button>
                                        <button
                                            onClick={() => setFiltroOrigen('creadora')}
                                            className={'px-2.5 py-1 rounded-full text-[9px] font-semibold transition-all whitespace-nowrap ' +
                                                (filtroOrigen === 'creadora'
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                                        >
                                            Mis ideas
                                        </button>
                                        <button
                                            onClick={() => setOrdenamiento(ordenamiento === 'votos' ? 'reciente' : 'votos')}
                                            className="px-2.5 py-1 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all whitespace-nowrap"
                                        >
                                            {ordenamiento === 'votos' ? '🔥 Más votadas' : '🕐 Recientes'}
                                        </button>
                                    </div>

                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 
                                        [&::-webkit-scrollbar]:w-1.5
                                        [&::-webkit-scrollbar-track]:bg-slate-100
                                        [&::-webkit-scrollbar-track]:rounded-full
                                        [&::-webkit-scrollbar-thumb]:bg-rose-300
                                        [&::-webkit-scrollbar-thumb]:rounded-full
                                        [&::-webkit-scrollbar-thumb]:hover:bg-rose-400">

                                        {ideasFiltradas.length === 0 ? (
                                            <div className="text-center py-6">
                                                <p className="text-[10px] text-slate-400">No se encontraron ideas</p>
                                                {busquedaIdea && (
                                                    <button
                                                        onClick={() => setBusquedaIdea('')}
                                                        className="text-[9px] text-rose-500 hover:text-rose-600 mt-1"
                                                    >
                                                        Limpiar búsqueda
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            ideasFiltradas.map((idea, index) => (
                                                <button
                                                    key={idea.id}
                                                    onClick={() => setNuevaProg(p => ({ ...p, titulo: idea.descripcion, ideaSeleccionada: idea.id }))}
                                                    className={'w-full p-2.5 rounded-lg text-left transition-all ' +
                                                        (nuevaProg.ideaSeleccionada === idea.id
                                                            ? 'bg-gradient-to-r from-rose-50 to-pink-50 shadow-sm'
                                                            : 'bg-slate-50 hover:bg-rose-50/50')}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            {index === 0 && ordenamiento === 'votos' && (
                                                                <span className="text-[8px] px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold">
                                                                    🔥 TOP
                                                                </span>
                                                            )}
                                                            <span className="text-[9px] text-rose-600 font-semibold flex items-center gap-0.5">
                                                                <TrendingUp className="w-3 h-3" />
                                                                {idea.votos}
                                                            </span>
                                                        </div>
                                                        {nuevaProg.ideaSeleccionada === idea.id && (
                                                            <Check className="w-3.5 h-3.5 text-rose-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-700 font-medium line-clamp-2">
                                                        {highlightText(idea.descripcion, busquedaIdea)}
                                                    </p>
                                                    {idea.creadoPor === 'suscriptor' && idea.creador && (
                                                        <p className="text-[8px] text-slate-400 mt-1">
                                                            Sugerido por {idea.creador.nombre}
                                                        </p>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="O escribe tu propio título..."
                                value={nuevaProg.titulo}
                                onChange={e => setNuevaProg(p => ({ ...p, titulo: e.target.value, ideaSeleccionada: '' }))}
                                className="w-full px-4 py-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-0 transition-all"
                            />
                        </div>
                    )}

                    {paso === 2 && (
                        <div className="space-y-4">
                            <div className="text-center mb-3">
                                <h4 className="text-base font-bold text-slate-800 mb-1">¿Cuándo será?</h4>
                                <p className="text-[10px] text-slate-500">Selecciona la fecha</p>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                                    <button
                                        onClick={mesAnterior}
                                        className="w-6 h-6 rounded hover:bg-white transition-all flex items-center justify-center text-slate-500"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[11px] font-bold text-slate-700">
                                        {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
                                    </span>
                                    <button
                                        onClick={mesSiguiente}
                                        className="w-6 h-6 rounded hover:bg-white transition-all flex items-center justify-center text-slate-500"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="p-2 bg-white">
                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {diasSemana.map(d => (
                                            <div key={d} className="text-[9px] text-slate-500 text-center font-bold h-6 flex items-center justify-center">
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {getDiasDelMes.map((dia, i) => (
                                            <button
                                                key={i}
                                                disabled={!dia || esFechaPasada(dia)}
                                                onClick={() => dia && !esFechaPasada(dia) &&
                                                    setNuevaProg(p => ({ ...p, fecha: dia, hora: '' }))}
                                                className={'h-8 rounded-lg text-[10px] font-semibold transition-all ' +
                                                    (!dia
                                                        ? 'invisible'
                                                        : esFechaPasada(dia)
                                                            ? 'text-slate-300 cursor-not-allowed'
                                                            : esFechaSeleccionada(dia)
                                                                ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm'
                                                                : esHoy(dia)
                                                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                                                    : esMañana(dia)
                                                                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                                                        : 'text-slate-600 hover:bg-slate-100')}
                                            >
                                                {dia?.getDate()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {nuevaProg.fecha && (
                                <div className="text-center">
                                    <p className="text-[11px] text-rose-600 font-semibold">
                                        📅 {formatFecha(nuevaProg.fecha)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {paso === 3 && (
                        <div className="space-y-4">
                            <div className="text-center mb-3">
                                <h4 className="text-base font-bold text-slate-800 mb-1">¿A qué hora?</h4>
                                <p className="text-[10px] text-slate-500">
                                    {nuevaProg.fecha && formatFecha(nuevaProg.fecha)}
                                </p>
                            </div>

                            <div className="max-w-xs mx-auto">
                                <input
                                    type="time"
                                    value={nuevaProg.hora}
                                    onChange={e => {
                                        const horaSeleccionada = e.target.value;

                                        if (nuevaProg.fecha && esHoy(nuevaProg.fecha)) {
                                            const ahora = new Date();
                                            const horaActual = ahora.getHours();
                                            const minutoActual = ahora.getMinutes();

                                            const [horaInput, minutoInput] = horaSeleccionada.split(':').map(Number);

                                            if (horaInput < horaActual || (horaInput === horaActual && minutoInput <= minutoActual)) {
                                                toast('No puedes elegir una hora pasada', 'error');
                                                return;
                                            }
                                        }

                                        setNuevaProg(p => ({ ...p, hora: horaSeleccionada }));
                                    }}
                                    className="w-full px-4 py-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:bg-white focus:ring-0 transition-all text-center font-medium"
                                    autoFocus
                                />
                            </div>

                            {horasComunes.length > 0 && (
                                <div className="max-w-sm mx-auto">
                                    <p className="text-[10px] text-slate-500 text-center mb-2">Horas sugeridas</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {horasComunes.map((hora) => (
                                            <button
                                                key={hora}
                                                onClick={() => {
                                                    setNuevaProg(p => ({ ...p, hora }));
                                                    setTimeout(() => siguientePaso(), 300);
                                                }}
                                                className={'p-2 rounded-lg transition-all text-center ' +
                                                    (nuevaProg.hora === hora
                                                        ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm'
                                                        : 'bg-slate-50 hover:bg-rose-50 text-slate-700')}
                                            >
                                                <p className="text-[10px] font-bold">{hora}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {paso === 4 && (
                        <div className="space-y-4">
                            <div className="text-center mb-3">
                                <h4 className="text-base font-bold text-slate-800 mb-1">¿Quién podrá verlo?</h4>
                                <p className="text-[10px] text-slate-500">Tipo de audiencia</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setNuevaProg(p => ({ ...p, tipo: 'gratis' }))}
                                    className={'p-3 rounded-lg transition-all text-center ' +
                                        (nuevaProg.tipo === 'gratis'
                                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 shadow-sm'
                                            : 'bg-slate-50 hover:bg-emerald-50/50')}
                                >
                                    <div className={'w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ' +
                                        (nuevaProg.tipo === 'gratis' ? 'bg-emerald-100' : 'bg-slate-100')}>
                                        <Clock className={'w-3.5 h-3.5 ' + (nuevaProg.tipo === 'gratis' ? 'text-emerald-600' : 'text-slate-400')} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800">Público</p>
                                    <p className="text-[8px] text-slate-500 mt-0.5">Gratis</p>
                                </button>

                                <button
                                    onClick={() => setNuevaProg(p => ({ ...p, tipo: 'suscriptores' }))}
                                    className={'p-3 rounded-lg transition-all text-center ' +
                                        (nuevaProg.tipo === 'suscriptores'
                                            ? 'bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm'
                                            : 'bg-slate-50 hover:bg-rose-50/50')}
                                >
                                    <div className={'w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ' +
                                        (nuevaProg.tipo === 'suscriptores' ? 'bg-rose-100' : 'bg-slate-100')}>
                                        <Clock className={'w-3.5 h-3.5 ' + (nuevaProg.tipo === 'suscriptores' ? 'text-rose-600' : 'text-slate-400')} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800">VIP</p>
                                    <p className="text-[8px] text-slate-500 mt-0.5">Solo subs</p>
                                </button>

                                <button
                                    onClick={() => setNuevaProg(p => ({ ...p, tipo: 'ppv' }))}
                                    className={'p-3 rounded-lg transition-all text-center ' +
                                        (nuevaProg.tipo === 'ppv'
                                            ? 'bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm'
                                            : 'bg-slate-50 hover:bg-amber-50/50')}
                                >
                                    <div className={'w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ' +
                                        (nuevaProg.tipo === 'ppv' ? 'bg-amber-100' : 'bg-slate-100')}>
                                        <CalendarIcon className={'w-3.5 h-3.5 ' + (nuevaProg.tipo === 'ppv' ? 'text-amber-600' : 'text-slate-400')} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800">Premium</p>
                                    <p className="text-[8px] text-slate-500 mt-0.5">PPV</p>
                                </button>
                            </div>

                            {nuevaProg.tipo === 'ppv' && (
                                <div className="p-3 bg-amber-50 rounded-lg">
                                    <label className="text-[10px] font-semibold text-slate-700 mb-1.5 block">Precio (S/.)</label>
                                    <input
                                        type="number"
                                        value={nuevaProg.precio}
                                        onChange={e => setNuevaProg(p => ({ ...p, precio: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-3 py-2 bg-white rounded-lg text-[11px] font-semibold text-amber-900 focus:outline-none focus:ring-0"
                                        min="1"
                                    />
                                </div>
                            )}

                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-[10px] font-bold text-slate-700 mb-2">📋 Resumen</p>
                                <div className="space-y-1 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Título:</span>
                                        <span className="text-slate-800 font-semibold truncate ml-2 max-w-[200px]">{nuevaProg.titulo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Fecha:</span>
                                        <span className="text-slate-800 font-semibold">{nuevaProg.fecha && formatFecha(nuevaProg.fecha)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Hora:</span>
                                        <span className="text-slate-800 font-semibold">{nuevaProg.hora}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tipo:</span>
                                        <span className="text-slate-800 font-semibold capitalize">{nuevaProg.tipo}</span>
                                    </div>
                                    {nuevaProg.tipo === 'ppv' && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Precio:</span>
                                            <span className="text-amber-700 font-bold">S/. {nuevaProg.precio}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 bg-slate-50 flex justify-between">
                    <button
                        onClick={anteriorPaso}
                        disabled={paso === 1}
                        className={'px-4 py-2 text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 ' +
                            (paso === 1
                                ? 'text-slate-400 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-200')}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Atrás
                    </button>

                    {paso < 4 ? (
                        <button
                            onClick={siguientePaso}
                            disabled={!puedeAvanzar()}
                            className={'px-5 py-2 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm ' +
                                (!puedeAvanzar()
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600')}
                        >
                            Siguiente
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleCrear}
                            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Crear Evento
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};