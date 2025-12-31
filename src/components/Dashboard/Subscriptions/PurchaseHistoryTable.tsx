import { Download, FileText, Calendar, CreditCard } from 'lucide-react';

interface Purchase {
  id: number;
  tipo: string;
  creadora: string;
  monto: number;
  fecha: string;
  metodo: string;
  categoria: 'suscripcion' | 'invitacion' | 'coins' | 'regalo';
}

export const PurchaseHistoryTable = () => {
  const purchases: Purchase[] = [
    { id: 1, tipo: 'Suscripción Premium Fotos', creadora: 'María Rodriguez', monto: 80, fecha: '2024-12-15', metodo: 'Tarjeta', categoria: 'suscripcion' },
    { id: 2, tipo: 'Invitaciones x23', creadora: '-', monto: 73, fecha: '2024-12-12', metodo: 'Tarjeta', categoria: 'invitacion' },
    { id: 3, tipo: 'Coins x100', creadora: '-', monto: 13, fecha: '2024-12-10', metodo: 'Yape', categoria: 'coins' },
    { id: 4, tipo: 'Regalo: León Dorado', creadora: 'Sofia Lopez', monto: 50, fecha: '2024-12-08', metodo: 'Coins', categoria: 'regalo' },
    { id: 5, tipo: 'Suscripción Premium Videos', creadora: 'Ana Martinez', monto: 100, fecha: '2024-12-05', metodo: 'Tarjeta', categoria: 'suscripcion' },
  ];

  const totalGastado = purchases.reduce((acc, p) => acc + p.monto, 0);

  const getCategoryColor = (categoria: string) => {
    const colors = {
      suscripcion: 'bg-purple-100 text-purple-700 border-purple-200',
      invitacion: 'bg-pink-100 text-pink-700 border-pink-200',
      coins: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      regalo: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getMetodoColor = (metodo: string) => {
    const colors: Record<string, string> = {
      'Tarjeta': 'bg-gray-100 text-gray-700',
      'Yape': 'bg-purple-100 text-purple-700',
      'Coins': 'bg-yellow-100 text-yellow-700',
    };
    return colors[metodo] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-semibold text-gray-600">Total Transacciones</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-semibold text-gray-600">Total Gastado</p>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            S/. {totalGastado}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <p className="text-sm font-semibold text-gray-600">Última Compra</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {new Date(purchases[0].fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Creadora
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Comprobante
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{purchase.tipo}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getCategoryColor(purchase.categoria)}`}>
                        {purchase.categoria}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{purchase.creadora}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-900">
                      S/. {purchase.monto}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">
                      {new Date(purchase.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getMetodoColor(purchase.metodo)}`}>
                      {purchase.metodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                      title="Descargar comprobante"
                    >
                      <Download className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
