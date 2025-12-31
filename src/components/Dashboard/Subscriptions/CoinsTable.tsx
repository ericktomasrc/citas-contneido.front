import { ShoppingBag, Coins as CoinsIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const CoinsTable = () => {
  const [cantidad, setCantidad] = useState(20);
  const [saldo] = useState(10);

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
    <div className="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de compra */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CoinsIcon className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Recargar Saldo</h2>
            </div>

            <div className="space-y-6">
              {/* Precio Info */}
              <div className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Precio por coin</span>
                  <span className="text-base font-bold text-yellow-700">1 coin = 2 S/.</span>
                </div>
              </div>

              {/* Descuentos Premium - MÁS COMPACTO */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-bold text-gray-900">Descuentos por volumen</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-0.5">0-10 coins</p>
                    <p className="text-base font-bold text-green-600">5%</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-0.5">11-20 coins</p>
                    <p className="text-base font-bold text-green-600">10%</p>
                  </div>
                  <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-0.5">21-30 coins</p>
                    <p className="text-base font-bold text-green-600">20%</p>
                  </div>
                </div>
              </div>

              {/* Input cantidad - AJUSTADO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad a comprar
                </label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  min="1"
                  className="w-40 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-base font-semibold text-gray-900"
                />
              </div>

              {/* Saldo actual - MÁS ANCHO */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu saldo actual
                </label>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl border-2 border-gray-200 min-w-[160px]">
                  <CoinsIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-base font-bold text-gray-900">{saldo} coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen sticky */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen de Compra</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cantidad</span>
                <span className="font-bold text-gray-900">{cantidad} coins</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Precio base</span>
                <span className="font-medium text-gray-900">{precioBase} S/.</span>
              </div>
              
              {descuento > 0 && (
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-semibold text-green-700">Descuento</span>
                  <span className="font-bold text-green-600">-{descuento}%</span>
                </div>
              )}
              
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-yellow-600">{precioFinal.toFixed(2)} S/.</span>
                </div>

                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-yellow-200 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Comprar Ahora
                </button>
              </div>

              {/* Info adicional */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Nuevo saldo: <span className="font-semibold text-gray-700">{saldo + cantidad} coins</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
