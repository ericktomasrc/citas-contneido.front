import { ShoppingBag, Eye } from 'lucide-react';
import { useState } from 'react';

export const CoinsTable = () => {
  const [cantidad, setCantidad] = useState(20);
  const [saldo, setSaldo] = useState(10);

  const getDescuento = (coins: number) => {
    if (coins >= 21 && coins <= 30) return 20;
    if (coins >= 11 && coins <= 20) return 10;
    if (coins >= 0 && coins <= 10) return 5;
    return 0;
  };

  const descuento = getDescuento(cantidad);
  const precioBase = cantidad * 2;
  const precioFinal = precioBase - (precioBase * descuento / 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
      {/* Recargar Saldo */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recargar Saldo</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Reporte
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Precio Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Precio coins</span>
              <span className="text-sm font-semibold text-gray-900">1 coin = 2 S/.</span>
            </div>
          </div>

          {/* Descuentos */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Descuentos</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">0-10 coins</span>
                <span className="font-medium text-gray-900">5%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">11-20 coins</span>
                <span className="font-medium text-gray-900">10%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">21-30 coins</span>
                <span className="font-medium text-gray-900">20%</span>
              </div>
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad a comprar
            </label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Saldo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saldo
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-gray-900 font-semibold">{saldo} coins</span>
            </div>
          </div>

          {/* Comprar */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Comprar
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Resumen de Compra</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cantidad</span>
            <span className="font-semibold text-gray-900">{cantidad} coins</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Precio base</span>
            <span className="font-medium text-gray-900">{precioBase} S/.</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Descuento</span>
            <span className="font-medium text-green-600">-{descuento}%</span>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">{precioFinal.toFixed(2)} S/.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};