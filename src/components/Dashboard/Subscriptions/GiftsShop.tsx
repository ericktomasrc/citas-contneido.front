import { Gift, ShoppingCart } from 'lucide-react';

interface GiftsShopProps {
  currentBalance: number;
}

export const GiftsShop = ({ currentBalance }: GiftsShopProps) => {
  const gifts = [
    { id: 1, nombre: 'Dona', icon: '🍩', costo: 10, cantidad: 2 },
    { id: 2, nombre: 'Rosa', icon: '🌹', costo: 20, cantidad: 3 },
    { id: 3, nombre: 'Sombrero', icon: '🎩', costo: 30, cantidad: 1 },
    { id: 4, nombre: 'Auto', icon: '🚗', costo: 40, cantidad: 1 },
    { id: 5, nombre: 'León Dorado', icon: '🦁', costo: 50, cantidad: 0 },
  ];

  const totalCost = gifts.reduce((acc, gift) => acc + (gift.costo * gift.cantidad), 0);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tienda de Regalos</h2>
            <p className="text-white/80">
              Envía regalos especiales a tus creadoras favoritas
            </p>
          </div>
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Gift className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">Saldo disponible:</p>
            <p className="text-4xl font-bold">{currentBalance} Coins</p>
          </div>
          {totalCost > 0 && (
            <div className="text-right">
              <p className="text-sm text-white/80">Costo total:</p>
              <p className="text-3xl font-bold">{totalCost} Coins</p>
            </div>
          )}
        </div>
      </div>

      {/* Gifts Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Regalo</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Costo</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gifts.map((gift) => (
              <tr key={gift.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{gift.icon}</div>
                    <span className="font-semibold text-gray-900">{gift.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xl font-bold text-gray-900">{gift.costo} coins</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-900">
                    {gift.cantidad}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td className="px-6 py-4" colSpan={2}>
                <span className="text-lg font-bold text-gray-900">Total</span>
              </td>
              <td className="px-6 py-4 text-center">
                <button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2 mx-auto">
                  <ShoppingCart className="w-5 h-5" />
                  Comprar - {totalCost} Coins
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};