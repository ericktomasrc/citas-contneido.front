import { ShoppingBag, Gift as GiftIcon, Check, Coins } from 'lucide-react';
import { useState } from 'react';

interface Gift {
  id: number;
  nombre: string;
  costo: number;
  cantidad: number;
  emoji: string;
}

export const GiftsTable = () => {
  const [gifts, setGifts] = useState<Gift[]>([
    { id: 1, nombre: 'Dona', costo: 10, cantidad: 2, emoji: '🍩' },
    { id: 2, nombre: 'Rosa', costo: 20, cantidad: 3, emoji: '🌹' },
    { id: 3, nombre: 'Sombrero', costo: 30, cantidad: 0, emoji: '🎩' },
    { id: 4, nombre: 'Auto', costo: 40, cantidad: 0, emoji: '🚗' },
    { id: 5, nombre: 'León Dorado', costo: 50, cantidad: 0, emoji: '🦁' },
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
    <div className="max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Grid de regalos */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GiftIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900">Comprar Regalos</h2>
                </div>
                <div className="px-4 py-2 bg-blue-50 rounded-xl">
                  <span className="text-sm font-semibold text-blue-700">1 coin = 2 S/.</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {gifts.map((gift) => {
                  const isSelected = gift.cantidad > 0;
                  const subtotal = gift.costo * gift.cantidad;
                  
                  return (
                    <div
                      key={gift.id}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Check badge */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Emoji */}
                      <div className="text-center mb-2">
                        <span className="text-3xl">{gift.emoji}</span>
                      </div>

                      {/* Nombre */}
                      <h3 className="text-center font-bold text-gray-900 mb-2 text-sm">
                        {gift.nombre}
                      </h3>

                      {/* Costo */}
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Coins className="w-3 h-3 text-yellow-500" />
                        <span className="text-base font-bold text-gray-900">{gift.costo}</span>
                        <span className="text-xs text-gray-500">coins</span>
                      </div>

                      {/* Input cantidad */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 text-center">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={gift.cantidad || ''}
                          onChange={(e) => handleCantidadChange(gift.id, e.target.value)}
                          placeholder="0"
                          className={`w-full px-2 py-1.5 border-2 rounded-lg text-center font-bold text-sm transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-white text-blue-600'
                              : 'border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      {/* Subtotal */}
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-600">Subtotal</span>
                            <span className="text-xs font-bold text-blue-600">{subtotal} coins</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen sticky */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen</h3>
            
            <div className="space-y-4">
              {/* Saldo */}
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-xs font-semibold text-gray-600 mb-1">Saldo actual</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{saldoInicial}</span>
                </div>
              </div>

              {/* Items seleccionados */}
              <div className="space-y-2">
                {gifts.filter(g => g.cantidad > 0).map(gift => (
                  <div key={gift.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {gift.emoji} {gift.nombre} x{gift.cantidad}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {gift.costo * gift.cantidad}
                    </span>
                  </div>
                ))}
                {gifts.every(g => g.cantidad === 0) && (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No has seleccionado regalos
                  </p>
                )}
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Total</span>
                  <span className="text-xl font-bold text-gray-900">{total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Saldo restante</span>
                  <span className={`text-lg font-bold ${saldoRestante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {saldoRestante}
                  </span>
                </div>
              </div>

              <button 
                disabled={total === 0 || saldoRestante < 0}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                {total === 0 ? 'Selecciona regalos' : 'Comprar Ahora'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
