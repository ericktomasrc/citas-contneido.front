import { DollarSign, Users, ThumbsUp, Radio } from 'lucide-react';

export const StatsCards = () => {
  const stats = [
    {
      id: 1,
      label: 'Ganancias Hoy',
      value: 'S/. 450',
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive' as const,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 2,
      label: 'Suscriptores Activos',
      value: '234',
      icon: Users,
      change: '+8',
      changeType: 'positive' as const,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 3,
      label: 'Cantidad de Sugerencias', // ✅ CAMBIO
      value: '156',
      icon: ThumbsUp, // ✅ CAMBIO
      change: '+23',
      changeType: 'positive' as const,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 4,
      label: 'Lives Este Mes',
      value: '12',
      icon: Radio,
      change: '+3',
      changeType: 'positive' as const,
      gradient: 'from-red-500 to-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {stat.change}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};