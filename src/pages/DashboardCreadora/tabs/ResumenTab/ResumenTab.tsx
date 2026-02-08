import { TrendingUp, DollarSign, Users, Heart, Radio, Gift, Package, Star } from 'lucide-react';

interface ResumenTabProps {
  nombreUsuario: string;
  gananciasMes: number;
}

export const ResumenTab = ({ nombreUsuario, gananciasMes }: ResumenTabProps) => {
  const stats = [
    { label: 'Hoy', value: 'S/. 450', icon: DollarSign, change: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Suscriptores', value: '234', icon: Users, change: '+8', color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Sugerencias', value: '156', icon: Heart, change: '+23', color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Lives', value: '12', icon: Radio, change: '+3', color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const actividades = [
    { titulo: 'Nueva suscripción', tiempo: 'Hace 2h', monto: 140, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
    { titulo: 'Regalo recibido', tiempo: 'Hace 5h', monto: 50, icon: Gift, color: 'text-rose-500', bg: 'bg-rose-50' },
    { titulo: 'Pack vendido', tiempo: 'Hace 1d', monto: 80, icon: Package, color: 'text-sky-500', bg: 'bg-sky-50' },
  ];

  const lives = [
    { titulo: 'Yoga Matutina', fecha: 'Hoy, 10:00 AM' },
  ];

  return (
    <div className="space-y-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-700">
            Hola, {nombreUsuario}
          </h2>
          <p className="text-xs text-slate-400">Resumen de actividad</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <div>
            <p className="text-[10px] text-emerald-600 font-medium leading-none">Este mes</p>
            <p className="text-sm font-bold text-emerald-700">S/. {gananciasMes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stats en fila compacta */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-medium text-emerald-500">{stat.change}</span>
            </div>
            <p className="text-lg font-bold text-slate-700">{stat.value}</p>
            <p className="text-[10px] text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actividad y Lives lado a lado */}
      <div className="grid grid-cols-2 gap-3">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600 mb-3">Actividad Reciente</h3>
          <div className="space-y-2">
            {actividades.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition">
                <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 truncate">{item.titulo}</p>
                  <p className="text-[10px] text-slate-400">{item.tiempo}</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600">+S/.{item.monto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Lives */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600 mb-3">Próximos Lives</h3>
          <div className="space-y-2">
            {lives.map((live, i) => (
              <div key={i} className="p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-semibold text-rose-500">PROGRAMADO</span>
                </div>
                <p className="text-xs font-medium text-slate-700">{live.titulo}</p>
                <p className="text-[10px] text-slate-400">{live.fecha}</p>
              </div>
            ))}
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] text-slate-400 text-center">Sin más lives programados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};