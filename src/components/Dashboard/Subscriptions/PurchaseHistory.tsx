import { Download, FileText } from 'lucide-react';

export const PurchaseHistory = () => {
  const history = [
    { id: 1, tipo: 'Suscripción Premium Fotos', creadora: 'María Rodriguez', monto: 80, fecha: '2024-12-15', metodo: 'Tarjeta' },
    { id: 2, tipo: 'Invitaciones x23', creadora: '-', monto: 73, fecha: '2024-12-12', metodo: 'Tarjeta' },
    { id: 3, tipo: 'Coins x100', creadora: '-', monto: 13, fecha: '2024-12-10', metodo: 'Yape' },
    { id: 4, tipo: 'Regalo: León Dorado', creadora: 'Sofia Lopez', monto: 50, fecha: '2024-12-08', metodo: 'Coins' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Historial de Compras</h2>
            <p className="text-white/80">
              Revisa todas tus transacciones y descargas comprobantes
            </p>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Creadora</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Monto</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Método</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Comprobante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">{item.tipo}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">{item.creadora}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-gray-900">S/. {item.monto}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-600">
                    {new Date(item.fecha).toLocaleDateString('es-ES')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                    {item.metodo}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition">
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};