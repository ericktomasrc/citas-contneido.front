import { Crown } from 'lucide-react';

interface Subscription {
  id: number;
  usuario: string;
  avatarUrl: string;
  fotos: number;
  videos: number;
  fechaInscripcion: string;
}

export const ActiveSubscriptionsTable = () => {
  const subscriptions: Subscription[] = [
    { id: 1, usuario: 'erick', avatarUrl: 'https://i.pravatar.cc/150?img=12', fotos: 15, videos: 20, fechaInscripcion: '2025-12-12' },
    { id: 2, usuario: 'juan', avatarUrl: 'https://i.pravatar.cc/150?img=13', fotos: 20, videos: 25, fechaInscripcion: '2025-12-12' },
  ];

  const total = subscriptions.reduce((acc, sub) => acc + sub.fotos + sub.videos, 0);

  return (
    <div className="max-w-6xl space-y-6">
      {/* Card Premium con estadísticas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Gasto Mensual Total</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {total} S/.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">
                {subscriptions.length} suscripciones activas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Premium */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Fotos
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Videos
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Fecha Inscripción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={sub.avatarUrl}
                          alt={sub.usuario}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sub.usuario}</p>
                        <p className="text-xs text-gray-500">Suscripción Premium</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900">
                      {sub.fotos} S/.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900">
                      {sub.videos} S/.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">{sub.fechaInscripcion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-200">
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center" colSpan={3}>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {total} S/.
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
