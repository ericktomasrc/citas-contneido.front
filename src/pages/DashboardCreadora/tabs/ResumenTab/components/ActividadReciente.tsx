interface ActividadItem {
  tipo: 'suscripcion' | 'regalo' | 'pack';
  titulo: string;
  tiempo: string;
  monto: number;
  icon: string;
  bgColor: string;
  textColor: string;
}

const actividadesRecientes: ActividadItem[] = [
  {
    tipo: 'suscripcion',
    titulo: 'Nueva suscripción',
    tiempo: 'Hace 2 horas',
    monto: 140,
    icon: '+',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600',
  },
  {
    tipo: 'regalo',
    titulo: 'Regalo recibido',
    tiempo: 'Hace 5 horas',
    monto: 50,
    icon: '🎁',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    tipo: 'pack',
    titulo: 'Pack vendido',
    tiempo: 'Hace 1 día',
    monto: 80,
    icon: '📦',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
];

export const ActividadReciente = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Actividad Reciente
      </h3>
      <div className="space-y-3">
        {actividadesRecientes.map((actividad, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
          >
            <div className={`w-9 h-9 ${actividad.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className={`${actividad.textColor} font-bold text-sm`}>
                {actividad.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {actividad.titulo}
              </p>
              <p className="text-xs text-slate-500">{actividad.tiempo}</p>
            </div>
            <span className={`${actividad.textColor} font-bold text-sm`}>
              +S/. {actividad.monto}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
