import { Crown, Calendar, TrendingUp, X } from 'lucide-react';

interface Subscription {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorPhoto: string;
  creatorUsername: string;
  tipo: 'fotos' | 'videos' | 'completo';
  precio: number;
  fechaInicio: string;
  fechaRenovacion: string;
  isActive: boolean;
}

export const ActiveSubscriptions = () => {
  // Mock data
  const subscriptions: Subscription[] = [
    {
      id: 1,
      creatorId: 1,
      creatorName: 'María Rodriguez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=1',
      creatorUsername: 'maria_lima',
      tipo: 'completo',
      precio: 140,
      fechaInicio: '2024-12-01',
      fechaRenovacion: '2025-01-01',
      isActive: true,
    },
    {
      id: 2,
      creatorId: 2,
      creatorName: 'Sofia Lopez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=5',
      creatorUsername: 'sofia_fitness',
      tipo: 'fotos',
      precio: 80,
      fechaInicio: '2024-12-05',
      fechaRenovacion: '2025-01-05',
      isActive: true,
    },
    {
      id: 3,
      creatorId: 3,
      creatorName: 'Ana Martinez',
      creatorPhoto: 'https://i.pravatar.cc/400?img=9',
      creatorUsername: 'ana_chef',
      tipo: 'videos',
      precio: 100,
      fechaInicio: '2024-12-10',
      fechaRenovacion: '2025-01-10',
      isActive: true,
    },
  ];

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'fotos': return '📷 Premium Fotos';
      case 'videos': return '🎥 Premium Videos';
      case 'completo': return '💎 Premium Completo';
      default: return tipo;
    }
  };

  const getDaysRemaining = (fechaRenovacion: string) => {
    const days = Math.ceil((new Date(fechaRenovacion).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Total Summary */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Gasto Mensual Total</p>
            <p className="text-4xl font-bold">
              S/. {subscriptions.reduce((acc, sub) => acc + sub.precio, 0)}<span className="text-2xl">/mes</span>
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/80">
            <span className="font-bold">{subscriptions.length}</span> suscripciones activas
          </p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Creadora</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Renovación</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.map((sub) => {
                const daysRemaining = getDaysRemaining(sub.fechaRenovacion);
                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    {/* Creadora */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={sub.creatorPhoto}
                          alt={sub.creatorName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{sub.creatorName}</p>
                          <p className="text-sm text-gray-500">@{sub.creatorUsername}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4 text-center">
                      <span className={`
                        inline-flex px-3 py-1 rounded-full text-xs font-bold
                        ${sub.tipo === 'completo' ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700' : ''}
                        ${sub.tipo === 'fotos' ? 'bg-blue-100 text-blue-700' : ''}
                        ${sub.tipo === 'videos' ? 'bg-purple-100 text-purple-700' : ''}
                      `}>
                        {getTipoLabel(sub.tipo)}
                      </span>
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-900">
                        <p className="text-xl font-bold">S/. {sub.precio}</p>
                        <p className="text-xs text-gray-500">/mes</p>
                      </div>
                    </td>

                    {/* Renovación */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {new Date(sub.fechaRenovacion).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold ${
                          daysRemaining <= 3 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {daysRemaining} días restantes
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-semibold transition">
                          Ver Perfil
                        </button>
                        <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};