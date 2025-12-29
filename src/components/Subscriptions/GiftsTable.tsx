import { ShoppingBag, Eye, Check } from 'lucide-react';
import { useState } from 'react';

interface Gift {
  id: number;
  nombre: string;
  costo: number;
  cantidad: number;
}

export const GiftsTable = () => {
  const [gifts, setGifts] = useState<Gift[]>([
    { id: 1, nombre: 'dona', costo: 10, cantidad: 2 },
    { id: 2, nombre: 'rosa', costo: 20, cantidad: 3 },
    { id: 3, nombre: 'sombrero', costo: 30, cantidad: 0 },
    { id: 4, nombre: 'auto', costo: 40, cantidad: 0 },
    { id: 5, nombre: 'leon dorado', costo: 50, cantidad: 0 },
  ]);

  const saldoInicial = 150;
  const total = gifts.reduce((acc, gift) => acc + (gift.costo * gift.cantidad), 0);
  const saldoRestante = saldoInicial - total;

  const handleCantidadChange = (id: number, value: string) => {
    const cantidad = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(cantidad) || cantidad < 0) return;

    setGifts(gifts.map(gift => 
      gift.id === id ? { ...gift, cantidad } : gift
    ));
  };

  return (
    <div className="max-w-5xl">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header con Precio */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Comprar Regalos</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Reporte
            </button>
          </div>
          
          {/* Precio coins */}
          <div className="bg-white border border-gray-200 rounded px-4 py-2 inline-block">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Precio coins</span>
              <span className="text-sm font-medium text-gray-900">1 coins = 2 S/.</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Comprar Regalos
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gifts.map((gift) => {
                  const isValid = gift.cantidad > 0;
                  const saldoItem = gift.costo * gift.cantidad;
                  
                  return (
                    <tr key={gift.id} className="hover:bg-gray-50 transition">
                      {/* Nombre con Check */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                            isValid 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                          }`}>
                            {isValid && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-gray-900 font-medium capitalize">{gift.nombre}</span>
                        </div>
                      </td>

                      {/* Costo */}
                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-900 font-medium">{gift.costo} coins</span>
                      </td>

                      {/* Cantidad - EDITABLE */}
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={gift.cantidad || ''}
                          onChange={(e) => handleCantidadChange(gift.id, e.target.value)}
                          placeholder="0"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </td>

                      {/* Saldo */}
                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-900 font-medium">{saldoItem}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td className="px-4 py-4" colSpan={2}>
                    <span className="font-semibold text-gray-900">Total</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-gray-900">{total}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition inline-flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Comprar
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};