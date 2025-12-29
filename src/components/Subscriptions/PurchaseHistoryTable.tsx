import { Download, Eye } from 'lucide-react';

interface Purchase {
  id: number;
  tipo: string;
  creadora: string;
  monto: number;
  fecha: string;
  metodo: string;
}

export const PurchaseHistoryTable = () => {
  const purchases: Purchase[] = [
    { id: 1, tipo: 'Suscripción Premium Fotos', creadora: 'María Rodriguez', monto: 80, fecha: '2024-12-15', metodo: 'Tarjeta' },
    { id: 2, tipo: 'Invitaciones x23', creadora: '-', monto: 73, fecha: '2024-12-12', metodo: 'Tarjeta' },
    { id: 3, tipo: 'Coins x100', creadora: '-', monto: 13, fecha: '2024-12-10', metodo: 'Yape' },
    { id: 4, tipo: 'Regalo: León Dorado', creadora: 'Sofia Lopez', monto: 50, fecha: '2024-12-08', metodo: 'Coins' },
    { id: 5, tipo: 'Suscripción Premium Videos', creadora: 'Ana Martinez', monto: 100, fecha: '2024-12-05', metodo: 'Tarjeta' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Compras</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Exportar Todo
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Creadora
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Comprobante
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{purchase.tipo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{purchase.creadora}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-900">S/. {purchase.monto}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">
                      {new Date(purchase.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {purchase.metodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Descargar comprobante"
                    >
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Total de transacciones: <span className="font-semibold text-gray-900">{purchases.length}</span>
            </span>
            <span className="text-sm text-gray-600">
              Total gastado: <span className="font-semibold text-gray-900">S/. {purchases.reduce((acc, p) => acc + p.monto, 0)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 