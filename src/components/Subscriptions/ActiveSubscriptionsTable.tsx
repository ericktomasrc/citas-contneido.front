import { Eye } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Total */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Gasto Mensual Total</p>
            <p className="text-4xl font-bold text-gray-900">35 S/.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{subscriptions.length} suscripciones activas</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fotos
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha de Inscripción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.avatarUrl}
                      alt={sub.usuario}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{sub.usuario}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-900 font-medium">{sub.fotos} S/.</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-900 font-medium">{sub.videos} S/.</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-600 text-sm">{sub.fechaInscripcion}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td className="px-6 py-4 font-semibold text-gray-900">Total</td>
              <td className="px-6 py-4" colSpan={3}>
                <span className="text-gray-900 font-semibold">{total} S/.</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};